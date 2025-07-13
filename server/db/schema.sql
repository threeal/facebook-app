CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  caption TEXT,
  image TEXT,
  video TEXT,
  reactions INTEGER DEFAULT 0,
  date TEXT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);
