/* Kalender Hauptlogik */

/* KALENDERZUSTAND */
var todayDate = new Date();
var currentMonth = todayDate.getMonth() + 1;
var currentYear = todayDate.getFullYear();

// Feiertage anzeigen (per Button umschaltbar)
var showHolidays = true;

// null = heute
var selectedDay = null;

/* KALENDER HTML GENERIEREN */
function generateCalendarHtml(withNavigation) {
  var totalDays = getDaysInMonth(currentYear, currentMonth);
  var startDay = getFirstWeekdayOfMonth(currentYear, currentMonth);

  var headerHtml = "";
  if (withNavigation) {
    headerHtml = "<tr><th colspan='7' class='calendar-header-cell'>" +
      "<div class='calendar-header-flex'>" +
      "<button onclick='goToPreviousMonth()' class='calendar-nav-button'>◀</button>" +
      "<span class='month-header'>" + monthNames[currentMonth - 1] + " " + currentYear + "</span>" +
      "<button onclick='goToNextMonth()' class='calendar-nav-button'>▶</button>" +
      "</div></th></tr>";
  } else {
    headerHtml = "<tr><th colspan='7'>" + monthNames[currentMonth - 1] + " " + currentYear + "</th></tr>";
  }

  var html = headerHtml;
  html += "<tr><th>Mo</th><th>Di</th><th>Mi</th><th>Do</th><th>Fr</th>" +
          "<th class='saturday'>Sa</th><th class='sunday'>So</th></tr>";

  var row = "";
  var dayNumber = 1;

  for (var cellIndex = 0; cellIndex < 42; cellIndex++) {
    var isSaturday = (cellIndex % 7 === 5);
    var isSunday = (cellIndex % 7 === 6);

    if (cellIndex < startDay) {
      var emptyCss = "empty-cell";
      if (isSaturday) emptyCss += " saturday";
      if (isSunday) emptyCss += " sunday";
      row += "<td class='" + emptyCss + "'>&nbsp;</td>";
    } else if (dayNumber <= totalDays) {
      var classes = [];
      if (isSaturday) classes.push("saturday");
      if (isSunday) classes.push("sunday");
      if (isToday(currentYear, currentMonth, dayNumber) && !selectedDay) {
        classes.push("today");
      }
      if (selectedDay && selectedDay.year === currentYear &&
          selectedDay.month === currentMonth && selectedDay.day === dayNumber) {
        classes.push("selected");
      }
      var holidayName = getHolidayName(currentYear, currentMonth, dayNumber);
      if (holidayName && showHolidays) classes.push("holiday");

      var classAttribute = classes.length > 0 ? " class='" + classes.join(" ") + "'" : "";
      var titleAttribute = (holidayName && showHolidays) ? " title='" + holidayName + "'" : "";
      var onclickAttribute = withNavigation ? " onclick='selectDay(" + dayNumber + ")'" : "";

      row += "<td" + classAttribute + titleAttribute + onclickAttribute + ">" + dayNumber + "</td>";
      dayNumber++;
    } else {
      var emptyCss = "empty-cell";
      if (isSaturday) emptyCss += " saturday";
      if (isSunday) emptyCss += " sunday";
      row += "<td class='" + emptyCss + "'>&nbsp;</td>";
    }

    if ((cellIndex + 1) % 7 === 0) {
      html += "<tr>" + row + "</tr>";
      row = "";
    }
  }

  return html;
}

/* INFO-TEXT FÜR HAUPTBEREICH */
function generateInfoText() {
  var weekdayNames = [
    "Sonntag", "Montag", "Dienstag", "Mittwoch",
    "Donnerstag", "Freitag", "Samstag"
  ];

  var targetDate;
  var isSelected = false;

  if (selectedDay) {
    targetDate = new Date(selectedDay.year, selectedDay.month - 1, selectedDay.day);
    isSelected = true;
  } else {
    targetDate = new Date();
  }

  var targetWeekdayName = weekdayNames[targetDate.getDay()];
  var targetMonthName = monthNames[targetDate.getMonth()];
  var targetDayNumber = targetDate.getDate();
  var targetFullYear = targetDate.getFullYear();
  var fullDateText = targetDayNumber + ". " + targetMonthName + " " + targetFullYear;
  var weekdayOccurrenceInMonth = Math.ceil(targetDayNumber / 7) + ".";

  var targetHolidayName = getHolidayName(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    targetDate.getDate()
  );
  var holidayText = targetHolidayName ? "ein" : "kein";

  var holidaySentence;
  if (isSelected) {
    holidaySentence = "Am " + targetDayNumber + ". " + targetMonthName +
      " ist " + holidayText + " gesetzlicher Feiertag.";
  } else {
    holidaySentence = "Heute ist " + holidayText + " gesetzlicher Feiertag.";
  }

  return (
    "Der " + fullDateText +
    " ist ein " + targetWeekdayName +
    " und zwar der " + weekdayOccurrenceInMonth + " " + targetWeekdayName +
    " im Monat " + targetMonthName +
    " des Jahres " + targetFullYear +
    ". " + holidaySentence
  );
}

/* HAUPT-RENDER */
function renderCalendar() {
  var mainHtml = generateCalendarHtml(true);

  var mainCalendarElement = document.getElementById("calendar-area");
  if (mainCalendarElement) {
    mainCalendarElement.innerHTML =
      "<table class='calendar calendar--main'><thead>" +
      mainHtml + "</thead><tbody></tbody></table>";
  }

  renderSidebarInfoCards();

  document.title = "Kalender: " + monthNames[currentMonth - 1] + " " + currentYear;

  var contentTitleElement = document.getElementById("content-title");
  var contentIntroElement = document.getElementById("content-intro");

  if (contentTitleElement) {
    contentTitleElement.textContent = "Kalenderblatt " + monthNames[currentMonth - 1] + " " + currentYear;
  }
  if (contentIntroElement) {
    contentIntroElement.textContent = generateInfoText();
  }

  var holidayListElement = document.getElementById("holiday-list");
  if (holidayListElement) {
    var holidaysInCurrentMonth = collectHolidaysInMonth(currentYear, currentMonth);
    if (holidaysInCurrentMonth.length === 0) {
      holidayListElement.innerHTML =
        "<em>Keine Feiertage in " + monthNames[currentMonth - 1] + " " + currentYear + "</em>";
    } else {
      var listHtml = "";
      for (var index = 0; index < holidaysInCurrentMonth.length; index++) {
        listHtml += holidaysInCurrentMonth[index] + "<br>";
      }
      holidayListElement.innerHTML = listHtml;
    }
  }

  setMonthBackground(currentMonth);
  setCalendarRollBackground(currentMonth);
  switchMonthAnimation(currentMonth);
}

/* MONATSNAVIGATION */
function goToNextMonth() {
  var hadSelection = (selectedDay !== null);
  selectedDay = null;
  currentMonth++;

  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
    loadHolidaysFromApi();
  } else {
    renderCalendar();
  }

  if (hadSelection) {
    updateHistoryTitle();
    loadHistoricalEvents();
  }
}

function goToPreviousMonth() {
  var hadSelection = (selectedDay !== null);
  selectedDay = null;
  currentMonth--;

  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
    loadHolidaysFromApi();
  } else {
    renderCalendar();
  }

  if (hadSelection) {
    updateHistoryTitle();
    loadHistoricalEvents();
  }
}

/* BUNDESLAND & FEIERTAGE TOGGLE */
function changeStateSelection() {
  var stateSelectElement = document.getElementById("state-select");
  if (!stateSelectElement) return;

  selectedState = stateSelectElement.value;
  renderCalendar();
}

function toggleHolidays() {
  showHolidays = !showHolidays;

  var holidayButtonElement = document.getElementById("holiday-button");
  if (holidayButtonElement) {
    holidayButtonElement.textContent = showHolidays
      ? "Feiertage ausblenden"
      : "Feiertage einblenden";
  }

  renderCalendar();
}

/* TAG AUSWÄHLEN & HEUTE */
function selectDay(day) {
  if (isToday(currentYear, currentMonth, day)) {
    selectedDay = null;
  } else {
    selectedDay = { year: currentYear, month: currentMonth, day: day };
  }

  renderCalendar();

  var targetMonth = selectedDay ? selectedDay.month : (new Date().getMonth() + 1);
  var targetDay = selectedDay ? selectedDay.day : new Date().getDate();

  updateHistoryTitle(targetMonth, targetDay);

  clearTimeout(historyDebounceTimer);
  historyDebounceTimer = setTimeout(function() {
    loadHistoricalEvents(targetMonth, targetDay);
  }, 150);
}

function goToToday() {
  var now = new Date();
  var todayMonth = now.getMonth() + 1;
  var todayYear = now.getFullYear();

  var yearChanged = (currentYear !== todayYear);
  var alreadyThere = (currentMonth === todayMonth && currentYear === todayYear && !selectedDay);

  selectedDay = null;
  currentMonth = todayMonth;
  currentYear = todayYear;

  if (alreadyThere) return;

  if (yearChanged) {
    loadHolidaysFromApi();
  } else {
    renderCalendar();
  }

  updateHistoryTitle();
  loadHistoricalEvents();
}

/* START */
window.onload = function() {
  loadHolidaysFromApi();
  updateHistoryTitle();
  loadHistoricalEvents();
};
