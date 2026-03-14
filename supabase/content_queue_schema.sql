-- ============================================
-- CONTENT QUEUE & TWEET TRACKING TABLES
-- ============================================

-- Table: Content Queue (Kanban for tweets)
CREATE TABLE IF NOT EXISTS content_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    content TEXT NOT NULL,
    account_id TEXT NOT NULL CHECK (account_id IN ('addonquote', 'sidequest', 'sheetitnow')),
    
    -- Kanban Status
    status TEXT DEFAULT 'queue' CHECK (status IN (
        'queue',      -- Publishing Queue (approved by default)
        'revision',   -- Needs revision (checkbox triggered)
        'posted',     -- Posted - monitoring first 24h
        'archive',    -- Underperformed - archived
        'monitoring'  -- Active Monitoring (surpassed threshold)
    )),
    
    -- Revision tracking
    needs_revision BOOLEAN DEFAULT FALSE,
    revision_notes TEXT,
    
    -- Scheduling
    scheduled_date TIMESTAMPTZ,
    posted_at TIMESTAMPTZ,
    
    -- Metrics (from X API)
    impressions INTEGER DEFAULT 0,
    engagements INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    
    -- Engagement rate (calculated)
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Performance tier
    performance_tier TEXT CHECK (performance_tier IN ('viral', 'high', 'medium', 'low')),
    
    -- Monitoring
    monitoring_status TEXT DEFAULT 'pending' CHECK (monitoring_status IN (
        'pending',     -- Awaiting 24h check
        'week1',       -- First week monitoring
        'extended',    -- Extended to 30 days
        'complete',    -- Monitoring done
        'archived'     -- Archived
    )),
    threshold_met BOOLEAN DEFAULT FALSE,
    monitoring_started_at TIMESTAMPTZ,
    monitoring_ends_at TIMESTAMPTZ,
    
    -- Analysis
    analysis_notes TEXT,
    analysis_triggered_at TIMESTAMPTZ,
    
    -- Original post reference
    original_post_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Tweet Metrics History (daily snapshots)
CREATE TABLE IF NOT EXISTS tweet_metrics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tweet_id UUID REFERENCES content_queue(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    engagements INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tweet_id, date)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_content_queue_status ON content_queue(status);
CREATE INDEX IF NOT EXISTS idx_content_queue_account ON content_queue(account_id);
CREATE INDEX IF NOT EXISTS idx_content_queue_scheduled ON content_queue(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_queue_posted ON content_queue(posted_at);
CREATE INDEX IF NOT EXISTS idx_tweet_metrics_tweet ON tweet_metrics_daily(tweet_id);
CREATE INDEX IF NOT EXISTS idx_tweet_metrics_date ON tweet_metrics_daily(date);

-- ============================================
-- THRESHOLD CONFIGURATION
-- ============================================

-- Table: Threshold Configuration
CREATE TABLE IF NOT EXISTS threshold_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id TEXT NOT NULL UNIQUE CHECK (account_id IN ('addonquote', 'sidequest', 'sheetitnow')),
    min_engagements INTEGER DEFAULT 100,
    min_engagement_rate DECIMAL(5,2) DEFAULT 5.0,
    monitoring_days INTEGER DEFAULT 7,
    extended_monitoring_days INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default thresholds per account
INSERT INTO threshold_config (account_id, min_engagements, min_engagement_rate, monitoring_days) VALUES
    ('addonquote', 50, 3.0, 7),
    ('sidequest', 75, 4.0, 7),
    ('sheetitnow', 40, 2.5, 7)
ON CONFLICT (account_id) DO UPDATE SET
    min_engagements = EXCLUDED.min_engagements,
    min_engagement_rate = EXCLUDED.min_engagement_rate;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate(impressions INT, engagements INT)
RETURNS DECIMAL(5,2) AS $$
BEGIN
    IF impressions = 0 THEN RETURN 0;
    RETURN ROUND((engagements::DECIMAL / impressions * 100), 2);
END;
$$ LANGUAGE plpgsql;

-- Update engagement rate on metrics change
CREATE OR REPLACE FUNCTION update_engagement_rate()
RETURNS TRIGGER AS $$
BEGIN
    NEW.engagement_rate = calculate_engagement_rate(NEW.impressions, NEW.engagements);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_queue_rate
    BEFORE UPDATE ON content_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_engagement_rate();

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE content_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweet_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE threshold_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to content queue" ON content_queue FOR ALL
    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to metrics" ON tweet_metrics_daily FOR ALL
    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to thresholds" ON threshold_config FOR ALL
    TO authenticated USING (true) WITH CHECK (true);
