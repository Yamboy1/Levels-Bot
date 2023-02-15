import { SlashCommandBuilder } from "discord.js";
import { selectStatement } from "../db.js";

export const data = new SlashCommandBuilder()
  .setName("xp")
  .setDescription("View your own, or another user's XP in the current server")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to view XP for")
  );

export async function execute(interaction) {
  await interaction.deferReply();
  const userId = interaction.options.getUser("user")?.id ?? interaction.user.id;
  const guildId = interaction.guildId;
  if (!guildId) return;

  const result = selectStatement.get(userId, guildId);
  if (!result) {
    await interaction.editReply("User has no XP");
  } else {
    await interaction.editReply(`User has ${result.xp} XP`);
  }
}
