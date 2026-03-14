import React, { useState, useEffect, useCallback } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, pointerWithin, rectIntersection } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './Column'
import TaskCard from './TaskCard'
import TaskDialog from './TaskDialog'
import TaskDetailDialog from './TaskDetailDialog'
import { useSocket } from '../../hooks/useSocket.jsx'

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-zinc-500' },
  { id: 'todo', title: 'Todo', color: 'bg-blue-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
]

// Map our task statuses to column IDs
const STATUS_TO_COLUMN = {
  'backlog': 'backlog',
  'pending': 'todo',
  'in_progress': 'in-progress',
  'done': 'done',
  'archived': 'archived',
}

const COLUMN_TO_STATUS = {
  'backlog': 'backlog',
  'todo': 'pending',
  'in-progress': 'in_progress',
  'done': 'done',
  'archived': 'archived',
}

export default function Board() {
  const [tasks, setTasks] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [viewTask, setViewTask] = useState(null)
  const [showArchived, setShowArchived] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const collisionDetection = useCallback((args) => {
    const pw = pointerWithin(args)
    if (pw.length > 0) return pw
    return rectIntersection(args)
  }, [])

  const fetchTasks = useCallback(async () => {
    const res = await fetch('/api/tasks')
    setTasks(await res.json())
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])
  useSocket('tasks', setTasks)

  const activeTask = tasks.find(t => t.id === activeId)

  function getColumnTasks(columnId) {
    const status = COLUMN_TO_STATUS[columnId]
    const filtered = tasks.filter(t => t.status === status)
    if (columnId === 'done' || columnId === 'archived') {
      return filtered.sort((a, b) => {
        const da = a.completedAt || a.updatedAt || a.createdAt || ''
        const db = b.completedAt || b.updatedAt || b.createdAt || ''
        return db.localeCompare(da)
      })
    }
    return filtered.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999))
  }

  function findColumn(taskId) {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return null
    return STATUS_TO_COLUMN[task.status] || null
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeTaskObj = tasks.find(t => t.id === active.id)
    if (!activeTaskObj) return

    const isColumn = COLUMNS.find(c => c.id === over.id) || (showArchived && over.id === 'archived')
    let targetColumn, overTaskId
    if (isColumn) {
      targetColumn = over.id
      overTaskId = null
    } else {
      const overTask = tasks.find(t => t.id === over.id)
      if (!overTask) return
      targetColumn = STATUS_TO_COLUMN[overTask.status] || overTask.status
      overTaskId = over.id
    }

    const sourceColumn = STATUS_TO_COLUMN[activeTaskObj.status] || activeTaskObj.status
    const sourceStatus = COLUMN_TO_STATUS[sourceColumn] || sourceColumn
    const targetStatus = COLUMN_TO_STATUS[targetColumn] || targetColumn

    if (sourceStatus === targetStatus) {
      const columnTasks = getColumnTasks(sourceColumn)
      const oldIndex = columnTasks.findIndex(t => t.id === active.id)
      const newIndex = overTaskId ? columnTasks.findIndex(t => t.id === overTaskId) : columnTasks.length - 1
      if (oldIndex === newIndex) return

      const reordered = arrayMove(columnTasks, oldIndex, newIndex)
      const orderMap = {}
      reordered.forEach((t, i) => { orderMap[t.id] = i })

      setTasks(prev => prev.map(t => orderMap[t.id] !== undefined ? { ...t, order: orderMap[t.id] } : t))

      try {
        await fetch('/api/tasks/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: sourceStatus, order: reordered.map(t => t.id) }),
        })
      } catch {
        fetchTasks()
      }
    } else {
      const targetTasks = getColumnTasks(targetColumn)
      let newOrder
      if (overTaskId) {
        const overIndex = targetTasks.findIndex(t => t.id === overTaskId)
        const overTask = targetTasks[overIndex]
        newOrder = (overTask?.order ?? overIndex) + 1
        setTasks(prev => prev.map(t => {
          if (t.id === active.id) return { ...t, status: targetStatus, order: newOrder }
          if (t.status === targetStatus && (t.order ?? 999999) >= newOrder) return { ...t, order: (t.order ?? 999999) + 1 }
          return t
        }))
      } else {
        newOrder = targetTasks.length
        setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: targetStatus, order: newOrder } : t))
      }
      try {
        await fetch(`/api/tasks/${active.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus, order: newOrder }),
        })
        const updatedTargetTasks = [...targetTasks.filter(t => t.id !== active.id)]
        const insertAt = overTaskId ? updatedTargetTasks.findIndex(t => t.id === overTaskId) + 1 : updatedTargetTasks.length
        updatedTargetTasks.splice(insertAt, 0, { id: active.id })
        await fetch('/api/tasks/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus, order: updatedTargetTasks.map(t => t.id) }),
        })
        fetchTasks()
      } catch {
        fetchTasks()
      }
    }
  }

  async function handleSave(data) {
    if (editTask) {
      await fetch(`/api/tasks/${editTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    setDialogOpen(false)
    setEditTask(null)
    fetchTasks()
  }

  async function handleDelete(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    fetchTasks()
  }

  async function handleRun(id) {
    await fetch(`/api/tasks/${id}/run`, { method: 'POST' })
    fetchTasks()
  }

  async function handleToggleSchedule(id, enabled) {
    await fetch(`/api/tasks/${id}/schedule-toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    })
    fetchTasks()
  }

  async function handleQuickAdd(status, title, skills = []) {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status, skills, skill: skills[0] || '' }),
    })
    fetchTasks()
  }

  function openNew(status) {
    setEditTask(null)
    setDialogOpen(true)
  }

  function openEdit(task) {
    setEditTask(task)
    setDialogOpen(true)
  }

  function openView(task) {
    setViewTask(task)
  }

  // Count tasks by status
  const counts = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    todo: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    archived: tasks.filter(t => t.status === 'archived').length,
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragStart={e => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 h-full overflow-x-auto pb-2">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={getColumnTasks(col.id)}
              count={counts[col.id] || 0}
              onAdd={() => openNew(col.id)}
              onQuickAdd={handleQuickAdd}
              onEdit={openEdit}
              onView={openView}
              onDelete={handleDelete}
              onRun={handleRun}
              onToggleSchedule={handleToggleSchedule}
            />
          ))}
          {showArchived && (
            <Column
              column={{ id: 'archived', title: 'Archived', color: 'bg-gray-500' }}
              tasks={getColumnTasks('archived')}
              count={counts.archived}
              onAdd={() => {}}
              onQuickAdd={() => {}}
              onEdit={() => {}}
              onView={openView}
              onDelete={() => {}}
              onRun={() => {}}
              onToggleSchedule={() => {}}
              isArchived
            />
          )}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {/* Toggle button for archived */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-4 py-2 rounded-lg shadow-lg ${showArchived ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {showArchived ? '🙈 Hide Archived' : '👁️ Show Archived'}
        </button>
      </div>

      <TaskDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditTask(null) }}
        onSave={handleSave}
        task={editTask}
      />
      <TaskDetailDialog
        open={!!viewTask}
        onClose={() => setViewTask(null)}
        task={viewTask}
      />
    </>
  )
}