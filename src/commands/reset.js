import * as fs from "fs/promises";
import { SlashCommandBuilder } from "discord.js";
import { createDb, dropDb } from "../db.js";

export const data = new SlashCommandBuilder()
  .setName("reset")
  .setDescription("Reset database");

export async function execute(interaction) {
  await interaction.deferReply();
  await dropDb();
  await createDb();
  await interaction.editReply("Database reset");
}
