import * as fs from "fs/promises";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("reset")
  .setDescription("Reset database");

export async function execute(interaction) {
  await interaction.deferReply();
  await interaction.client.db.exec("DROP TABLE users");
  await interaction.client.db.exec(
    await fs.readFile(new URL("../sql/create.sql", import.meta.url), "utf-8")
  );
  await interaction.editReply("Dropped database");
}
