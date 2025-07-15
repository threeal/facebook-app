import SQLite from "better-sqlite3";
import { Generated, Kysely, SqliteDialect, Nullable } from "kysely";

interface Database {
  users: {
    id: Generated<number>;
    name: string;
    avatar: string;
  };
  posts: {
    id: Generated<number>;
    author_id: number;
    caption: Nullable<string>;
    media: Nullable<string>;
    reactions: Generated<number>;
    date: string;
  };
}

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new SQLite("data/db.sqlite"),
  }),
});
