import { Events } from "discord.js";
import { selectStatement, insertStatement, updateStatement } from "../db.js";

const XP_PER_MESSAGE = 10;

export const event = Events.MessageCreate;

export const execute = async (message) => {
  if (message.author.bot) return;
  if (!message.guildId) return;

  const userId = message.author.id;
  const guildId = message.guildId;

  const data = selectStatement.get(userId, guildId);
  if (!data) {
    insertStatement.run(userId, guildId, XP_PER_MESSAGE);
  } else {
    updateStatement.run(data.xp + XP_PER_MESSAGE, userId, guildId);
  }
};
