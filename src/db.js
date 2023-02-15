import { readFile } from "node:fs/promises";
import Database from "better-sqlite3";
import { dbUrl, sqlUrl } from "./config.js";

const db = new Database(dbUrl.pathname);

export const createDb = async () => {
  const sql = await readFile(sqlUrl, "utf-8");
  db.exec(sql);
};

export const dropDb = async () => {
  db.exec("DROP TABLE users");
};

export const selectStatement = db.prepare(
  "SELECT * FROM users WHERE user_id = ? AND guild_id = ?"
);

export const insertStatement = db.prepare(
  "INSERT INTO users (user_id, guild_id, xp) VALUES (?, ?, ?)"
);

export const updateStatement = db.prepare(
  "UPDATE users SET xp = ? WHERE user_id = ? AND guild_id = ?"
);

// Create the db if it doesn't exist
// when first importing this module
createDb();
