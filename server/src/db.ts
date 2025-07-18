import SQLite from "better-sqlite3";
import { Generated, Kysely, SqliteDialect } from "kysely";

interface Database {
  users: {
    id: string;
    name: string;
    has_avatar: Generated<number>;
  };
  posts: {
    id: string;
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
