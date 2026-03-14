import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://tvrhuxkgaktstiawhsji.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cmh1eGtnYWt0c3RpYXdoc2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTU4MDAsImV4cCI6MjA4NjE3MTgwMH0.Ju3KsHJmlOmdlnCwlaCTCxyRt1kqMzV1gc4dA5ppyJA'

const supabase = createClient(supabaseUrl, supabaseKey)

const ACCOUNT_CONFIG = {
  addonquote: { name: 'AddOnQuote', icon: '🏠', color: 'blue' },
  sidequest: { name: 'Side Quest', icon: '⚡', color: 'orange' },
  sheetitnow: { name: 'Sheet It Now', icon: '📊', color: 'green' }
}

const STATUS_CONFIG = {
  queue: { label: 'Publishing Queue', color: 'blue', icon: '📤' },
  revision: { label: 'Revision', color: 'yellow', icon: '✏️' },
  posted: { label: 'Posted (24h)', color: 'purple', icon: '🕐' },
  archive: { label: 'Archive', color: 'gray', icon: '📦' },
  monitoring: { label: 'Active Monitoring', color: 'green', icon: '📈' }
}

const COLUMNS = ['queue', 'revision', 'posted', 'archive', 'monitoring']

export default function ContentKanban() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newTweet, setNewTweet] = useState({ content: '', account_id: 'addonquote' })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTweets()
  }, [selectedAccount])

  async function fetchTweets() {
    setLoading(true)
    try {
      let query = supabase.from('content_queue').select('*').order('created_at', { ascending: false })
      
      if (selectedAccount !== 'all') {
        query = query.eq('account_id', selectedAccount)
      }
      
      const { data, error } = await query
      if (error) throw error
      setTweets(data || [])
    } catch (err) {
      console.error('Error fetching tweets:', err)
    }
    setLoading(false)
  }

  async function createTweet(e) {
    e.preventDefault()
    if (!newTweet.content.trim()) return

    try {
      const { error } = await supabase.from('content_queue').insert({
        content: newTweet.content,
        account_id: newTweet.account_id,
        status: 'queue',
        needs_revision: false
      })
      
      if (error) throw error
      setNewTweet({ content: '', account_id: 'addonquote' })
      fetchTweets()
    } catch (err) {
      console.error('Error creating tweet:', err)
    }
  }

  async function toggleRevision(tweet) {
    try {
      const { error } = await supabase.from('content_queue').update({
        needs_revision: !tweet.needs_revision,
        status: !tweet.needs_revision ? 'revision' : 'queue',
        revision_notes: !tweet.needs_revision ? 'Marked for revision' : null
      }).eq('id', tweet.id)
      
      if (error) throw error
      fetchTweets()
    } catch (err) {
      console.error('Error updating tweet:', err)
    }
  }

  async function moveTweet(tweetId, newStatus) {
    try {
      const { error } = await supabase.from('content_queue').update({
        status: newStatus,
        posted_at: newStatus === 'posted' ? new Date().toISOString() : tweet.posted_at,
        monitoring_started_at: newStatus === 'posted' ? new Date().toISOString() : null,
        monitoring_status: newStatus === 'posted' ? 'pending' : tweet.monitoring_status
      }).eq('id', tweetId)
      
      if (error) throw error
      fetchTweets()
    } catch (err) {
      console.error('Error moving tweet:', err)
    }
  }

  async function deleteTweet(tweetId) {
    if (!confirm('Delete this tweet?')) return
    try {
      const { error } = await supabase.from('content_queue').delete().eq('id', tweetId)
      if (error) throw error
      fetchTweets()
    } catch (err) {
      console.error('Error deleting tweet:', err)
    }
  }

  // Filter and group tweets by status
  const columns = useMemo(() => {
    // First apply filters
    let filtered = tweets
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        (t.content || '').toLowerCase().includes(query) ||
        (t.account_id || '').toLowerCase().includes(query)
      )
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }
    
    // Group by status
    const grouped = {}
    COLUMNS.forEach(col => { grouped[col] = [] })
    
    filtered.forEach(tweet => {
      const col = tweet.status || 'queue'
      if (grouped[col]) {
        grouped[col].push(tweet)
      } else {
        grouped['queue'].push(tweet)
      }
    })
    
    return grouped
  }, [tweets, selectedAccount, statusFilter, searchQuery])

  const stats = useMemo(() => {
    // Get counts from all tweets (not filtered)
    const total = tweets.length
    const needsRevision = tweets.filter(t => t.needs_revision).length
    const inQueue = tweets.filter(t => t.status === 'queue').length
    const posted = tweets.filter(t => t.status === 'posted' || t.status === 'monitoring').length
    const archived = tweets.filter(t => t.status === 'archive').length
    const avgEngagement = tweets.length > 0 
      ? (tweets.reduce((sum, t) => sum + (t.engagement_rate || 0), 0) / tweets.length).toFixed(2)
      : 0
    return { total, needsRevision, inQueue, posted, archived, avgEngagement }
  }, [tweets])

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📋 Content Kanban</h1>
            <p className="text-gray-400">Plan, track, and analyze tweet performance</p>
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="bg-gray-800 px-4 py-2 rounded border border-gray-700"
            >
              <option value="all">All Accounts</option>
              {Object.entries(ACCOUNT_CONFIG).map(([id, config]) => (
                <option key={id} value={id}>{config.icon} {config.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filter Bar */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Search */}
          <input
            type="text"
            placeholder="Search tweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded border border-gray-700 flex-1 min-w-64"
          />
          
          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded border border-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="queue">📤 Queue ({columns.queue?.length || 0})</option>
            <option value="revision">✏️ Revision ({columns.revision?.length || 0})</option>
            <option value="posted">🕐 Posted ({columns.posted?.length || 0})</option>
            <option value="monitoring">📈 Monitoring ({columns.monitoring?.length || 0})</option>
            <option value="archive">📦 Archive ({columns.archive?.length || 0})</option>
          </select>
          
          {/* Clear Filters */}
          {(selectedAccount !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button 
              onClick={() => {
                setSelectedAccount('all')
                setStatusFilter('all')
                setSearchQuery('')
              }}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.inQueue}</div>
          <div className="text-gray-400 text-sm">📤 Queue</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total Tweets</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-400">{stats.needsRevision}</div>
          <div className="text-gray-400 text-sm">✏️ Revision</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-400">{stats.posted}</div>
          <div className="text-gray-400 text-sm">🕐 Posted</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400">{stats.avgEngagement}%</div>
          <div className="text-gray-400 text-sm">Avg Engagement</div>
        </div>
      </div>

      {/* New Tweet Form */}
      <form onSubmit={createTweet} className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex gap-4">
          <select 
            value={newTweet.account_id}
            onChange={(e) => setNewTweet({...newTweet, account_id: e.target.value})}
            className="bg-gray-700 px-3 py-2 rounded"
          >
            {Object.entries(ACCOUNT_CONFIG).map(([id, config]) => (
              <option key={id} value={id}>{config.icon} {config.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={newTweet.content}
            onChange={(e) => setNewTweet({...newTweet, content: e.target.value})}
            placeholder="Draft a new tweet..."
            className="flex-1 bg-gray-700 px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
          />
          <button type="submit" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">
            ➕ Add
          </button>
        </div>
      </form>

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(status => (
            <div key={status} className="flex-shrink-0 w-72">
              <div className={`bg-gray-800 rounded-xl p-3 mb-3 border-t-4 ${
                status === 'queue' ? 'border-blue-500' :
                status === 'revision' ? 'border-yellow-500' :
                status === 'posted' ? 'border-purple-500' :
                status === 'archive' ? 'border-gray-500' :
                'border-green-500'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold flex items-center gap-2">
                    {STATUS_CONFIG[status]?.icon} {STATUS_CONFIG[status]?.label}
                  </span>
                  <span className="bg-gray-700 px-2 py-0.5 rounded text-sm">
                    {columns[status]?.length || 0}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 min-h-64">
                {columns[status]?.map(tweet => (
                  <TweetCard 
                    key={tweet.id} 
                    tweet={tweet} 
                    onMove={moveTweet}
                    onToggleRevision={toggleRevision}
                    onDelete={deleteTweet}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TweetCard({ tweet, onMove, onToggleRevision, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  
  const config = ACCOUNT_CONFIG[tweet.account_id] || { icon: '📝', name: tweet.account_id }
  const statusConfig = STATUS_CONFIG[tweet.status] || STATUS_CONFIG.queue
  
  return (
    <div className={`bg-gray-800 rounded-xl p-3 ${tweet.needs_revision ? 'border-l-4 border-yellow-500' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span>{config.icon}</span>
          <span className="text-sm font-medium">{config.name}</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onToggleRevision(tweet)}
            className={`p-1 rounded ${tweet.needs_revision ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            title="Mark for revision"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(tweet.id)}
            className="p-1 rounded bg-gray-700 hover:bg-red-900"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">{tweet.content}</p>
      
      {/* Metrics */}
      {tweet.status === 'posted' || tweet.status === 'monitoring' ? (
        <div className="bg-gray-900 rounded p-2 mb-2 text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <span>📊 Performance</span>
            <span className={tweet.performance_tier === 'viral' ? 'text-green-400' : tweet.performance_tier === 'high' ? 'text-blue-400' : 'text-gray-500'}>
              {tweet.performance_tier || 'calculating...'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div>
              <div className="text-gray-400">Engage</div>
              <div className="font-bold">{tweet.engagements || 0}</div>
            </div>
            <div>
              <div className="text-gray-400">Rate</div>
              <div className="font-bold">{tweet.engagement_rate || 0}%</div>
            </div>
            <div>
              <div className="text-gray-400">Clicks</div>
              <div className="font-bold">{tweet.clicks || 0}</div>
            </div>
          </div>
          {tweet.monitoring_status && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <span className={`text-xs px-2 py-0.5 rounded ${
                tweet.monitoring_status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                tweet.monitoring_status === 'week1' ? 'bg-purple-900 text-purple-300' :
                tweet.monitoring_status === 'extended' ? 'bg-green-900 text-green-300' :
                'bg-gray-700'
              }`}>
                📈 {tweet.monitoring_status}
              </span>
            </div>
          )}
        </div>
      ) : null}
      
      {/* Move Actions */}
      <div className="flex gap-1 mt-2">
        {tweet.status !== 'posted' && (
          <button 
            onClick={() => onMove(tweet.id, 'posted')}
            className="flex-1 bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
          >
            🕐 Post
          </button>
        )}
        {tweet.status === 'posted' && (
          <button 
            onClick={() => onMove(tweet.id, 'monitoring')}
            className="flex-1 bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
          >
            📈 Extend
          </button>
        )}
        {tweet.status === 'monitoring' && (
          <button 
            onClick={() => onMove(tweet.id, 'archive')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
          >
            📦 Archive
          </button>
        )}
      </div>
      
      {/* Timestamp */}
      <div className="text-xs text-gray-500 mt-2">
        {tweet.posted_at 
          ? `Posted: ${new Date(tweet.posted_at).toLocaleDateString()}`
          : `Created: ${new Date(tweet.created_at).toLocaleDateString()}`
        }
      </div>
    </div>
  )
}
