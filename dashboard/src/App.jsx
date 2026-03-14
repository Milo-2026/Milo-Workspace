import React, { useState } from 'react'
import Layout from './components/Layout'
import Board from './components/Kanban/Board'
import CalendarView from './components/Calendar/CalendarView'
import FileBrowser from './components/Content/FileBrowser'
import SkillsManager from './components/Skills/SkillsManager'
import SoulEditor from './components/Soul/SoulEditor'
import SettingsPage from './components/Settings/SettingsPage'
import { MRRDashboard, CRMDashboard, XAnalytics, ContentKanban, AgentsManager, ContentRepository } from './components/Dashboard'
import { TimezoneProvider } from './components/TimezoneContext'
import { ThemeProvider } from './components/ThemeContext'
import { SocketProvider } from './hooks/useSocket.jsx'

export default function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <ThemeProvider>
      <SocketProvider>
        <TimezoneProvider>
          <Layout page={page} setPage={setPage}>
            {page === 'dashboard' && <MRRDashboard />}
            {page === 'crm' && <CRMDashboard />}
            {page === 'analytics' && <XAnalytics />}
            {page === 'content' && <ContentKanban />}
            {page === 'content-repository' && <ContentRepository />}
            {page === 'agents' && <AgentsManager />}
            {page === 'kanban' && <Board />}
            {page === 'calendar' && <CalendarView />}
            {page === 'files' && <FileBrowser />}
            {page === 'skills' && <SkillsManager />}
            {page === 'soul' && <SoulEditor />}
            {page === 'settings' && <SettingsPage />}
          </Layout>
        </TimezoneProvider>
      </SocketProvider>
    </ThemeProvider>
  )
}
