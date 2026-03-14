import fs from 'fs'
import path from 'path'

const ANALYTICS_DIR = path.join(process.cwd(), 'data', 'x-analytics')

function getFile(filename) {
  const filePath = path.join(ANALYTICS_DIR, filename)
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }
  return null
}

export function getFollowers(req, res) {
  res.json(getFile('followers.json') || { accounts: {}, followerHistory: [] })
}

export function getPosts(req, res) {
  res.json(getFile('posts.json') || { posts: [], bestPerforming: [], worstPerforming: [] })
}

export function getExperiments(req, res) {
  res.json(getFile('experiments.json') || { experiments: [], rules: [] })
}

export function addExperiment(req, res) {
  const data = getFile('experiments.json') || { experiments: [], rules: [] }
  const experiment = {
    id: 'exp_' + Date.now().toString(36),
    ...req.body,
    createdAt: new Date().toISOString()
  }
  data.experiments.push(experiment)
  fs.writeFileSync(path.join(ANALYTICS_DIR, 'experiments.json'), JSON.stringify(data, null, 2))
  res.json(experiment)
}

export function updateExperiment(req, res) {
  const data = getFile('experiments.json') || { experiments: [], rules: [] }
  const idx = data.experiments.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  data.experiments[idx] = { ...data.experiments[idx], ...req.body }
  fs.writeFileSync(path.join(ANALYTICS_DIR, 'experiments.json'), JSON.stringify(data, null, 2))
  res.json(data.experiments[idx])
}

export function logFollowerCheckpoint(req, res) {
  const data = getFile('followers.json') || { accounts: {}, followerHistory: [], followerSpikes: [] }
  const checkpoint = {
    date: new Date().toISOString().split('T')[0],
    ...req.body
  }
  data.followerHistory.push(checkpoint)
  fs.writeFileSync(path.join(ANALYTICS_DIR, 'followers.json'), JSON.stringify(data, null, 2))
  res.json(checkpoint)
}
