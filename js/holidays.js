/* Feiertage Nager.Date API */

var loadedHolidays = [];
var selectedState = "ALLE";

// Feiertage von Nager.Date API laden
function loadHolidaysFromApi() {
  var apiUrl = "https://date.nager.at/api/v3/PublicHolidays/" + currentYear + "/DE";

  fetch(apiUrl)
    .then(function(response) { return response.json(); })
    .then(function(holidayData) {
      loadedHolidays = holidayData;
      renderCalendar();
    })
    .catch(function() {
      loadedHolidays = [];
      renderCalendar();
    });
}

// Feiertagsname für Datum
function getHolidayName(year, month, day) {
  var targetDate = formatDateForApiComparison(year, month, day);

  for (var index = 0; index < loadedHolidays.length; index++) {
    var currentHolidayEntry = loadedHolidays[index];

    if (currentHolidayEntry.date === targetDate) {
      if (selectedState === "ALLE") {
        if (currentHolidayEntry.counties === null) {
          return currentHolidayEntry.localName;
        }
      } else {
        var isNationwideHoliday = currentHolidayEntry.counties === null;
        var isHolidayForSelectedState =
          currentHolidayEntry.counties &&
          currentHolidayEntry.counties.indexOf(selectedState) !== -1;

        if (isNationwideHoliday || isHolidayForSelectedState) {
          return currentHolidayEntry.localName;
        }
      }
    }
  }

  return null;
}

// Alle Feiertage eines Monats sammeln
function collectHolidaysInMonth(year, month) {
  var holidaysInMonth = [];
  var numberOfDaysInMonth = getDaysInMonth(year, month);

  for (var day = 1; day <= numberOfDaysInMonth; day++) {
    var holidayName = getHolidayName(year, month, day);
    if (holidayName) {
      holidaysInMonth.push(day + ". " + monthNames[month - 1] + " – " + holidayName);
    }
  }

  return holidaysInMonth;
}
