import { Events } from "discord.js";

export const once = true;
export const event = Events.ClientReady;

export const execute = (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
};
