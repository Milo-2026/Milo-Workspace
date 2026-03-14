-- NoCodeLab Database Schema for Supabase

-- Admin users table (for control panel)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    source TEXT DEFAULT 'website',
    current_day INTEGER DEFAULT 0
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    product TEXT NOT NULL,
    amount INTEGER,
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Allow public read admin_users" ON admin_users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert admin_users" ON admin_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update admin_users" ON admin_users
    FOR UPDATE USING (true);

-- Create policies for public access (for authenticated users)
CREATE POLICY "Allow public read subscribers" ON subscribers
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert subscribers" ON subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read purchases" ON purchases
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert purchases" ON purchases
    FOR INSERT WITH CHECK (true);
