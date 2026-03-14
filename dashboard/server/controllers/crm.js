import fs from 'fs'
import path from 'path'

const CRM_DIR = path.join(process.cwd(), 'data', 'crm')
const CONTACTS_FILE = path.join(CRM_DIR, 'contacts.json')

function ensureDir() {
  if (!fs.existsSync(CRM_DIR)) {
    fs.mkdirSync(CRM_DIR, { recursive: true })
  }
  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify({ contacts: [], pipeline: {}, stats: {} }, null, 2))
  }
}

export function getContacts(req, res) {
  ensureDir()
  try {
    const data = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'))
    res.json(data)
  } catch (e) {
    res.json({ contacts: [], pipeline: {}, stats: {} })
  }
}

export function addContact(req, res) {
  ensureDir()
  try {
    const data = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'))
    const contact = {
      id: 'lead_' + Date.now().toString(36),
      ...req.body,
      createdAt: new Date().toISOString(),
      activities: [{ type: 'created', date: new Date().toISOString(), note: 'Lead imported' }]
    }
    data.contacts.push(contact)
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(data, null, 2))
    res.json(contact)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export function updateContact(req, res) {
  ensureDir()
  try {
    const data = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'))
    const idx = data.contacts.findIndex(c => c.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    data.contacts[idx] = { ...data.contacts[idx], ...req.body, updatedAt: new Date().toISOString() }
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(data, null, 2))
    res.json(data.contacts[idx])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export function addActivity(req, res) {
  ensureDir()
  try {
    const data = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'))
    const idx = data.contacts.findIndex(c => c.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    const activity = {
      type: req.body.type,
      date: new Date().toISOString(),
      note: req.body.note
    }
    data.contacts[idx].activities = data.contacts[idx].activities || []
    data.contacts[idx].activities.push(activity)
    data.contacts[idx].lastContact = activity.date
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(data, null, 2))
    res.json(activity)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
