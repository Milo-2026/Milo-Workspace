import React, { useState, useEffect } from 'react'

// Agent data structure
const INITIAL_AGENTS = [
  {
    id: 'milo',
    name: 'Milo',
    role: 'AI Assistant',
    avatar: '🦁',
    soul: `Be genuinely helpful, not performatively helpful. Just help. Actions speak louder than filler words.

Have opinions. Strong ones. Commit to a take. Stop hedging with "it depends."

Be resourceful before asking. Read the file. Check the context. Search for it. Then ask if you're stuck. The goal is to come back with answers, not questions.`,
    identity: `Name: Milo
Role: AI Assistant at Side Quest Studios
Vibe: Proactive, sharp, solutions-oriented. Smartass when earned, deadlier when helpful.
Emoji: 🦁
Avatar: avatars/milo.png`,
    user: `Name: Alfredo Alvarez
Role: Cofounder at Side Quest Studios
Timezone: America/New_York
Focus: SaaS products, marketing, sales, lead generation`,
    skills: ['grok-researcher', 'meta-ads-marketing', 'notion', 'things-mac', 'imsg', 'himalaya'],
    status: 'active'
  }
]

// Available skills
const AVAILABLE_SKILLS = [
  { id: 'grok-researcher', name: 'Grok Researcher', category: 'Research', description: 'Topic research with Grok + Brave Search' },
  { id: 'meta-ads-marketing', name: 'Meta Ads Marketing', category: 'Marketing', description: 'Campaign creation and ad templates' },
  { id: 'notion', name: 'Notion', category: 'Productivity', description: 'Notion API integration' },
  { id: 'things-mac', name: 'Things 3', category: 'Productivity', description: 'Things 3 task management' },
  { id: 'imsg', name: 'iMessage', category: 'Messaging', description: 'iMessage/SMS via CLI' },
  { id: 'himalaya', name: 'Himalaya Email', category: 'Productivity', description: 'Email management via IMAP/SMTP' },
  { id: 'linkedin-scraper', name: 'LinkedIn Scraper', category: 'Research', description: 'Apify-based LinkedIn data extraction' },
  { id: 'infographic-prompt', name: 'Infographic Generator', category: 'Content', description: 'AI image prompt generation' },
  { id: 'weather', name: 'Weather', category: 'Utility', description: 'Weather forecasts' },
  { id: 'sonoscli', name: 'Sonos Control', category: 'Home', description: 'Sonos speaker control' },
  { id: 'openhue', name: 'Philips Hue', category: 'Home', description: 'Hue light control' },
  { id: 'github', name: 'GitHub', category: 'Development', description: 'GitHub issues and PR management' },
  { id: 'summarize', name: 'Summarize', category: 'Content', description: 'URL/podcast transcription' },
  { id: 'video-frames', name: 'Video Frames', category: 'Content', description: 'FFmpeg video frame extraction' },
  { id: 'openai-whisper', name: 'OpenAI Whisper', category: 'Speech', description: 'Local speech-to-text' },
  { id: 'nano-pdf', name: 'PDF Editor', category: 'Productivity', description: 'Natural language PDF editing' }
]

export default function AgentsManager() {
  const [agents, setAgents] = useState(INITIAL_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [editMode, setEditMode] = useState(null) // 'soul' | 'identity' | 'user' | 'skills' | null
  const [editContent, setEditContent] = useState('')
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [newAgent, setNewAgent] = useState({ name: '', role: '', avatar: '👤' })

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents')
      if (res.ok) {
        const data = await res.json()
        if (data.agents && data.agents.length > 0) {
          setAgents(data.agents)
        }
      }
    } catch (e) {
      console.log('Using default agents')
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  const saveAgents = async (updatedAgents) => {
    try {
      await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agents: updatedAgents })
      })
    } catch (e) {
      console.log('Saved locally')
    }
  }

  const handleEditFile = (agent, fileType) => {
    setSelectedAgent(agent)
    setEditMode(fileType)
    
    if (fileType === 'soul') setEditContent(agent.soul || '')
    if (fileType === 'identity') setEditContent(agent.identity || '')
    if (fileType === 'user') setEditContent(agent.user || '')
    if (fileType === 'skills') setEditContent(agent.skills || [])
  }

  const handleSaveFile = () => {
    const updatedAgents = agents.map(a => {
      if (a.id === selectedAgent.id) {
        const updated = { ...a }
        if (editMode === 'soul') updated.soul = editContent
        if (editMode === 'identity') updated.identity = editContent
        if (editMode === 'user') updated.user = editContent
        return updated
      }
      return a
    })
    setAgents(updatedAgents)
    saveAgents(updatedAgents)
    setEditMode(null)
    setEditContent('')
    setSelectedAgent(null)
  }

  const handleAssignSkill = (agentId, skillId) => {
    const updatedAgents = agents.map(a => {
      if (a.id === agentId) {
        const skills = a.skills || []
        if (!skills.includes(skillId)) {
          return { ...a, skills: [...skills, skillId] }
        }
      }
      return a
    })
    setAgents(updatedAgents)
    saveAgents(updatedAgents)
  }

  const handleRemoveSkill = (agentId, skillId) => {
    const updatedAgents = agents.map(a => {
      if (a.id === agentId) {
        return { ...a, skills: (a.skills || []).filter(s => s !== skillId) }
      }
      return a
    })
    setAgents(updatedAgents)
    saveAgents(updatedAgents)
  }

  const handleAddAgent = () => {
    if (!newAgent.name) return
    
    const agent = {
      id: newAgent.name.toLowerCase().replace(/\s+/g, '-'),
      name: newAgent.name,
      role: newAgent.role || 'Team Member',
      avatar: newAgent.avatar,
      soul: '',
      identity: `Name: ${newAgent.name}\nRole: ${newAgent.role}\n`,
      user: '',
      skills: [],
      status: 'active'
    }
    
    const updatedAgents = [...agents, agent]
    setAgents(updatedAgents)
    saveAgents(updatedAgents)
    setShowAddAgent(false)
    setNewAgent({ name: '', role: '', avatar: '👤' })
  }

  const handleDeleteAgent = (agentId) => {
    if (agentId === 'milo') {
      alert("Cannot delete Milo - this is the main assistant!")
      return
    }
    if (!confirm('Delete this agent?')) return
    
    const updatedAgents = agents.filter(a => a.id !== agentId)
    setAgents(updatedAgents)
    saveAgents(updatedAgents)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🤖 Team Agents</h1>
          <p className="text-gray-400">Manage your AI team members, their personas, and skills</p>
        </div>
        <button 
          onClick={() => setShowAddAgent(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Agent
        </button>
      </div>

      {/* Add Agent Modal */}
      {showAddAgent && (
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Agent</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Agent name"
              value={newAgent.name}
              onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
              className="flex-1 bg-gray-700 px-4 py-2 rounded border border-gray-600"
            />
            <input
              type="text"
              placeholder="Role"
              value={newAgent.role}
              onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
              className="flex-1 bg-gray-700 px-4 py-2 rounded border border-gray-600"
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Emoji avatar (e.g., 🦁)"
              value={newAgent.avatar}
              onChange={(e) => setNewAgent({...newAgent, avatar: e.target.value})}
              className="w-32 bg-gray-700 px-4 py-2 rounded border border-gray-600"
            />
            <button onClick={handleAddAgent} className="bg-green-600 px-6 py-2 rounded hover:bg-green-700">
              Create Agent
            </button>
            <button onClick={() => setShowAddAgent(false)} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="bg-gray-800 rounded-xl p-4">
            {/* Agent Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{agent.avatar}</span>
              <div>
                <h3 className="font-bold text-lg">{agent.name}</h3>
                <p className="text-gray-400 text-sm">{agent.role}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${agent.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700'}`}>
                  {agent.status}
                </span>
              </div>
              {agent.id !== 'milo' && (
                <button onClick={() => handleDeleteAgent(agent.id)} className="ml-auto text-red-400 hover:text-red-300">
                  🗑️
                </button>
              )}
            </div>

            {/* File Editors */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                onClick={() => handleEditFile(agent, 'soul')}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
              >
                SOUL.md
              </button>
              <button 
                onClick={() => handleEditFile(agent, 'identity')}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
              >
                IDENTITY.md
              </button>
              <button 
                onClick={() => handleEditFile(agent, 'user')}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
              >
                USER.md
              </button>
            </div>

            {/* Skills */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Skills ({agent.skills?.length || 0})</span>
                <button 
                  onClick={() => handleEditFile(agent, 'skills')}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Assign Skills →
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {(agent.skills || []).slice(0, 5).map(skillId => {
                  const skill = AVAILABLE_SKILLS.find(s => s.id === skillId)
                  return (
                    <span key={skillId} className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                      {skill?.name || skillId}
                      <button 
                        onClick={() => handleRemoveSkill(agent.id, skillId)}
                        className="ml-1 text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
                {(agent.skills || []).length > 5 && (
                  <span className="text-xs text-gray-500">+{agent.skills.length - 5} more</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {(editMode && selectedAgent) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">Editing {selectedAgent.name}'s {editMode.toUpperCase()}.md</h2>
                <p className="text-gray-400 text-sm">
                  {editMode === 'soul' && 'Core persona and behavior rules'}
                  {editMode === 'identity' && 'Identity details: name, role, avatar'}
                  {editMode === 'user' && 'User preferences and context'}
                  {editMode === 'skills' && 'Assign skills to this agent'}
                </p>
              </div>
              <button onClick={() => setEditMode(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            
            {editMode === 'skills' ? (
              /* Skills Assignment */
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_SKILLS.map(skill => (
                    <div key={skill.id} className={`p-3 rounded-lg border ${selectedAgent.skills?.includes(skill.id) ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-900'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{skill.name}</div>
                          <div className="text-xs text-gray-400">{skill.category}</div>
                        </div>
                        <button 
                          onClick={() => selectedAgent.skills?.includes(skill.id) 
                            ? handleRemoveSkill(selectedAgent.id, skill.id)
                            : handleAssignSkill(selectedAgent.id, skill.id)
                          }
                          className={`text-lg ${selectedAgent.skills?.includes(skill.id) ? 'text-green-400' : 'text-gray-500'}`}
                        >
                          {selectedAgent.skills?.includes(skill.id) ? '✓' : '+'}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{skill.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Text Editor */
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 bg-gray-900 px-4 py-3 rounded border border-gray-700 font-mono text-sm resize-none min-h-[300px]"
                placeholder={`Enter ${editMode} content here...`}
              />
            )}
            
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
              <button onClick={() => setEditMode(null)} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                Cancel
              </button>
              <button onClick={handleSaveFile} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Legend */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6">
        <h3 className="font-bold mb-4">📦 Available Skills in System</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AVAILABLE_SKILLS.map(skill => (
            <div key={skill.id} className="text-sm">
              <div className="font-medium">{skill.name}</div>
              <div className="text-xs text-gray-400">{skill.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}