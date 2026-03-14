-- ===========================================
-- SIDE QUEST STUDIOS ANALYTICS SCHEMA
-- ===========================================
-- Run this in Supabase SQL Editor
-- ===========================================

-- X/TWITTER ANALYTICS TABLES

CREATE TABLE IF NOT EXISTS x_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT UNIQUE NOT NULL,
    handle TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS x_followers_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT NOT NULL,
    date DATE NOT NULL,
    follower_count INTEGER NOT NULL,
    following_count INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    lost_followers INTEGER DEFAULT 0,
    net_growth INTEGER GENERATED ALWAYS AS (new_followers - lost_followers) STORED,
    source TEXT,
    trigger_post_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, date)
);

CREATE TABLE IF NOT EXISTS x_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id TEXT UNIQUE NOT NULL,
    account_id TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT,
    topic_category TEXT,
    hook_type TEXT,
    sentiment TEXT,
    posted_at TIMESTAMPTZ NOT NULL,
    impressions INTEGER DEFAULT 0,
    impressions_organic INTEGER DEFAULT 0,
    impressions_viral INTEGER DEFAULT 0,
    impressions_paid INTEGER DEFAULT 0,
    engagements INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    quotes INTEGER DEFAULT 0,
    bookmarks INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN (engagements::DECIMAL / impressions * 100) ELSE 0 END
    ) STORED,
    new_followers_from_post INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN (new_followers_from_post::DECIMAL / impressions * 100) ELSE 0 END
    ) STORED,
    performance_tier TEXT,
    best_performing_metric TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS x_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    account_id TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    hypothesis TEXT,
    description TEXT,
    variant_a_text TEXT,
    variant_b_text TEXT,
    variant_a_metrics JSONB,
    variant_b_metrics JSONB,
    winner TEXT,
    confidence_level DECIMAL(5,2),
    improvement_percentage DECIMAL(5,2),
    insight TEXT,
    start_date DATE,
    end_date DATE,
    duration_days INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS x_viral_spikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT NOT NULL,
    post_id TEXT REFERENCES x_posts(post_id),
    spike_date DATE NOT NULL,
    follower_growth INTEGER NOT NULL,
    engagement_spike DECIMAL(5,2),
    trigger_type TEXT,
    virality_score INTEGER,
    reach_estimate INTEGER,
    top_sources JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM TABLES

CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    website TEXT,
    company_name TEXT,
    company_size TEXT,
    industry TEXT,
    title TEXT,
    linkedin_url TEXT,
    location TEXT,
    region TEXT,
    source TEXT,
    lead_score INTEGER DEFAULT 0,
    estimated_value INTEGER DEFAULT 0,
    status TEXT DEFAULT 'new',
    stage INTEGER DEFAULT 1,
    notes TEXT,
    tags TEXT[],
    first_contact_at TIMESTAMPTZ,
    last_contact_at TIMESTAMPTZ,
    next_follow_up DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    email_subject TEXT,
    email_template TEXT,
    email_status TEXT,
    call_duration_minutes INTEGER,
    call_outcome TEXT,
    meeting_type TEXT,
    meeting_notes TEXT,
    meeting_scheduled_at TIMESTAMPTZ,
    meeting_completed_at TIMESTAMPTZ,
    direction TEXT,
    outcome TEXT,
    next_steps TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    steps JSONB NOT NULL,
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_replied INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_sent > 0 THEN (total_opened::DECIMAL / total_sent * 100) ELSE 0 END
    ) STORED,
    reply_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_sent > 0 THEN (total_replied::DECIMAL / total_sent * 100) ELSE 0 END
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVENUE TABLES

CREATE TABLE IF NOT EXISTS revenue_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id TEXT UNIQUE NOT NULL,
    product TEXT NOT NULL,
    plan TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'active',
    started_at TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    last_payment_at TIMESTAMPTZ,
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revenue_mrr_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    product TEXT NOT NULL,
    mrr DECIMAL(10,2) NOT NULL,
    active_subscribers INTEGER NOT NULL,
    new_subscribers INTEGER DEFAULT 0,
    churned_subscribers INTEGER DEFAULT 0,
    net_change INTEGER GENERATED ALWAYS AS (new_subscribers - churned_subscribers) STORED,
    lifetime_deals_count INTEGER DEFAULT 0,
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, product)
);

-- CONTENT TABLES

CREATE TABLE IF NOT EXISTS content_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id TEXT UNIQUE NOT NULL,
    platform TEXT NOT NULL,
    content_type TEXT NOT NULL,
    title TEXT,
    topic_category TEXT,
    published_at TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagements INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN (engagements::DECIMAL / impressions * 100) ELSE 0 END
    ) STORED,
    performance_tier TEXT,
    top_performing_metric TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MARKETING TABLES

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    platform TEXT,
    status TEXT DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    spent DECIMAL(10,2) DEFAULT 0,
    target_metric TEXT,
    target_value INTEGER,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    cost_per_acquisition DECIMAL(10,2),
    roi DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANALYTICS CONFIG TABLES

CREATE TABLE IF NOT EXISTS analytics_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_refresh_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source TEXT NOT NULL,
    frequency TEXT NOT NULL,
    last_refreshed_at TIMESTAMPTZ,
    next_refresh_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active',
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SAMPLE DATA
-- ===========================================

INSERT INTO x_accounts (account_id, handle, name, followers, following, posts_count) VALUES
('addonquote', '@addonquote', 'AddOnQuote', 127, 89, 1250),
('sidequest', '@SideQuestStd', 'Side Quest Studios', 234, 156, 1180),
('sheetitnow', '@sheetitnow', 'Sheet It Now', 89, 67, 980)
ON CONFLICT (account_id) DO UPDATE SET 
    followers = EXCLUDED.followers,
    posts_count = EXCLUDED.posts_count,
    updated_at = NOW();

-- Enable Row Level Security (RLS) - optional
-- ALTER TABLE x_accounts ENABLE ROW LEVEL SECURITY;
