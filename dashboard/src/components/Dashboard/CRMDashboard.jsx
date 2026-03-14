import React, { useState, useEffect } from 'react'

const PIPELINE_STAGES = [
  { id: 'new', label: 'New Leads', color: 'gray' },
  { id: 'contacted', label: 'Contacted', color: 'blue' },
  { id: 'replied', label: 'Replied', color: 'yellow' },
  { id: 'qualified', label: 'Qualified', color: 'purple' },
  { id: 'proposal', label: 'Proposal', color: 'orange' },
  { id: 'closed', label: 'Closed Won', color: 'green' }
]

const SIZE_LABELS = {
  freelancer: 'Freelancer',
  small: 'Small (1-10)',
  medium: 'Medium (11-50)',
  large: 'Large (50+)'
}

export default function CRMDashboard() {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [view, setView] = useState('pipeline') // 'pipeline' or 'list'

  useEffect(function() {
    fetch('/api/crm/contacts')
      .then(r => r.json())
      .then(data => {
        if (data.contacts) {
          setContacts(data.contacts)
        }
      })
      .catch(() => {
        // Use demo data if API not available
        setContacts(getDemoData())
      })
  }, [])

  function getDemoData() {
    return [
      { id: 'lead_001', name: 'John Rodriguez', email: 'john@rodrigbroofing.com', phone: '+1-305-555-0123', website: 'rodrigbroofing.com', company: 'Rodriguez Roofing LLC', title: 'Owner', location: 'Miami, FL', size: 'small', status: 'new', value: 299, notes: '5 trucks, residential' },
      { id: 'lead_002', name: 'Sarah Mitchell', email: 'sarah@preciseroofingfl.com', phone: '+1-954-555-0456', website: 'preciseroofingfl.com', company: 'Precise Roofing Services', title: 'Operations Manager', location: 'Fort Lauderdale, FL', size: 'medium', status: 'contacted', value: 799, notes: '25 employees, commercial + residential' },
      { id: 'lead_003', name: 'Mike Thompson', email: '', phone: '+1-561-555-0789', website: 'thompsoncontractors.com', company: 'Thompson Contractors Inc', title: 'Freelance Consultant', location: 'West Palm Beach, FL', size: 'freelancer', status: 'qualified', value: 299, notes: 'Works with multiple companies' },
      { id: 'lead_004', name: 'Lisa Chen', email: 'lisa@elite-roofing.com', phone: '', website: 'elite-roofing.com', company: 'Elite Roofing Group', title: 'CEO', location: 'Orlando, FL', size: 'medium', status: 'new', value: 799, notes: 'Large commercial projects' },
      { id: 'lead_005', name: 'David Park', email: 'david@parkbrothers.com', phone: '+1-813-555-0345', website: 'parkbrothers.com', company: 'Park Brothers Roofing', title: 'Owner', location: 'Tampa, FL', size: 'small', status: 'proposal', value: 299, notes: 'Ready to sign' }
    ]
  }

  function getContactsByStage(stageId) {
    return contacts.filter(c => c.status === stageId)
  }

  function getTotalValue() {
    return contacts.reduce((sum, c) => sum + (c.value || 0), 0)
  }

  function getStageTotal(stageId) {
    return getContactsByStage(stageId).reduce((sum, c) => sum + (c.value || 0), 0)
  }

  function updateContactStatus(contactId, newStatus) {
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, status: newStatus } : c
    ))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🏠 Roofing CRM</h1>
          <p className="text-gray-400">LinkedIn leads & sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('pipeline')}
            className={`px-4 py-2 rounded ${view === 'pipeline' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Pipeline
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded ${view === 'list' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            List
          </button>
          <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
            ➕ Add Lead
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold">{contacts.length}</div>
          <div className="text-gray-400 text-sm">Total Leads</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400">${getTotalValue().toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Pipeline Value</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400">{getContactsByStage('new').length}</div>
          <div className="text-gray-400 text-sm">New</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-400">{getContactsByStage('qualified').length + getContactsByStage('proposal').length}</div>
          <div className="text-gray-400 text-sm">Qualified + Proposal</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-400">{getContactsByStage('closed').length}</div>
          <div className="text-gray-400 text-sm">Closed Won</div>
        </div>
      </div>

      {/* View Toggle */}
      {view === 'pipeline' ? (
        /* Pipeline View */
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map(stage => {
              const stageContacts = getContactsByStage(stage.id)
              return (
                <div key={stage.id} className="w-72 flex-shrink-0">
                  <div className={`bg-${stage.color}-900/30 border border-${stage.color}-500/30 rounded-t-xl p-3 flex justify-between items-center`}>
                    <span className="font-medium">{stage.label}</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-sm">{stageContacts.length}</span>
                  </div>
                  <div className="bg-gray-800/50 rounded-b-xl p-2 min-h-96 max-h-[600px] overflow-y-auto">
                    {stageContacts.map(contact => (
                      <div 
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className="bg-gray-700 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-400">{contact.company}</div>
                        <div className="text-xs text-gray-500 mt-1">{contact.location}</div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">{SIZE_LABELS[contact.size]}</span>
                          <span className="text-sm font-bold text-green-400">${contact.value}</span>
                        </div>
                      </div>
                    ))}
                    {stageContacts.length === 0 && (
                      <div className="text-center text-gray-500 py-8 text-sm">No leads</div>
                    )}
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-1">
                    ${getStageTotal(stage.id).toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="border-t border-gray-700 hover:bg-gray-700/50 cursor-pointer" onClick={() => setSelectedContact(contact)}>
                  <td className="p-3">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs text-gray-400">{contact.title}</div>
                  </td>
                  <td className="p-3">
                    <div>{contact.company}</div>
                    <div className="text-xs text-gray-400">{contact.website}</div>
                  </td>
                  <td className="p-3">{contact.location}</td>
                  <td className="p-3">{contact.email || '-'}</td>
                  <td className="p-3">{contact.phone || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs bg-${PIPELINE_STAGES.find(s => s.id === contact.status)?.color || 'gray'}-900 text-${PIPELINE_STAGES.find(s => s.id === contact.status)?.color || 'gray'}-300`}>
                      {PIPELINE_STAGES.find(s => s.id === contact.status)?.label}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-green-400">${contact.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedContact(null)}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
                <p className="text-gray-400">{selectedContact.title} at {selectedContact.company}</p>
              </div>
              <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div>{selectedContact.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Company Size</div>
                <div>{SIZE_LABELS[selectedContact.size]}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div>{selectedContact.email || 'Not found'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div>{selectedContact.phone || 'Not found'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500">Website</div>
                <div><a href={selectedContact.website} target="_blank" rel="noopener" className="text-blue-400 hover:underline">{selectedContact.website}</a></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Notes</div>
              <div className="bg-gray-700 rounded p-2 text-sm">{selectedContact.notes}</div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Change Status</div>
              <div className="flex flex-wrap gap-2">
                {PIPELINE_STAGES.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => updateContactStatus(selectedContact.id, stage.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedContact.status === stage.id 
                        ? `bg-${stage.color}-600` 
                        : `bg-gray-700 hover:bg-${stage.color}-700`
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded">📧 Send Email</button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded">📞 Call</button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded">💬 LinkedIn</button>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Scraper Section */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🔍 LinkedIn Scraper</h3>
        <p className="text-gray-400 mb-4">Search for roofing companies and freelancers on LinkedIn using Apify.</p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Search Query</label>
            <input type="text" placeholder="roofing contractor" className="w-full bg-gray-700 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input type="text" placeholder="Miami, Florida" className="w-full bg-gray-700 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Company Size</label>
            <select className="w-full bg-gray-700 rounded px-3 py-2">
              <option value="">All sizes</option>
              <option value="freelancer">Freelancer</option>
              <option value="small">Small (1-10)</option>
              <option value="medium">Medium (11-50)</option>
            </select>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
          🚀 Scrape LinkedIn
        </button>
      </div>
    </div>
  )
}
