/* =========================================================
   SIDEBAR.JS – Info-Karten für die Sidebar
   ========================================================= */

// Info-Karten mit Datumsinfos befüllen
function renderSidebarInfoCards() {
  var cardsContainer = document.getElementById("sidebar-info-cards");
  if (!cardsContainer) return;

  var weekdayNames = [
    "Sonntag", "Montag", "Dienstag", "Mittwoch",
    "Donnerstag", "Freitag", "Samstag"
  ];

  var targetDate;
  if (selectedDay) {
    targetDate = new Date(selectedDay.year, selectedDay.month - 1, selectedDay.day);
  } else {
    targetDate = new Date();
  }

  var dayNumber = targetDate.getDate();
  var monthIndex = targetDate.getMonth();
  var fullYear = targetDate.getFullYear();
  var weekdayName = weekdayNames[targetDate.getDay()];
  var monthName = monthNames[monthIndex];
  var weekdayOccurrence = Math.ceil(dayNumber / 7);
  var holidayName = getHolidayName(fullYear, monthIndex + 1, dayNumber);
  var daysInMonth = getDaysInMonth(fullYear, monthIndex + 1);

  var card1 = buildInfoCard("Datum", dayNumber + ". " + monthName + " " + fullYear);
  var card2 = buildInfoCard("Wochentag", weekdayName);
  var card3 = buildInfoCard("Im Monat", weekdayOccurrence + ". " + weekdayName + " im " + monthName);
  var card4 = buildInfoCard("Feiertag", holidayName ? holidayName : "Kein Feiertag");
  var card5 = buildInfoCard("Kalendermonat", monthName + " " + fullYear + " · " + daysInMonth + " Tage");

  cardsContainer.innerHTML = card1 + card2 + card3 + card4 + card5;
}

// HTML für eine einzelne Info-Karte
function buildInfoCard(label, value) {
  return (
    "<div class='sidebar__info-card'>" +
    "<span class='sidebar__info-card-label'>" + label + "</span>" +
    "<span class='sidebar__info-card-value'>" + value + "</span>" +
    "</div>"
  );
}
