import { Collection, Message } from "discord.js";
import { Command } from "../../command-handler";
import { getData } from "../../systems/ical";
import { DateTime } from "luxon";
import canvasWeek from "../../systems/ical/canvasWeek";

class Week extends Command {
  public name = "Week";
  public aliases = [];
  public category = "ICal";
  public desc = "Show this week's classes";
  public args = [];
  public isDev = false;

  constructor() {
    super();
    this.init();
  }

  public async run(message: Message): Promise<void> {
    try {
      message.channel.sendTyping();
      const data = await getData();
      const dt = DateTime.now();

      const weekData = data.filter((e) => {
        return dt.startOf("week") < e.start && e.start < dt.endOf("week");
      });

      const days = new Collection<number, typeof weekData>();
      weekData.forEach((ev) => {
        let coll = days.get(ev.start.day);
        if (coll) {
          coll.set(ev.start, ev);
          days.set(ev.start.day, coll);
        } else {
          coll = new Collection();
          coll.set(ev.start, ev);
          days.set(ev.start.day, coll);
        }
      });

      days.sort((dA, dB) => {
        return dA.first().start.day - dB.first().start.day;
      });

      let maxDaySize = 0;

      days.forEach((day) => {
        day.sort((dA, dB) => {
          return dA.start.diff(dB.start).as("minutes");
        });
        if (day.size > maxDaySize) maxDaySize = day.size;
      });

      message.channel.send({ files: [canvasWeek(days, maxDaySize)] });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default new Week();
