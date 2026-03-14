import urllib.request
import json

const env_file = process.env.HOME + '/.openclaw/workspace/.env';

function loadSupabaseConfig() {
  const fs = require('fs');
  try {
    const content = fs.readFileSync(env_file, 'utf8');
    let url, anonKey;
    for (const line of content.split('\n')) {
      if (line.startsWith('SUPABASE_URL=')) url = line.split('=')[1];
      if (line.startsWith('SUPABASE_ANON_KEY=')) anonKey = line.split('=')[1];
    }
    return { url: url?.trim(), anonKey: anonKey?.trim() };
  } catch (e) {
    return { url: null, anonKey: null };
  }
}

const config = loadSupabaseConfig();
const headers = {
  'apikey': config.anonKey,
  'Authorization': `Bearer ${config.anonKey}`,
  'Content-Type': 'application/json'
};

function querySupabase(table, select = '*', filters = []) {
  return new Promise((resolve, reject) => {
    if (!config.url || !config.anonKey) {
      resolve({ accounts: {}, followerHistory: [], posts: [], experiments: [] });
      return;
    }
    
    let url = `${config.url}/rest/v1/${table}?select=${select}`;
    if (filters.length > 0) {
      url += '&' + filters.join('&');
    }
    
    const req = require('urllibrequest').request(url, {
      headers: headers,
      timeout: 15000
    }, (err, data, response) => {
      if (err) {
        resolve({ accounts: {}, followerHistory: [], posts: [], experiments: [] });
        return;
      }
      try {
        const parsed = JSON.parse(data.toString());
        resolve(parsed);
      } catch (e) {
        resolve([]);
      }
    });
  });
}

export async function getXFollowers(req, res) {
  const accounts = await querySupabase('x_accounts');
  
  // Format accounts as dict
  const accountsDict = {};
  for (const acc of (accounts || [])) {
    accountsDict[acc.account_id] = {
      followers: acc.followers || 0,
      following: acc.following || 0,
      posts: acc.posts_count || 0
    };
  }
  
  // Get follower history
  const history = await querySupabase('x_followers_daily', 'account_id,date,follower_count');
  
  // Format history by date
  const historyByDate = {};
  for (const h of (history || [])) {
    const d = h.date;
    if (!historyByDate[d]) historyByDate[d] = {};
    historyByDate[d][h.account_id] = h.follower_count;
  }
  
  const historyArray = Object.entries(historyByDate)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  res.json({ accounts: accountsDict, followerHistory: historyArray });
}

export async function getXPosts(req, res) {
  const posts = await querySupabase('x_posts');
  res.json({ posts: posts || [] });
}

export async function getXExperiments(req, res) {
  const experiments = await querySupabase('x_experiments');
  res.json({ experiments: experiments || [] });
}

export async function getCRMContacts(req, res) {
  const contacts = await querySupabase('crm_contacts');
  const activities = await querySupabase('crm_activities');
  res.json({ contacts: contacts || [], activities: activities || [] });
}

export async function getRevenueSummary(req, res) {
  const subs = await querySupabase('revenue_subscriptions');
  const mrr = await querySupabase('revenue_mrr_daily', 'date,product,mrr,active_subscribers');
  
  const totalMrr = (subs || []).filter(s => s.status === 'active').reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalSubs = (subs || []).filter(s => s.status === 'active').length;
  
  res.json({ mrr: totalMrr, subscribers: totalSubs, mrrHistory: mrr || [], subscriptions: subs || [] });
}
