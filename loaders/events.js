import * as fs from "node:fs/promises";

export const loadEvents = async (url, client) => {
  const files = (await fs.readdir(url)).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const event = await import(new URL(file, url).href);
    if (!event.event || !event.execute) {
      console.error(`Event ${file} does not export event and execute`);
      continue;
    }

    if (event.once) {
      client.once(event.event, (...args) => event.execute(...args));
    } else {
      client.on(event.event, (...args) => event.execute(...args));
    }
  }
};
