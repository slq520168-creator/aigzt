CREATE TABLE IF NOT EXISTS imai_request_receipts(user_id TEXT NOT NULL,request_id TEXT NOT NULL,fingerprint TEXT NOT NULL,state TEXT NOT NULL,result_json TEXT,created_at INTEGER NOT NULL,PRIMARY KEY(user_id,request_id));
CREATE TABLE IF NOT EXISTS imai_catalog_favorites(user_id TEXT NOT NULL,kind TEXT NOT NULL,items_json TEXT NOT NULL,revision INTEGER NOT NULL,PRIMARY KEY(user_id,kind));
