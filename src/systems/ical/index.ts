import Collection from "@discordjs/collection";
import ical from "node-ical";
import { DateTime } from "luxon";

export type icalEventData = {
  summary: string;
  start: DateTime;
  end: DateTime;
  location: string;
};

export async function getData() {
  try {
    const data = new Collection<DateTime, icalEventData>();
    const cal = await ical.fromURL(process.env.ICAL_URL);
    for (const [, event] of Object.entries(cal)) {
      if (event.type == "VEVENT" && "toLocaleString" in event.start && "toLocaleString" in event.end) {
        const start = DateTime.fromJSDate(event.start, { zone: event.start.tz });
        const end = DateTime.fromJSDate(event.end, { zone: event.end.tz });
        data.set(start, {
          summary: event.summary,
          start,
          end,
          location: event.location,
        });
      }
    }
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}
