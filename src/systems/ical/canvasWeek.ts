import { createCanvas, registerFont } from "canvas";
import CascadiaCodePL from "../../fonts/CascadiaCodePL.ttf";
import { stripIndents } from "common-tags";
import { DateTime } from "luxon";
import { Collection, MessageAttachment } from "discord.js";
import { icalEventData } from ".";

export type NodeCanvasRenderingContext2D = ReturnType<ReturnType<typeof createCanvas>["getContext"]>;

const dayNames = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

const dayArray: { day: number; name: string }[] = [];

const dt = DateTime.now();
const startOfWeek = dt.startOf("week");
const endOfWeek = dt.endOf("week");

for (let day = startOfWeek.day; day <= endOfWeek.day; day++) {
  dayArray.push({ day, name: dayNames[day - startOfWeek.day] });
}

export default function (days: Collection<number, Collection<DateTime, icalEventData>>, maxDaySize: number) {
  const cellWidth = 340; // Pixel
  const cellHeight = 160; // Pixel

  const width = cellWidth * 5; // number of days from monday (e.g.: 7 would be a full week)
  const heigth = cellHeight * (maxDaySize + 1); // +1, because day names (e.g.: Monday)

  registerFont(`./${process.env.NODE_ENV === "development" ? "dist/" : ""}${CascadiaCodePL}`, {
    family: "Cascadia Code PL",
  });

  const canvas = createCanvas(width, heigth);
  const ctx = canvas.getContext("2d");
  ctx.quality = "best";
  ctx.antialias = "subpixel";

  ctx.fillStyle = "#363544";
  ctx.fillRect(0, 0, width, heigth);

  ctx.fillStyle = ctx.strokeStyle = "white";
  ctx.lineWidth = 4.0;

  ctx.strokeRect(0, 0, width, heigth);

  const padding = 20; // Pixel;
  const rightPadding = cellWidth - padding - ctx.lineWidth * 4;

  for (let i = 0; i < width; i += cellWidth) {
    const { day, name } = dayArray[i / cellWidth];
    const events = days.get(day)?.toJSON();
    for (let j = 0; j < heigth; j += cellHeight) {
      const sx = 0 + i;
      const sy = 0 + j;
      ctx.strokeRect(sx, sy, cellWidth, cellHeight);

      if (j == 0) {
        // Days
        ctx.font = `28pt Impact`;
        const text = `${day}. ${name}`;
        const textMetrics = ctx.measureText(text);
        ctx.fillText(text, sx + cellWidth / 2 - textMetrics.width / 2, sy + cellHeight / 2);
      } else if (events && events[j / cellHeight - 1]) {
        // Summary
        ctx.font = `18pt Impact`;
        const { summary, start, end, location } = events[j / cellHeight - 1];
        const text = getLines(
          ctx,
          summary.replace(/(?:(?:EA\+GY|EA\.?|GY\.?) )?(?:\(.*\) )|(?! - \d{1,2})(?: - .*\b)/g, ""),
          rightPadding
        ).join("\n");

        ctx.fillText(text, sx + padding, sy + padding * 2, rightPadding);

        // Time
        const timeText = `${start.toLocal().toFormat("HH:mm")}\n${end.toLocal().toFormat("HH:mm")}`;
        const timeTextMetrics = ctx.measureText(timeText);
        ctx.font = `18pt Cascadia Code PL`;
        ctx.fillText(
          timeText,
          sx + rightPadding - timeTextMetrics.width,
          sy + cellHeight - padding * 2 - ctx.lineWidth * 4
        );

        // Location
        const regex = /(LÉ|LD)(?:-)(-?\d{1,2})-(\d*)/g;
        const result = regex.exec(location);

        if (!result[0]) continue;

        const locText = stripIndents(`
              ${result[1] === "LÉ" ? "Északi" : "Déli"}
              ${result[2]}.${result[3]}
            `);

        ctx.fillText(locText, sx + padding, sy + cellHeight - padding * 2 - ctx.lineWidth * 4);
      }
    }
  }

  return new MessageAttachment(canvas.toBuffer(), "week.png");
}

function getLines(ctx: NodeCanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
