-- 日日一相：跨瀏覽器同步進度
-- 請在 Supabase Dashboard > SQL Editor 中執行

CREATE TABLE isp_progress (
  sync_code TEXT PRIMARY KEY,
  progress JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 自動更新 updated_at
CREATE TRIGGER isp_progress_updated_at
  BEFORE UPDATE ON isp_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: 任何人都可以用同步碼存取（匿名存取）
ALTER TABLE isp_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read with sync code"
  ON isp_progress FOR SELECT USING (true);

CREATE POLICY "Anyone can insert"
  ON isp_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update"
  ON isp_progress FOR UPDATE USING (true);

-- 自動清除 90 天未更新的資料
-- (可選) 手動執行或設定 cron
-- DELETE FROM isp_progress WHERE updated_at < NOW() - INTERVAL '90 days';
