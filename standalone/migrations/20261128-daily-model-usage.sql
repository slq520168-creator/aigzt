CREATE TABLE IF NOT EXISTS usage_tracking_meta(id INTEGER PRIMARY KEY CHECK(id=1),started_at INTEGER NOT NULL);
INSERT OR IGNORE INTO usage_tracking_meta(id,started_at) VALUES(1,CAST(strftime('%s','now') AS INTEGER)*1000);
CREATE TABLE IF NOT EXISTS daily_model_usage(
 user_id TEXT NOT NULL,day TEXT NOT NULL,mode TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,
 actual_provider TEXT NOT NULL,actual_model TEXT NOT NULL,level TEXT NOT NULL,
 requests INTEGER NOT NULL DEFAULT 0,succeeded INTEGER NOT NULL DEFAULT 0,failed INTEGER NOT NULL DEFAULT 0,
 reported INTEGER NOT NULL DEFAULT 0,input_tokens INTEGER NOT NULL DEFAULT 0,output_tokens INTEGER NOT NULL DEFAULT 0,total_tokens INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(user_id,day,mode,provider,model,actual_provider,actual_model,level)
);
CREATE TABLE IF NOT EXISTS provider_quota_snapshots(
 scope TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,snapshot_json TEXT NOT NULL,observed_at INTEGER NOT NULL,
 PRIMARY KEY(scope,provider,model)
);
CREATE INDEX IF NOT EXISTS ix_messages_user_created_usage ON messages(user_id,created_at);
