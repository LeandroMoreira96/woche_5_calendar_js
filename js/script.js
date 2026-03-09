/* =========================================================
   1) HEUTIGES DATUM BEIM LADEN DER SEITE ERMITTELN
   ========================================================= */

// Ich hole mir einmal das aktuelle Datum vom System.
// Daraus lese ich später den aktuellen Monat und das Jahr aus.
var todayDate = new Date();

// JavaScript zählt Monate intern von 0 bis 11.
// Deshalb +1, damit January = 1, February = 2 usw.
var currentMonth = todayDate.getMonth() + 1;

// Aktuelles Jahr, z. B. 2026
var currentYear = todayDate.getFullYear();


/* =========================================================
   2) GLOBALE VARIABLEN FÜR FEIERTAGE UND ANZEIGE
   ========================================================= */

// Hier speichere ich alle Feiertage, die ich von der API lade.
var loadedHolidays = [];

// Standardmäßig steht das Bundesland auf "ALLE".
// Das bedeutet: Ich zeige nur die bundesweiten Feiertage.
var selectedState = "ALLE";

// Damit kann ich Feiertage per Button ein- und ausblenden.
var showHolidays = true;

// Welcher Tag gerade im Kalender ausgewählt ist.
// null = kein Tag aktiv ausgewählt → der heutige Tag wird gezeigt
// mit dem normalen Ensō-Kreis. Wenn ein anderer Tag angeklickt wird,
// speichere ich { year, month, day } und zeige den schwarzen Ensō.
var selectedDay = null;


/* =========================================================
   3) MONATSNAMEN FÜR ANZEIGE UND HINTERGRUNDBILDER
   ========================================================= */

// Diese Liste brauche ich für:
// - die Überschrift vom Kalender
// - den Infotext
// - die Namen der Hintergrundbilder
var monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember"
];


/* =========================================================
   4) EINSTELLUNG FÜR DEN HINTERGRUND
   ========================================================= */

// "main" = Hintergrund nur im Hauptbereich
// "fullPage" = Hintergrund für die gesamte Seite
var backgroundMode = "fullPage";


/* =========================================================
   5) FEIERTAGE VON DER API LADEN
   ========================================================= */

// Ich nutze die Nager.Date API um die deutschen Feiertage zu holen.
// Die URL baut sich aus dem aktuellen Jahr zusammen.
// Wenn die Daten da sind, speichere ich sie global
// und zeichne den Kalender neu.
function loadHolidaysFromApi() {
  var apiUrl = "https://date.nager.at/api/v3/PublicHolidays/" + currentYear + "/DE";

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(holidayData) {
      // Die Daten aus der API speichere ich global,
      // damit ich später überall darauf zugreifen kann.
      loadedHolidays = holidayData;
      renderCalendar();
    })
    .catch(function() {
      // Falls die API nicht erreichbar ist,
      // soll der Kalender trotzdem normal weiterlaufen.
      loadedHolidays = [];
      renderCalendar();
    });
}


/* =========================================================
   6) HINTERGRUND PASSEND ZUM MONAT SETZEN
   ========================================================= */

// Für jeden Monat gibt es ein eigenes Hintergrundbild
// im Ordner layout_pictures/backgrounds/.
// Die Dateinamen sind die deutschen Monatsnamen + .png
function setMonthBackground(monthNumber) {
  var imageFileName = monthNames[monthNumber - 1] + ".png";
  var imagePath = "layout_pictures/backgrounds/" + imageFileName;

  var targetElement;

  // Je nach backgroundMode setze ich das Bild
  // entweder auf den ganzen body oder nur auf den Hauptbereich.
  if (backgroundMode === "fullPage") {
    targetElement = document.body;
  } else {
    targetElement = document.getElementById("main-area");
  }

  if (targetElement) {
    targetElement.style.backgroundImage = "url('" + imagePath + "')";
    targetElement.style.backgroundSize = "cover";
    targetElement.style.backgroundPosition = "center";
    targetElement.style.backgroundRepeat = "no-repeat";
    targetElement.style.backgroundAttachment = "fixed";
  }
}


/* =========================================================
   7) HILFSFUNKTIONEN FÜR DATUM UND KALENDER
   ========================================================= */

// Gibt zurück, wie viele Tage ein Monat hat.
// Der Trick: new Date(year, month, 0) gibt den letzten Tag
// vom Vormonat zurück. Wenn ich month direkt übergebe (1-12),
// bekomme ich den letzten Tag von genau diesem Monat.
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// Ermittelt, auf welchen Wochentag der 1. des Monats fällt.
// JavaScript gibt getDay() als 0=Sonntag bis 6=Samstag zurück.
// Ich brauche aber Monday = 0 bis Sunday = 6 für meinen Kalender,
// weil die Woche bei mir am Montag anfängt.
function getFirstWeekdayOfMonth(year, month) {
  var firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  // Sonntag (0) muss ans Ende (6)
  if (firstDayOfMonth === 0) {
    return 6;
  }

  // Alle anderen um 1 nach unten schieben: Mo=0, Di=1 usw.
  return firstDayOfMonth - 1;
}

// Prüft, ob ein bestimmter Tag heute ist.
// Brauche ich um die .today CSS-Klasse zu setzen.
function isToday(year, month, day) {
  var currentDate = new Date();

  return (
    currentDate.getFullYear() === year &&
    currentDate.getMonth() === (month - 1) &&
    currentDate.getDate() === day
  );
}

// Formatiert ein Datum in das Format YYYY-MM-DD.
// Das brauche ich für den Vergleich mit den API-Daten,
// weil die Nager.Date API das Datum so zurückgibt.
function formatDateForApiComparison(year, month, day) {
  var monthWithLeadingZero = month < 10 ? "0" + month : month;
  var dayWithLeadingZero = day < 10 ? "0" + day : day;

  return year + "-" + monthWithLeadingZero + "-" + dayWithLeadingZero;
}


/* =========================================================
   8) FEIERTAG FÜR EIN DATUM SUCHEN
   ========================================================= */

// Hier prüfe ich, ob ein bestimmtes Datum ein Feiertag ist.
// Ich gehe die komplette Feiertagsliste durch und vergleiche
// das Datum mit dem API-Format. Wenn ja, gebe ich den
// deutschen Namen zurück. Wenn nein, null.
function getHolidayName(year, month, day) {
  var targetDate = formatDateForApiComparison(year, month, day);

  for (var index = 0; index < loadedHolidays.length; index++) {
    // Hier hole ich mir den aktuell geprüften Feiertags-Eintrag
    // aus der geladenen Feiertagsliste.
    var currentHolidayEntry = loadedHolidays[index];

    if (currentHolidayEntry.date === targetDate) {
      // Wenn "ALLE" gewählt ist, zeige ich nur bundesweite Feiertage.
      // Bundesweit = counties ist null in der API.
      if (selectedState === "ALLE") {
        if (currentHolidayEntry.counties === null) {
          return currentHolidayEntry.localName;
        }
      } else {
        // Wenn ein Bundesland gewählt wurde, zeige ich:
        // - bundesweite Feiertage (counties === null)
        // - und Feiertage, die für dieses Bundesland gelten
        //   (Bundesland-Code muss im counties-Array stehen)
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


/* =========================================================
   9) ALLE FEIERTAGE EINES MONATS FÜR DIE LISTE SAMMELN
   ========================================================= */

// Hier sammle ich alle Feiertage im aktuellen Monat
// und gebe sie als fertig formatierte Strings zurück.
// Die werden dann unter dem Kalender angezeigt.
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


/* =========================================================
   10) KALENDER HTML ZUSAMMENBAUEN
   ========================================================= */

// Die Funktion baut das komplette Kalender-HTML als String.
// withNavigation = true  → mit Pfeilen (für den Main-Kalender)
// withNavigation = false → ohne Pfeile (für die Sidebar)
function generateCalendarHtml(withNavigation) {
  var totalDays = getDaysInMonth(currentYear, currentMonth);
  var startDay = getFirstWeekdayOfMonth(currentYear, currentMonth);

  // Header-Zeile: entweder mit Navigationspfeilen oder nur Monatsname
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

  // Wochentag-Zeile anfügen
  var html = headerHtml;
  html += "<tr><th>Mo</th><th>Di</th><th>Mi</th><th>Do</th><th>Fr</th>" +
          "<th class='saturday'>Sa</th><th class='sunday'>So</th></tr>";

  var row = "";
  var dayNumber = 1;

  // Immer 42 Zellen (6 Reihen x 7 Tage)
  // So bleibt die Tabelle jeden Monat gleich groß
  for (var cellIndex = 0; cellIndex < 42; cellIndex++) {
    var isSaturday = (cellIndex % 7 === 5);
    var isSunday = (cellIndex % 7 === 6);

    if (cellIndex < startDay) {
      // Leere Felder vor dem 1. des Monats
      var emptyCss = "empty-cell";
      if (isSaturday) emptyCss += " saturday";
      if (isSunday) emptyCss += " sunday";
      // &nbsp; damit die leere Zelle nicht kollabiert
      row += "<td class='" + emptyCss + "'>&nbsp;</td>";

    } else if (dayNumber <= totalDays) {
      // Normaler Tag mit allen CSS-Klassen
      var classes = [];
      if (isSaturday) classes.push("saturday");
      if (isSunday) classes.push("sunday");
      // Normaler Ensō nur wenn kein anderer Tag ausgewählt ist
      if (isToday(currentYear, currentMonth, dayNumber) && !selectedDay) {
        classes.push("today");
      }

      // Schwarzer Ensō für den ausgewählten Tag
      if (selectedDay && selectedDay.year === currentYear &&
          selectedDay.month === currentMonth && selectedDay.day === dayNumber) {
        classes.push("selected");
      }

      // Feiertag markieren, aber nur wenn der Button auf "an" steht
      var holidayName = getHolidayName(currentYear, currentMonth, dayNumber);
      if (holidayName && showHolidays) classes.push("holiday");

      var classAttribute = "";
      if (classes.length > 0) classAttribute = " class='" + classes.join(" ") + "'";

      // title-Attribut zeigt den Feiertagsnamen wenn man
      // mit der Maus über den Tag geht (Tooltip)
      var titleAttribute = "";
      if (holidayName && showHolidays) titleAttribute = " title='" + holidayName + "'";

      // Klick-Handler nur im Main-Kalender (mit Navigation)
      var onclickAttribute = "";
      if (withNavigation) {
        onclickAttribute = " onclick='selectDay(" + dayNumber + ")'";
      }

      row += "<td" + classAttribute + titleAttribute + onclickAttribute + ">" + dayNumber + "</td>";
      dayNumber++;

    } else {
      // Leere Felder nach dem letzten Tag des Monats
      var emptyCss = "empty-cell";
      if (isSaturday) emptyCss += " saturday";
      if (isSunday) emptyCss += " sunday";
      row += "<td class='" + emptyCss + "'>&nbsp;</td>";
    }

    // Nach 7 Zellen die Zeile abschließen und neue anfangen
    if ((cellIndex + 1) % 7 === 0) {
      html += "<tr>" + row + "</tr>";
      row = "";
    }
  }

  return html;
}


/* =========================================================
   11) INFO-TEXT FÜR DEN HAUPTBEREICH ERZEUGEN
   ========================================================= */

// Der Infotext beschreibt das heutige Datum ausführlich:
// welcher Wochentag, der wievielte im Monat, ob Feiertag.
// Das ist der Text aus der Aufgabenstellung.
function generateInfoText() {
  var weekdayNames = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag"
  ];

  // Wenn ein Tag ausgewählt ist, zeige ich Info für diesen Tag.
  // Sonst zeige ich Info zum heutigen Tag.
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

  // Datum ausgeschrieben, z.B. "9. März 2026"
  var fullDateText = targetDayNumber + ". " + targetMonthName + " " + targetFullYear;

  // Der wievielte Wochentag im Monat?
  // z.B. der 2. Montag → Math.ceil(9 / 7) = 2
  var weekdayOccurrenceInMonth = Math.ceil(targetDayNumber / 7) + ".";

  // Prüfen ob der Tag ein Feiertag ist
  var targetHolidayName = getHolidayName(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    targetDate.getDate()
  );

  var holidayText = targetHolidayName ? "ein" : "kein";

  // Unterschiedlicher Satz je nachdem ob heute oder ausgewählter Tag
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


/* =========================================================
   12) SIDEBAR INFO-KARTEN BEFÜLLEN
   ========================================================= */

// Statt dem Mini-Kalender zeigt die Sidebar jetzt Info-Karten.
// Jede Karte hat info_field.png als Hintergrund (Bild-in-Bild).
// Die Inhalte passen sich an den ausgewählten Tag an.
function renderSidebarInfoCards() {
  var cardsContainer = document.getElementById("sidebar-info-cards");
  if (!cardsContainer) return;

  var weekdayNames = [
    "Sonntag", "Montag", "Dienstag", "Mittwoch",
    "Donnerstag", "Freitag", "Samstag"
  ];

  // Datum je nach Auswahl: ausgewählter Tag oder heute
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

  // Der wievielte Wochentag im Monat (z.B. "2. Montag")
  var weekdayOccurrence = Math.ceil(dayNumber / 7);

  // Feiertag prüfen
  var holidayName = getHolidayName(fullYear, monthIndex + 1, dayNumber);

  // Anzahl Tage im aktuellen Monat
  var daysInMonth = getDaysInMonth(fullYear, monthIndex + 1);

  // Karte 1: Datum
  var card1 = buildInfoCard("Datum", dayNumber + ". " + monthName + " " + fullYear);

  // Karte 2: Wochentag
  var card2 = buildInfoCard("Wochentag", weekdayName);

  // Karte 3: Der Wievielte im Monat
  var card3 = buildInfoCard("Im Monat", weekdayOccurrence + ". " + weekdayName + " im " + monthName);

  // Karte 4: Feiertag
  var holidayValue = holidayName ? holidayName : "Kein Feiertag";
  var card4 = buildInfoCard("Feiertag", holidayValue);

  // Karte 5: Monats-Info
  var card5 = buildInfoCard("Kalendermonat", monthName + " " + fullYear + " · " + daysInMonth + " Tage");

  cardsContainer.innerHTML = card1 + card2 + card3 + card4 + card5;
}

// Baut das HTML für eine einzelne Info-Karte zusammen.
// label = kleine Überschrift, value = der eigentliche Inhalt.
function buildInfoCard(label, value) {
  return (
    "<div class='sidebar__info-card'>" +
    "<span class='sidebar__info-card-label'>" + label + "</span>" +
    "<span class='sidebar__info-card-value'>" + value + "</span>" +
    "</div>"
  );
}


/* =========================================================
   13) KALENDER UND ALLE TEXTE KOMPLETT AKTUALISIEREN
   ========================================================= */

// Das ist die Haupt-Render-Funktion. Hier wird alles zusammengebaut:
// - Main-Kalender (mit Navigation)
// - Sidebar-Info-Karten
// - Seitentitel im Browser-Tab
// - Überschrift und Infotext
// - Feiertagsliste
// - Hintergrundbild
function renderCalendar() {
  var mainHtml = generateCalendarHtml(true);

  // Main-Kalender aktualisieren
  var mainCalendarElement = document.getElementById("calendar-area");
  if (mainCalendarElement) {
    mainCalendarElement.innerHTML =
      "<table class='calendar calendar--main'><thead>" +
      mainHtml + "</thead><tbody></tbody></table>";
  }

  // Sidebar-Info-Karten aktualisieren
  renderSidebarInfoCards();

  // Dynamischen Seitentitel setzen
  document.title = "Kalender: " + monthNames[currentMonth - 1] + " " + currentYear;

  // Überschrift und Infotext aktualisieren
  var contentTitleElement = document.getElementById("content-title");
  var contentIntroElement = document.getElementById("content-intro");

  if (contentTitleElement) {
    contentTitleElement.textContent = "Kalenderblatt " + monthNames[currentMonth - 1] + " " + currentYear;
  }

  if (contentIntroElement) {
    contentIntroElement.textContent = generateInfoText();
  }

  // Feiertagsliste für den aktuellen Monat anzeigen
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

  // Hintergrundbild passend zum Monat setzen
  setMonthBackground(currentMonth);

  // Wetter-Animation passend zum Monat starten
  switchMonthAnimation(currentMonth);
}


/* =========================================================
   14) MONATSNAVIGATION
   ========================================================= */

// Einen Monat vorwärts. Wenn ich über Dezember hinausgehe,
// springe ich auf Januar vom nächsten Jahr und lade
// die Feiertage für das neue Jahr neu von der API.
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

  // Wenn ein Tag ausgewählt war, Ereignisse zurück auf heute setzen
  if (hadSelection) {
    updateHistoryTitle();
    loadHistoricalEvents();
  }
}

// Einen Monat zurück. Wenn ich unter Januar gehe,
// springe ich auf Dezember vom Vorjahr.
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


/* =========================================================
   15) BUNDESLAND AUSWAHL ÄNDERN
   ========================================================= */

// Wenn ich ein anderes Bundesland im Dropdown auswähle,
// lese ich den neuen Wert aus und zeichne den Kalender neu.
// So werden nur die Feiertage für das gewählte Land angezeigt.
function changeStateSelection() {
  var stateSelectElement = document.getElementById("state-select");

  if (!stateSelectElement) {
    return;
  }

  selectedState = stateSelectElement.value;
  renderCalendar();
}


/* =========================================================
   16) FEIERTAGE EIN- ODER AUSBLENDEN
   ========================================================= */

// Der Button schaltet die Feiertage im Kalender an oder aus.
// showHolidays wird einfach umgedreht (true ↔ false).
// Dann aktualisiere ich den Button-Text damit man sieht
// was der nächste Klick bewirkt.
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


/* =========================================================
   17) TAG IM KALENDER AUSWÄHLEN
   ========================================================= */

// Wenn ich einen Tag anklicke, wird dieser mit dem schwarzen
// Ensō-Kreis markiert und die historischen Ereignisse
// für diesen Tag geladen. Der Infotext aktualisiert sich auch.
// Klicke ich auf den heutigen Tag, wird die Auswahl
// zurückgesetzt und der normale Ensō-Kreis erscheint wieder.
function selectDay(day) {
  if (isToday(currentYear, currentMonth, day)) {
    selectedDay = null;
  } else {
    selectedDay = { year: currentYear, month: currentMonth, day: day };
  }

  renderCalendar();

  var targetMonth = selectedDay ? selectedDay.month : (new Date().getMonth() + 1);
  var targetDay = selectedDay ? selectedDay.day : new Date().getDate();

  // Titel sofort aktualisieren (kein API-Call nötig)
  updateHistoryTitle(targetMonth, targetDay);

  // Debounce: 150ms warten bevor der API-Call losgeht.
  // Wenn ich schnell durch Tage klicke, wird nur der
  // letzte Klick tatsächlich einen Request auslösen.
  clearTimeout(historyDebounceTimer);
  historyDebounceTimer = setTimeout(function() {
    loadHistoricalEvents(targetMonth, targetDay);
  }, 150);
}


/* =========================================================
   18) ZUM HEUTIGEN DATUM SPRINGEN
   ========================================================= */

// Setzt Monat und Jahr zurück auf das aktuelle Datum.
// Außerdem wird die Tages-Auswahl aufgehoben, damit
// wieder der normale Ensō-Kreis auf heute erscheint.
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


/* =========================================================
   19) START DER SEITE
   ========================================================= */

// Wenn die Seite fertig geladen ist, hole ich als erstes
// die Feiertage von der API. In der Callback-Funktion
// wird dann automatisch renderCalendar() aufgerufen,
// und der Kalender erscheint.
// Außerdem lade ich die historischen Ereignisse
// aus der history.js (Wikidata API).
window.onload = function() {
  loadHolidaysFromApi();
  updateHistoryTitle();
  loadHistoricalEvents();
};
