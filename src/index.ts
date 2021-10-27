import { Client, Intents } from "discord.js";
import logger from "./utils/logger";

import "./command-handler";
import "./commands";

import EventHandler from "./event-handler";
import ClientTools from "./utils/client-tools";

declare module "discord.js" {
  interface Client {
    tools: typeof ClientTools;
  }
}

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

client.tools = ClientTools;

client.once("ready", () => {
  EventHandler(client);

  logger.info("Ready!");
});

client.login(process.env.TOKEN).catch(logger.error);
