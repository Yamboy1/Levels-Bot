import * as fs from "node:fs/promises";
import { Collection } from "discord.js";

export const loadCommands = async (url) => {
  const collection = new Collection();

  const files = (await fs.readdir(url)).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const command = await import(new URL(file, url).href);
    if (!command.data || !command.execute) {
      console.error(`Command ${file} does not export data and execute`);
      continue;
    }

    collection.set(command.data.name, command);
  }

  return collection;
};
