-- =========================================================
-- 새롬고 교육과정 박람회 - Supabase 스키마
-- 사용법: Supabase 프로젝트의 SQL Editor에 전체 복사 → Run
-- =========================================================

-- 1) 게시글 테이블
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 20),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2) 좋아요 테이블 (user_id = 브라우저별 익명 ID)
CREATE TABLE post_likes (
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- 3) 댓글 테이블
CREATE TABLE post_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 20),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 300),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) 조회 성능 인덱스
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON post_comments(post_id, created_at);
CREATE INDEX idx_likes_post ON post_likes(post_id);

-- 5) RLS(Row Level Security) 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 6) 누구나 읽기/쓰기 가능 (익명 커뮤니티)
CREATE POLICY "anyone_read_posts" ON posts FOR SELECT USING (true);
CREATE POLICY "anyone_insert_posts" ON posts FOR INSERT WITH CHECK (true);

CREATE POLICY "anyone_read_likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "anyone_insert_likes" ON post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone_delete_likes" ON post_likes FOR DELETE USING (true);

CREATE POLICY "anyone_read_comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "anyone_insert_comments" ON post_comments FOR INSERT WITH CHECK (true);

-- 7) 실시간(Realtime) 활성화 - 글/좋아요/댓글 변경 시 모든 사용자에게 즉시 반영
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
