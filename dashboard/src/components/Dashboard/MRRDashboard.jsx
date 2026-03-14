import React, { useState, useEffect } from 'react'

const SAAS_DATA = [
  { id: 'addonquote', name: 'AddOnQuote', icon: '🏠', tagline: 'Roofing SaaS', mrr: 0, targetMrr: 1000, subscribers: 0, targetSubscribers: 35, ltv: 29, xAccount: '@addonquote', postsPerDay: 20, status: 'growing' },
  { id: 'sidequest', name: 'Side Quest Studios', icon: '⚡', tagline: 'Build in Public', mrr: 0, targetMrr: 500, subscribers: 0, targetSubscribers: 20, ltv: 25, xAccount: '@SideQuestStd', postsPerDay: 20, status: 'building' },
  { id: 'sheetitnow', name: 'Sheet It Now', icon: '📊', tagline: 'PDF to Excel', mrr: 0, targetMrr: 500, subscribers: 0, targetSubscribers: 100, ltv: 5, xAccount: '@sheetitnow', postsPerDay: 20, status: 'growing' }
]

const POSTING_STATS = {
  addonquote: { daily: 20, weekly: 140, monthly: 600, total: 1250 },
  sidequest: { daily: 20, weekly: 140, monthly: 600, total: 1180 },
  sheetitnow: { daily: 20, weekly: 140, monthly: 600, total: 980 }
}

const SUBAGENTS = [
  { id: 'publishing', name: 'Publishing Agent', status: 'running', pid: '5295', purpose: '60 posts/day', icon: '🐦' },
  { id: 'grok', name: 'Grok Researcher', status: 'installed', purpose: 'Topic research', icon: '🔍' },
  { id: 'meta', name: 'Meta Ads Marketing', status: 'installed', purpose: 'Campaign creation', icon: '📢' },
  { id: 'orchestrator', name: 'Orchestrator', status: 'backup', purpose: 'Organic patterns', icon: '🎯' }
]

const DAILY_GOALS = [
  { id: 'posts', label: 'X Posts Today', target: 60, current: 0, icon: '🐦' },
  { id: 'research', label: 'Trend Research', target: 3, current: 0, icon: '🔍' },
  { id: 'leads', label: 'Leads Contacted', target: 10, current: 0, icon: '🎯' },
  { id: 'blogs', label: 'Blog Drafts', target: 1, current: 0, icon: '✍️' }
]

export default function MRRDashboard() {
  const [saasList] = useState(SAAS_DATA)
  const [totalMRR] = useState(0)
  const [totalSubs] = useState(0)
  const [dailyGoals] = useState(DAILY_GOALS)
  const overallTargetMRR = 2000

  const mrrPercent = Math.round((totalMRR / overallTargetMRR) * 100)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎯 Side Quest Studios Mission Control</h1>
        <p className="text-gray-400">MRR Growth & SaaS Portfolio Tracker</p>
      </div>

      {/* MRR Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">${totalMRR.toLocaleString()} / ${overallTargetMRR.toLocaleString()} MRR</h2>
            <p className="text-gray-300">${(overallTargetMRR - totalMRR).toLocaleString()} more to goal</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{mrrPercent}%</div>
            <div className="text-gray-400">of ${overallTargetMRR.toLocaleString()} goal</div>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full" style={{ width: Math.min(mrrPercent, 100) + '%' }}></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold">{saasList.length}</div>
          <div className="text-gray-400 text-sm">SaaS Products</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-400">${totalMRR}</div>
          <div className="text-gray-400 text-sm">Current MRR</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold">{totalSubs}</div>
          <div className="text-gray-400 text-sm">Subscribers</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold">60</div>
          <div className="text-gray-400 text-sm">Posts/Day</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold">{SUBAGENTS.filter(s => s.status === 'running').length}</div>
          <div className="text-gray-400 text-sm">Active Agents</div>
        </div>
      </div>

      {/* Daily Goals */}
      <h3 className="text-xl font-bold mb-4">📅 Today's Goals</h3>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {dailyGoals.map(goal => {
          const percent = Math.min((goal.current / goal.target) * 100, 100)
          return (
            <div key={goal.id} className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{goal.icon}</span>
                <span className="text-gray-400 text-sm">{goal.current}/{goal.target}</span>
              </div>
              <div className="text-sm font-medium mb-2">{goal.label}</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${percent >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: percent + '%' }}></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* SaaS Portfolio */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">📦 SaaS Portfolio</h3>
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">➕ Add SaaS</button>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {saasList.map(saas => (
          <div key={saas.id} className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{saas.icon}</span>
                  <div>
                    <h4 className="font-bold">{saas.name}</h4>
                    <p className="text-xs text-gray-400">{saas.tagline}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${saas.status === 'growing' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{saas.status}</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">MRR</span>
                  <span className="font-medium">${saas.mrr}/${saas.targetMrr}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: (saas.mrr / saas.targetMrr) * 100 + '%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Subscribers</span>
                  <span className="font-medium">{saas.subscribers}/{saas.targetSubscribers}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: (saas.subscribers / saas.targetSubscribers) * 100 + '%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-1">X: {saas.xAccount} • {saas.postsPerDay} posts/day</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Posting & Sub-Agents */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">🐦 X/Twitter Posting</h3>
          <div className="space-y-3">
            {Object.entries(POSTING_STATS).map(([id, stats]) => {
              const saas = saasList.find(s => s.id === id)
              return (
                <div key={id} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{saas?.icon}</span>
                    <span className="font-medium">{saas?.name}</span>
                    <span className="text-gray-400 text-sm">{saas?.xAccount}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div><div className="text-lg font-bold text-blue-400">{stats.daily}</div><div className="text-xs text-gray-500">/day</div></div>
                    <div><div className="text-lg font-bold">{stats.weekly}</div><div className="text-xs text-gray-500">/week</div></div>
                    <div><div className="text-lg font-bold">{stats.monthly}</div><div className="text-xs text-gray-500">/month</div></div>
                    <div><div className="text-lg font-bold text-green-400">{stats.total.toLocaleString()}</div><div className="text-xs text-gray-500">total</div></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">🤖 Active Sub-Agents</h3>
          <div className="space-y-3">
            {SUBAGENTS.map(agent => (
              <div key={agent.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{agent.icon}</span>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.purpose}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${agent.status === 'running' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                    {agent.status === 'running' ? `PID ${agent.pid}` : agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">💰 Revenue Breakdown</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-sm">
              <th className="pb-3">Product</th>
              <th className="pb-3">MRR</th>
              <th className="pb-3">Subscribers</th>
              <th className="pb-3">LTV</th>
              <th className="pb-3">Target</th>
              <th className="pb-3 text-right">Progress</th>
            </tr>
          </thead>
          <tbody>
            {saasList.map(saas => (
              <tr key={saas.id} className="border-t border-gray-700">
                <td className="py-3 flex items-center gap-2">
                  <span>{saas.icon}</span>
                  <span>{saas.name}</span>
                </td>
                <td className="py-3">${saas.mrr}</td>
                <td className="py-3">{saas.subscribers}</td>
                <td className="py-3">${saas.ltv}</td>
                <td className="py-3">${saas.targetMrr}</td>
                <td className="py-3 text-right">
                  <span className="text-gray-400">{Math.round((saas.mrr / saas.targetMrr) * 100)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-700 font-bold">
              <td className="pt-3">Total</td>
              <td className="pt-3">${totalMRR}</td>
              <td className="pt-3">{totalSubs}</td>
              <td className="pt-3">-</td>
              <td className="pt-3">${overallTargetMRR}</td>
              <td className="pt-3 text-right">{mrrPercent}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
