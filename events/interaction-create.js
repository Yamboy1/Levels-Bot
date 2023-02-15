import { Events } from "discord.js";

const ERROR_REPLY = {
  content: "There was an error while executing this command!",
  ephemeral: true,
};

export const event = Events.InteractionCreate;

export const execute = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    // If the command is deferred, we need to edit the original reply,
    // otherwise we get an error that the interaction has already been sent.
    if (interaction.deferred) {
      await interaction.editReply(ERROR_REPLY);
    } else {
      await interaction.reply(ERROR_REPLY);
    }
  }
};
