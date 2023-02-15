import * as deotenv from "dotenv";
deotenv.config();

const url = (path) => new URL(path, import.meta.url);

// Environment config
export const token = process.env.TOKEN;

// Urls
export const commandsUrl = url("./commands/");
export const eventsUrl = url("./events/");
export const sqlUrl = url("./sql/create.sql");
export const dbUrl = url("../db.sqlite");
