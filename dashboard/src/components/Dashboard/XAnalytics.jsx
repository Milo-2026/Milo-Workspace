import React, { useState, useEffect, useMemo } from 'react'

const ACCOUNT_CONFIG = {
  addonquote: { name: 'AddOnQuote', icon: '🏠', handle: '@addonquote', color: 'blue' },
  sidequest: { name: 'Side Quest', icon: '⚡', handle: '@SideQuestStd', color: 'orange' },
  sheetitnow: { name: 'Sheet It Now', icon: '📊', handle: '@sheetitnow', color: 'green' }
}

export default function XAnalytics() {
  const [accounts, setAccounts] = useState([])
  const [followersHistory, setFollowersHistory] = useState([])
  const [posts, setPosts] = useState([])
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState('all')

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      const baseUrl = 'https://tvrhuxkgaktstiawhsji.supabase.co'
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cmh1eGtnYWt0c3RpYXdoc2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTU4MDAsImV4cCI6MjA4NjE3MTgwMH0.Ju3KsHJmlOmdlnCwlaCTCxyRt1kqMzV1gc4dA5ppyJA'
      const headers = { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }

      const [accRes, followRes, postsRes, expRes] = await Promise.all([
        fetch(`${baseUrl}/rest/v1/x_accounts?select=*`, { headers }),
        fetch(`${baseUrl}/rest/v1/x_followers_daily?select=*&order=date.asc`, { headers }),
        fetch(`${baseUrl}/rest/v1/x_posts?select=*&order=posted_at.desc`, { headers }),
        fetch(`${baseUrl}/rest/v1/x_experiments?select=*`, { headers })
      ])

      const accountsData = await accRes.json()
      const followData = await followRes.json()
      const postsData = await postsRes.json()
      const expData = await expRes.json()

      const accList = (accountsData || []).map(acc => ({
        id: acc.account_id,
        ...ACCOUNT_CONFIG[acc.account_id] || { name: acc.account_id },
        followers: acc.followers || 0,
        following: acc.following || 0,
        posts: acc.posts_count || 0
      }))
      setAccounts(accList)

      const historyMap = {}
      for (const f of (followData || [])) {
        const d = f.date
        if (!historyMap[d]) historyMap[d] = {}
        historyMap[d][f.account_id] = f.follower_count
      }
      setFollowersHistory(Object.entries(historyMap).map(([date, data]) => ({ date, ...data })))

      setPosts((postsData || []).map(p => ({
        id: p.post_id,
        post_id: p.post_id,
        account: p.account_id,
        content: p.content,
        impressions: p.impressions,
        engagements: p.engagements,
        likes: p.likes,
        retweets: p.retweets,
        replies: p.replies,
        clicks: p.clicks,
        newFollowers: p.new_followers_from_post,
        performance: p.performance_tier,
        timestamp: p.posted_at
      })))

      setExperiments((expData || []).map(e => ({
        id: e.experiment_id,
        name: e.name,
        account: e.account_id,
        status: e.status,
        variantA: e.variant_a_text,
        variantB: e.variant_b_text,
        winner: e.winner,
        insight: e.insight
      })))
    } catch (err) {
      console.error('Error:', err)
    }
    setLoading(false)
  }

  const filteredPosts = selectedAccount === 'all' ? posts : posts.filter(p => p.account === selectedAccount)
  const filteredExperiments = selectedAccount === 'all' ? experiments : experiments.filter(e => e.account === selectedAccount)

  const stats = useMemo(() => {
    if (selectedAccount === 'all') {
      return {
        followers: accounts.reduce((sum, acc) => sum + (acc.followers || 0), 0),
        posts: accounts.reduce((sum, acc) => sum + (acc.posts || 0), 0)
      }
    }
    const acc = accounts.find(a => a.id === selectedAccount)
    return { followers: acc?.followers || 0, posts: acc?.posts || 0 }
  }, [accounts, selectedAccount])

  const latestFollowers = useMemo(() => {
    if (followersHistory.length === 0) return 0
    const latest = followersHistory[followersHistory.length - 1]
    if (selectedAccount === 'all') {
      return (latest.addonquote || 0) + (latest.sidequest || 0) + (latest.sheetitnow || 0)
    }
    return latest[selectedAccount] || 0
  }, [followersHistory, selectedAccount])

  const growth = useMemo(() => {
    if (followersHistory.length < 2) return 0
    const latest = followersHistory[followersHistory.length - 1]
    const earliest = followersHistory[0]
    if (selectedAccount === 'all') {
      const latestTotal = (latest.addonquote || 0) + (latest.sidequest || 0) + (latest.sheetitnow || 0)
      const earliestTotal = (earliest.addonquote || 0) + (earliest.sidequest || 0) + (earliest.sheetitnow || 0)
      return latestTotal - earliestTotal
    }
    return (latest[selectedAccount] || 0) - (earliest[selectedAccount] || 0)
  }, [followersHistory, selectedAccount])

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">X/Twitter Analytics</h1>
          <p className="text-gray-400">Powered by Supabase</p>
        </div>
        <button onClick={fetchAllData} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Refresh</button>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setSelectedAccount('all')} className={`px-4 py-2 rounded ${selectedAccount === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}>All Accounts</button>
        {accounts.map(acc => (
          <button key={acc.id} onClick={() => setSelectedAccount(acc.id)} className={`px-4 py-2 rounded ${selectedAccount === acc.id ? 'bg-blue-600' : 'bg-gray-700'}`}>
            {acc.icon} {acc.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold">{stats.followers.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Followers</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400">+{growth}</div>
          <div className="text-gray-400 text-sm">Growth</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400">{filteredPosts.length}</div>
          <div className="text-gray-400 text-sm">Posts Tracked</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-400">{filteredExperiments.filter(e => e.status === 'active').length}</div>
          <div className="text-gray-400 text-sm">Active A/B Tests</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Follower Growth</h2>
        {followersHistory.length > 0 ? (
          <div className="h-48 flex items-end gap-1">
            {followersHistory.slice(-14).map((point, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 justify-center h-40 items-end">
                  {selectedAccount === 'all' ? (
                    <>
                      <div className="w-3 rounded-t bg-blue-500" style={{ height: `${Math.min((point.addonquote || 0) / 5, 100)}%` }} />
                      <div className="w-3 rounded-t bg-orange-500" style={{ height: `${Math.min((point.sidequest || 0) / 5, 100)}%` }} />
                      <div className="w-3 rounded-t bg-green-500" style={{ height: `${Math.min((point.sheetitnow || 0) / 5, 100)}%` }} />
                    </>
                  ) : (
                    <div className="w-8 rounded-t bg-blue-500" style={{ height: `${Math.min((point[selectedAccount] || 0) / 5, 100)}%` }} />
                  )}
                </div>
                <span className="text-xs text-gray-500">{point.date?.slice(5)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-8 text-center">No data</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="space-y-3">
            {filteredPosts.length > 0 ? filteredPosts.slice(0, 10).map(post => (
              <div key={post.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span>{ACCOUNT_CONFIG[post.account]?.icon || '📝'}</span>
                    <span className="font-medium">{ACCOUNT_CONFIG[post.account]?.name || post.account}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${post.performance === 'viral' ? 'bg-green-900 text-green-300' : post.performance === 'high' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700'}`}>{post.performance}</span>
                  </div>
                  <span className="text-xs text-gray-500">{post.timestamp?.split('T')[0]}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{post.content}</p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>❤️ {post.engagements}</span>
                  <span>🔁 {post.retweets}</span>
                  <span>💬 {post.replies}</span>
                  <span>🖱️ {post.clicks}</span>
                </div>
              </div>
            )) : <p className="text-gray-500">No posts</p>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">A/B Experiments</h2>
          <div className="space-y-4">
            {filteredExperiments.length > 0 ? filteredExperiments.map(exp => (
              <div key={exp.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium">{exp.name}</div>
                    <div className="text-xs text-gray-400">{ACCOUNT_CONFIG[exp.account]?.name || exp.account}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${exp.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700'}`}>{exp.status}</span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className={`p-2 rounded ${exp.winner === 'A' ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-700'}`}>
                    <div className="flex justify-between text-sm">
                      <span>A: {exp.variantA}</span>
                      {exp.winner === 'A' && <span className="text-green-400">✓ WINNER</span>}
                    </div>
                  </div>
                  <div className={`p-2 rounded ${exp.winner === 'B' ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-700'}`}>
                    <div className="flex justify-between text-sm">
                      <span>B: {exp.variantB}</span>
                      {exp.winner === 'B' && <span className="text-green-400">✓ WINNER</span>}
                    </div>
                  </div>
                </div>
                {exp.insight && <div className="text-xs text-blue-400">💡 {exp.insight}</div>}
              </div>
            )) : <p className="text-gray-500">No experiments</p>}
            <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 text-center">New Experiment</button>
          </div>
        </div>
      </div>
    </div>
  )
}
