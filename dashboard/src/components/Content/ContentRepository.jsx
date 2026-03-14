import React, { useState, useEffect } from 'react'
import { FolderOpen, FileText, ChevronRight, ChevronDown, ExternalLink, File, Eye } from 'lucide-react'

const projects = [
  {
    id: 'sidequest',
    name: 'Side Quest Studios',
    icon: '🚀',
    folders: [
      { id: 'content-strategy', name: 'Content Strategy', path: 'marketing-ops/sidequest' },
      { id: 'orchestrator', name: 'Orchestrator', path: 'social-automation' },
    ]
  },
  {
    id: 'addonquote',
    name: 'AddOnQuote',
    icon: '🏠',
    folders: [
      { id: 'content-pool', name: 'Content Pool', path: 'marketing-ops/addonquote' },
    ]
  },
  {
    id: 'sheetitnow',
    name: 'Sheet It Now',
    icon: '📊',
    folders: [
      { id: 'content-pool', name: 'Content Pool', path: 'marketing-ops/sheetitnow' },
    ]
  },
  {
    id: 'nocodelab',
    name: 'NoCodeLab',
    icon: '⚡',
    folders: [
      { id: 'products', name: 'Products (MD)', path: 'business/products' },
      { id: 'products-html', name: 'Products (HTML)', path: 'business/mission-control/products' },
      { id: 'email-sequence', name: 'Email Sequence', path: 'business/email-sequence' },
      { id: 'mission-control', name: 'Mission Control', path: 'business/mission-control' },
      { id: 'landing', name: 'Landing Page', path: 'business/landing' },
    ]
  }
]

export default function ContentRepository() {
  const [expandedProjects, setExpandedProjects] = useState(['nocodelab'])
  const [expandedFolders, setExpandedFolders] = useState({})
  const [files, setFiles] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState('')

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const toggleFolder = async (folderPath) => {
    if (expandedFolders[folderPath]) {
      setExpandedFolders(prev => ({ ...prev, [folderPath]: false }))
      return
    }
    
    setExpandedFolders(prev => ({ ...prev, [folderPath]: true }))
    
    if (!files[folderPath]) {
      // Fetch file list from backend
      try {
        const response = await fetch(`/api/files/list?path=${encodeURIComponent(folderPath)}`)
        const data = await response.json()
        setFiles(prev => ({ ...prev, [folderPath]: data || [] }))
      } catch (e) {
        console.error('Error loading files:', e)
        setFiles(prev => ({ ...prev, [folderPath]: [] }))
      }
    }
  }

  const openFile = async (filePath) => {
    try {
      const response = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`)
      const data = await response.json()
      setFileContent(data.content || '')
      setSelectedFile(filePath)
    } catch (e) {
      console.error('Error reading file:', e)
      setFileContent('Error loading file')
      setSelectedFile(filePath)
    }
  }

  const getFileName = (path) => path.split('/').pop()

  return (
    <div className="flex h-full">
      {/* Folder Tree */}
      <div className="w-80 border-r border-border p-4 overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">📁 Content Repository</h1>
        
        <div className="space-y-2">
          {projects.map(project => (
            <div key={project.id} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleProject(project.id)}
                className="w-full flex items-center gap-3 p-3 bg-card hover:bg-accent transition-colors text-left"
              >
                <span className="text-xl">{project.icon}</span>
                <span className="font-medium flex-1">{project.name}</span>
                {expandedProjects.includes(project.id) 
                  ? <ChevronDown size={16} /> 
                  : <ChevronRight size={16} />
                }
              </button>
              
              {expandedProjects.includes(project.id) && (
                <div className="bg-card/50 border-t border-border">
                  {project.folders.map(folder => (
                    <div key={folder.id}>
                      <button
                        onClick={() => toggleFolder(folder.path)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-sm text-muted-foreground text-left"
                      >
                        {expandedFolders[folder.path] 
                          ? <ChevronDown size={14} /> 
                          : <ChevronRight size={14} />
                        }
                        <FolderOpen size={14} />
                        <span>{folder.name}</span>
                      </button>
                      
                      {expandedFolders[folder.path] && files[folder.path] && (
                        <div className="pl-8 bg-card/30">
                          {files[folder.path].length === 0 ? (
                            <p className="px-4 py-2 text-xs text-muted-foreground">No files</p>
                          ) : (
                            files[folder.path].map((file, i) => (
                              <button
                                key={i}
                                onClick={() => openFile(file.path)}
                                className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-accent transition-colors text-sm text-left"
                              >
                                <FileText size={12} />
                                <span className="truncate">{file.name}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Preview */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedFile ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} />
              <h2 className="font-bold">{getFileName(selectedFile)}</h2>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); openFile(selectedFile) }}
                className="ml-auto text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                <Eye size={14} /> Refresh
              </a>
            </div>
            <pre className="bg-card p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
              {fileContent || 'Loading...'}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a file to preview
          </div>
        )}
      </div>
    </div>
  )
}
