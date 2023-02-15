import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("level")
  .setDescription(
    "View your own, or another user's level in the current server"
  )
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to view level for")
  );

export async function execute(interaction) {
  await interaction.deferReply();
  const userId = interaction.options.getUser("user")?.id ?? interaction.user.id;
  const guildId = interaction.guildId;
  if (!guildId) return;
  const statement = await interaction.client.db.prepare(
    "SELECT * FROM users WHERE user_id = ? AND guild_id = ?"
  );
  const result = await statement.get(userId, guildId);
  if (!result) {
    await interaction.editReply("User has no level");
  } else {
    const level = Math.floor(result.xp / 100);
    await interaction.editReply(`User has level ${level}`);
  }
}
