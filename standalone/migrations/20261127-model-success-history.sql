CREATE TABLE IF NOT EXISTS user_model_success_history (
 user_id TEXT NOT NULL,
 provider TEXT NOT NULL,
 model TEXT NOT NULL,
 last_success INTEGER NOT NULL,
 PRIMARY KEY(user_id,provider,model)
);
CREATE INDEX IF NOT EXISTS idx_user_model_success_recent ON user_model_success_history(user_id,last_success DESC);
