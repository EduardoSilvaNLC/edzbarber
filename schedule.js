/* EDZ Barber — booking REQUEST times, in UK local time (Europe/London).
   Every day, Monday through Sunday: 09:00–19:00 inclusive (one-hour steps).
   The 19:00 appointment starts at 19:00, with the one-hour slot ending 20:00.
   Requests are NOT live availability and require manual confirmation.

   To block a date, add it to closedDates, e.g. ['2026-12-25'].
   To block a taken/unavailable time, use blockedTimes, e.g.
   {'2026-12-01': ['09:00', '14:00']}.
*/
window.EDZ_BOOKING_SCHEDULE = {
  regularDayTimes: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  dayOffTimes: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  daysOff: [], // No different times on days off; every day uses 09:00–19:00.
  closedDates: [],
  blockedTimes: {},
  minimumLeadMinutes: 60,
  maxDaysAhead: 90
};
