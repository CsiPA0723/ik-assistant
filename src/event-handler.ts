import { Client } from "discord.js";
import message from "./events/message";

export default function (client: Client): void {
  client.on("messageCreate", message);
}
