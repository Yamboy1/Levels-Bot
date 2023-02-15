import { Events } from "discord.js";

const XP_PER_MESSAGE = 10;

const sqlStatements = (db) => ({
  select: db.prepare("SELECT * FROM users WHERE user_id = ? AND guild_id = ?"),
  insert: db.prepare(
    "INSERT INTO users (user_id, guild_id, xp) VALUES (?, ?, ?)"
  ),
  update: db.prepare(
    "UPDATE users SET xp = ? WHERE user_id = ? AND guild_id = ?"
  ),
});

export const event = Events.MessageCreate;

export const execute = async (message) => {
  if (message.author.bot) return;
  if (!message.guildId) return;

  const statements = sqlStatements(message.client.db);

  const userId = message.author.id;
  const guildId = message.guildId;

  const data = await statements.select.get(userId, guildId);
  if (!data) {
    await statements.insert.run(userId, guildId, XP_PER_MESSAGE);
  } else {
    await statements.update.run(data.xp + XP_PER_MESSAGE, userId, guildId);
  }
};
