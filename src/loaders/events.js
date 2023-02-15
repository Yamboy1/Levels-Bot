import * as fs from "node:fs/promises";
import { eventsUrl } from "../config.js";

export const loadEvents = async (client) => {
  const files = (await fs.readdir(eventsUrl)).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of files) {
    const event = await import(new URL(file, eventsUrl));
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
