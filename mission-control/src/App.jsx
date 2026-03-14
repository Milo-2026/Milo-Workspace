import { useState, useEffect } from 'react'

// Sample data for MVP (will come from Supabase later)
const initialAgents = [
  { id: 1, name: 'Milo', role: 'General Assistant', status: 'active', description: 'Main assistant for all tasks' },
  { id: 2, name: 'Coding Agent', role: 'Development', status: 'idle', description: 'Handles code generation and reviews' },
  { id: 3, name: 'Social Media Strategy', role: 'Marketing', status: 'active', description: 'Plans content strategy' },
  { id: 4, name: 'Content Publisher', role: 'Marketing', status: 'active', description: 'Posts and manages social content' },
  { id: 5, name: 'Security Agent', role: 'Operations', status: 'idle', description: 'Monitors security and access' },
  { id: 6, name: 'Project Manager', role: 'Management', status: 'active', description: 'Tracks tasks and milestones' },
]

const initialTasks = [
  { id: 1, title: 'Fix social media orchestrator', description: 'Debug posting issues', assignee: 'Milo', status: 'in_progress', created: '2026-02-12', nextSteps: 'Add proper logging' },
  { id: 2, title: 'Create Mission Control MVP', description: 'Build local prototype', assignee: 'Milo', status: 'completed', created: '2026-02-13', nextSteps: 'Deploy to Vercel' },
  { id: 3, title: 'Refresh Sheet It Now tokens', description: 'Fix 401 auth errors', assignee: 'Milo', status: 'not_started', created: '2026-02-12', nextSteps: 'Get new X API credentials' },
  { id: 4, title: 'Write blog post', description: 'Roofing industry trends', assignee: 'Content Publisher', status: 'not_started', created: '2026-02-13', nextSteps: 'Research keywords' },
  { id: 5, title: 'Review security logs', description: 'Weekly check', assignee: 'Security Agent', status: 'not_started', created: '2026-02-13', nextSteps: 'Check access patterns' },
]

const statuses = [
  { key: 'not_started', label: 'Not Started', color: '#6b7280' },
  { key: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { key: 'completed', label: 'Completed', color: '#22c55e' },
  { key: 'archived', label: 'Archived', color: '#4b5563' },
]

function App() {
  const [activeTab, setActiveTab] = useState('board')
  const [agents, setAgents] = useState(initialAgents)
  const [tasks, setTasks] = useState(initialTasks)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', nextSteps: '' })

  const addTask = () => {
    if (!newTask.title) return
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'not_started',
      created: new Date().toISOString().split('T')[0],
    }
    setTasks([...tasks, task])
    setNewTask({ title: '', description: '', assignee: '', nextSteps: '' })
    setShowAddTask(false)
  }

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status)

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f23', padding: '20px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>🚀 Mission Control</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Agent Management & Project Tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`tab ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            📋 Board
          </button>
          <button 
            className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            🤖 Agents
          </button>
          <button 
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            📅 Timeline
          </button>
        </div>
      </header>

      {/* Board View */}
      {activeTab === 'board' && (
        <>
          {/* Add Task Button */}
          <div style={{ marginBottom: '20px' }}>
            <button className="btn btn-primary" onClick={() => setShowAddTask(!showAddTask)}>
              + Add Task
            </button>
          </div>

          {/* Add Task Form */}
          {showAddTask && (
            <div style={{ 
              background: '#1e1e2e', 
              padding: '20px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              display: 'grid',
              gap: '15px',
              gridTemplateColumns: '1fr 1fr'
            }}>
              <input
                className="input"
                placeholder="Task Name"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                style={{ gridColumn: '1 / -1' }}
              />
              <textarea
                className="input"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                style={{ gridColumn: '1 / -1', minHeight: '80px' }}
              />
              <select
                className="input"
                value={newTask.assignee}
                onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
              >
                <option value="">Select Assignee</option>
                {agents.map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
              <input
                className="input"
                placeholder="Next Steps"
                value={newTask.nextSteps}
                onChange={(e) => setNewTask({...newTask, nextSteps: e.target.value})}
              />
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={addTask}>Add Task</button>
                <button className="btn btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Kanban Board */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '20px',
            alignItems: 'start'
          }}>
            {statuses.filter(s => s.key !== 'archived').map(status => (
              <div key={status.key} className="kanban-column" style={{ padding: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #2a2a3e'
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: status.color }} />
                  <span style={{ fontWeight: '600', color: '#fff' }}>{status.label}</span>
                  <span style={{ 
                    background: '#2a2a3e', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    {getTasksByStatus(status.key).length}
                  </span>
                </div>

                {getTasksByStatus(status.key).map(task => (
                  <div key={task.id} className="task-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h4 style={{ fontWeight: '600', color: '#fff' }}>{task.title}</h4>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '10px' }}>
                      {task.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        background: '#2a2a3e', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        color: '#9ca3af'
                      }}>
                        {task.assignee}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) => moveTask(task.id, e.target.value)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: status.color,
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {statuses.map(s => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    {task.nextSteps && (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #2a2a3e' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Next: </span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{task.nextSteps}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Agents View */}
      {activeTab === 'agents' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {agents.map(agent => (
            <div key={agent.id} className="agent-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{agent.name}</h3>
                  <span style={{ fontSize: '13px', color: '#3b82f6' }}>{agent.role}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontSize: '12px',
                  color: agent.status === 'active' ? '#22c55e' : agent.status === 'idle' ? '#f59e0b' : '#6b7280'
                }}>
                  <div className={`status-dot ${agent.status}`} />
                  {agent.status}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>
                {agent.description}
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '20px',
                paddingTop: '12px',
                borderTop: '1px solid #2a2a3e',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <span>Tasks: {tasks.filter(t => t.assignee === agent.name).length}</span>
                <span>Active: {tasks.filter(t => t.assignee === agent.name && t.status === 'in_progress').length}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {activeTab === 'timeline' && (
        <div style={{ background: '#1e1e2e', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '20px' }}>📅 Activity Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...tasks].sort((a, b) => new Date(b.created) - new Date(a.created)).map(task => (
              <div key={task.id} style={{ 
                display: 'flex', 
                gap: '16px', 
                padding: '12px', 
                background: '#181825', 
                borderRadius: '8px',
                alignItems: 'center'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '8px', 
                  background: statuses.find(s => s.key === task.status)?.color + '30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {task.status === 'completed' ? '✅' : task.status === 'in_progress' ? '🔄' : '📝'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: '500', color: '#fff', marginBottom: '4px' }}>{task.title}</h4>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {task.assignee} • {task.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{task.created}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ 
        marginTop: '40px', 
        padding: '20px', 
        textAlign: 'center', 
        color: '#4b5563',
        fontSize: '12px'
      }}>
        Mission Control MVP • Local Prototype • Connect Supabase to enable cloud sync
      </footer>
    </div>
  )
}

export default App