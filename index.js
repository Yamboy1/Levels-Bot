import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "node:fs/promises";
import Database from "better-sqlite3";
import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./loaders/commands.js";
import { loadEvents } from "./loaders/events.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
client.commands = await loadCommands(new URL("./commands/", import.meta.url));
client.db = new Database("db.sqlite");

loadEvents(new URL("./events/", import.meta.url), client);
await client.db.exec(await fs.readFile("sql/create.sql", "utf-8"));

client.login(process.env.TOKEN);
