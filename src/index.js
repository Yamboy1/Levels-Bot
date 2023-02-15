import { Client, GatewayIntentBits } from "discord.js";
import { token } from "./config.js";
import { loadEvents } from "./loaders/events.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

loadEvents(client);
client.login(token);
