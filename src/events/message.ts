import { Message } from "discord.js";
import CommandHandler from "../command-handler";

export default async function (message: Message): Promise<void> {
  try {
    if (!message.channel.isText()) return;
    if (message.partial) await message.fetch();
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;
    if (message.mentions.has(message.client.user)) {
      message.reply("For help use: `>help`");
      return;
    }
    if (!message.client.tools.isMsgStartsWithPrefix(message.content)) return;
    const { command, args } = CommandHandler.getCommand(message);

    if (!command) return;

    if (!command.isDev) command.run(message, args);
    else if (message.client.tools.isDev(message.author)) command.run(message, args);
  } catch (error) {
    return Promise.reject(error);
  }
}
