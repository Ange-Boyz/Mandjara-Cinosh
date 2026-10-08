// Builds an .ics calendar file entirely in the browser.
// RFC 5545 text escaping. Carriage returns are dropped so nothing can inject extra ICS lines.
export const esc = (t) =>
  String(t ?? '')
    .replace(/\r/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function downloadCalendarEvent({ uid, title, startsAt, minutes = 150, location, description }) {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + minutes * 60000);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mandjara Cinosh//Screening//EN',
    'BEGIN:VEVENT',
    `UID:${esc(uid)}@mandjara`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mandjara-screening.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
