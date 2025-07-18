CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  has_avatar INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  caption TEXT NOT NULL DEFAULT "",
  media_type TEXT,
  reactions INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
