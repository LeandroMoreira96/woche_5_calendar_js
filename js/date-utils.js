/* =========================================================
   DATE-UTILS.JS – Hilfsfunktionen für Datum und Kalender
   ========================================================= */

// Gibt zurück, wie viele Tage ein Monat hat.
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// Ermittelt, auf welchen Wochentag der 1. des Monats fällt.
// Mo=0 bis So=6 (Woche beginnt am Montag).
function getFirstWeekdayOfMonth(year, month) {
  var firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  if (firstDayOfMonth === 0) return 6;
  return firstDayOfMonth - 1;
}

// Prüft, ob ein bestimmter Tag heute ist.
function isToday(year, month, day) {
  var currentDate = new Date();
  return (
    currentDate.getFullYear() === year &&
    currentDate.getMonth() === (month - 1) &&
    currentDate.getDate() === day
  );
}

// Formatiert ein Datum als YYYY-MM-DD (für API-Vergleich).
function formatDateForApiComparison(year, month, day) {
  var monthWithLeadingZero = month < 10 ? "0" + month : month;
  var dayWithLeadingZero = day < 10 ? "0" + day : day;
  return year + "-" + monthWithLeadingZero + "-" + dayWithLeadingZero;
}
