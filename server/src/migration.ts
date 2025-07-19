import SQLite from "better-sqlite3";
import { Generated, Kysely, SqliteDialect } from "kysely";

interface Database {
  oldusers: {
    id: string;
    name: string;
    has_avatar: Generated<number>;
  };
  oldposts: {
    id: string;
    author_id: string;
    timestamp: number;
    caption: Generated<string>;
    media_type: "image" | "video" | null;
    reactions: Generated<number>;
  };
  users: {
    id: Generated<number>;
    slug: string;
    name: string;
    has_avatar: Generated<number>;
  };
  posts: {
    id: Generated<number>;
    slug: string;
    author_id: string;
    timestamp: number;
    caption: Generated<string>;
    media_type: "image" | "video" | null;
    reactions: Generated<number>;
  };
}

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new SQLite("data/db.sqlite"),
  }),
});
