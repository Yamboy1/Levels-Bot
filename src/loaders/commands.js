import * as fs from "node:fs/promises";
import { Collection } from "discord.js";
import { commandsUrl } from "../config.js";

const loadCommands = async () => {
  const collection = new Collection();

  const files = (await fs.readdir(commandsUrl)).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of files) {
    const command = await import(new URL(file, commandsUrl));
    if (!command.data || !command.execute) {
      console.error(`Command ${file} does not export data and execute`);
      continue;
    }
    collection.set(command.data.name, command);
  }

  return collection;
};

export const commands = await loadCommands();
