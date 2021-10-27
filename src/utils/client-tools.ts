import { prefix, devId } from "../settings.json";
import { DateTime } from "luxon";
import { User } from "discord.js";
console.log(prefix, devId);
const prefixRegex = new RegExp(`^${escapeRegExp(prefix)}\\w+`);

function escapeRegExp(text: string): string {
  return text?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export default {
  logDate(timestamp: number = Date.now()): string {
    return DateTime.fromMillis(timestamp).toFormat("yyyy-MM-dd | TT 'GMT'ZZZ");
  },
  isMsgStartsWithPrefix(msgContent: string) {
    return prefixRegex.test(msgContent);
  },
  isDev(user: User) {
    return user.id == devId;
  },
};
