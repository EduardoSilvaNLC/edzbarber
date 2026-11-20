/* EDZ BARBER: EDIT YOUR REQUEST HOURS HERE.
  The default working-day hours are 16:00–19:00 (you work until 15:00).
  Put each off-duty date in daysOff to show 09:00–19:00.
  Put dates with no availability in closedDates; block booked hours in blockedTimes.
  These are REQUEST WINDOWS, NOT A LIVE BOOKING CALENDAR.
  Example: daysOff: ['2026-11-26', '2026-11-29'],
           blockedTimes: {'2026-11-26': ['09:00','10:00']}
*/
window.EDZ_BOOKING_SCHEDULE={
 regularDayTimes:['16:00','17:00','18:00','19:00'],
 dayOffTimes:['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'],
 daysOff:[], closedDates:[], blockedTimes:{}, minimumLeadMinutes:60
};
