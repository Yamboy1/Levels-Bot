import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "node:fs/promises";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import Database from "better-sqlite3";

const XP_PER_MESSAGE = 10;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
client.commands = new Collection();
client.db = new Database("db.sqlite");

await client.db.exec(await fs.readFile("sql/create.sql", "utf-8"));

const commandsPath = new URL("./commands/", import.meta.url);
const commandFiles = (await fs.readdir(commandsPath)).filter((file) =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  const command = await import(new URL(file, commandsPath).href);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.error(`Command ${file} does not export data and execute`);
  }
}

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  const userId = message.author.id;
  const guildId = message.guildId;
  if (!guildId) return;

  const statement = await client.db.prepare(
    "SELECT * FROM users WHERE user_id = ? AND guild_id = ?"
  );
  const result = await statement.get(userId, guildId);
  if (!result) {
    await client.db
      .prepare("INSERT INTO users (user_id, guild_id, xp) VALUES (?, ?, ?)")
      .run(userId, guildId, XP_PER_MESSAGE);
  } else {
    await client.db
      .prepare("UPDATE users SET xp = ? WHERE user_id = ? AND guild_id = ?")
      .run(result.xp + XP_PER_MESSAGE, userId, guildId);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  // handle slash commands using the commands collection
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.deferred) {
      await interaction.editReply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN);
