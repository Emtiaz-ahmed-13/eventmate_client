type CalendarEvent = {
  name: string;
  description?: string;
  dateTime: string;
  location: string;
  durationHours?: number;
};

const formatGoogleDate = (date: Date) =>
  date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

export const buildGoogleCalendarUrl = (event: CalendarEvent) => {
  const start = new Date(event.dateTime);
  const end = new Date(start.getTime() + (event.durationHours ?? 2) * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
    details: event.description || `Event on EventMate`,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadAppleCalendarIcs = (event: CalendarEvent) => {
  const start = new Date(event.dateTime);
  const end = new Date(start.getTime() + (event.durationHours ?? 2) * 60 * 60 * 1000);
  const uid = `${event.name.replace(/\s+/g, "-").toLowerCase()}-${start.getTime()}@eventmate.app`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EventMate//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatGoogleDate(new Date())}`,
    `DTSTART:${formatGoogleDate(start)}`,
    `DTEND:${formatGoogleDate(end)}`,
    `SUMMARY:${event.name.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${(event.description || "EventMate event").replace(/\n/g, "\\n").replace(/,/g, "\\,")}`,
    `LOCATION:${event.location.replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.name.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
