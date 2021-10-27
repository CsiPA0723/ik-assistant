import { Client, Intents } from "discord.js";

import "./command-handler";
import logger from "./utils/logger";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  logger.info("Ready!");
});

client.login(process.env.TOKEN).catch(logger.error);
