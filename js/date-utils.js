/* Datum-Hilfsfunktionen */

// Tage im Monat
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// 1. Wochentag, Mo=0
function getFirstWeekdayOfMonth(year, month) {
  var firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  if (firstDayOfMonth === 0) return 6;
  return firstDayOfMonth - 1;
}

// Heute
function isToday(year, month, day) {
  var currentDate = new Date();
  return (
    currentDate.getFullYear() === year &&
    currentDate.getMonth() === (month - 1) &&
    currentDate.getDate() === day
  );
}

// YYYY-MM-DD
function formatDateForApiComparison(year, month, day) {
  var monthWithLeadingZero = month < 10 ? "0" + month : month;
  var dayWithLeadingZero = day < 10 ? "0" + day : day;
  return year + "-" + monthWithLeadingZero + "-" + dayWithLeadingZero;
}
