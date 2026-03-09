/* =========================================================
   HISTORY.JS – Historische Ereignisse von Wikipedia laden
   Eigenes Modul, getrennt von der Kalender-Logik (script.js)
   ========================================================= */


/* =========================================================
   1) JAPAN-FILTER KEYWORDS
   ========================================================= */

// Liste von Schlüsselwörtern um Japan-bezogene Ereignisse
// aus den Wikipedia-Events rauszufiltern.
// Enthält deutsche UND englische/japanische Begriffe,
// weil Eigennamen oft gleich bleiben.
// Groß-/Kleinschreibung wird beim Vergleich ignoriert.
var japanKeywords = [
  "japan", "japanisch", "japanische", "japanischen", "japanischer",
  "tokio", "tokyo", "kyōto", "kyoto", "osaka", "nagasaki",
  "hiroshima", "hokkaido", "okinawa", "yokohama", "kobe",
  "sapporo", "nagoya", "fukushima", "nara",
  "samurai", "shogun", "shogunat", "shogunate",
  "tokugawa", "meiji", "tenno", "kaiser von japan", "kaiserreich japan",
  "nippon", "edo", "kamakura", "sengoku", "ashikaga", "muromachi",
  "heian", "fujiwara", "minamoto", "taira",
  "oda nobunaga", "toyotomi", "hideyoshi", "ieyasu", "bakufu",
  "shinto", "bushido", "daimyo", "ronin", "kabuki", "sumo",
  "tsunami", "ainu", "ryukyu"
];


/* =========================================================
   2) REQUEST-COUNTER + CACHE + DEBOUNCE-TIMER
   ========================================================= */

// Request-Counter: Wenn ich schnell hintereinander auf
// verschiedene Tage klicke, laufen mehrere API-Requests
// gleichzeitig. Der Counter sorgt dafür, dass nur das
// Ergebnis vom letzten Klick angezeigt wird.
var currentRequestId = 0;

// Cache: Bereits geladene Tage werden gespeichert.
// Wenn ich auf einen Tag klicke den ich schon mal geladen habe,
// kommt das Ergebnis sofort aus dem Speicher – kein API-Call nötig.
// Schlüssel ist "MM-DD", z.B. "03-09"
var eventsCache = {};

// Debounce-Timer: Wenn ich schnell durch Tage klicke,
// wartet die API 150ms bevor sie wirklich loslegt.
// Nur der letzte Klick löst den Request aus.
var historyDebounceTimer = null;


/* =========================================================
   3) HISTORISCHE EREIGNISSE VON DER WIKIPEDIA API LADEN
   ========================================================= */

// Ich nutze die Wikipedia REST API (de.wikipedia.org) um
// historische Ereignisse für einen bestimmten Tag zu holen.
// Die API liefert die Texte direkt auf Deutsch.
// Zuerst filtere ich nach Japan-bezogenen Events.
// Wenn es keine gibt, zeige ich die 5 interessantesten
// globalen Ereignisse an, damit das Kalenderblatt nicht leer bleibt.
function loadHistoricalEvents(optionalMonth, optionalDay) {
  var today = new Date();
  var targetMonth = optionalMonth || (today.getMonth() + 1);
  var targetDay = optionalDay || today.getDate();

  // Monat und Tag mit führender Null formatieren (API erwartet MM/DD)
  var mm = targetMonth < 10 ? "0" + targetMonth : "" + targetMonth;
  var dd = targetDay < 10 ? "0" + targetDay : "" + targetDay;
  var cacheKey = mm + "-" + dd;

  // Cache-Treffer → sofort anzeigen, kein API-Call nötig
  if (eventsCache[cacheKey]) {
    renderHistoryEvents(eventsCache[cacheKey]);
    return;
  }

  // Kein Cache → neuen Request starten
  currentRequestId++;
  var thisRequestId = currentRequestId;

  // Ladekreis + pulsierende Punkte sofort anzeigen
  showLoadingIndicator();

  var apiUrl = "https://de.wikipedia.org/api/rest_v1/feed/onthisday/events/" + mm + "/" + dd;

  fetch(apiUrl)
    .then(function(response) {
      if (!response.ok) {
        throw new Error("API Status-Code: " + response.status);
      }
      return response.json();
    })
    .then(function(data) {
      // Wenn inzwischen ein neuerer Request gestartet wurde,
      // verwerfe ich dieses Ergebnis
      if (thisRequestId !== currentRequestId) return;

      // API gibt { events: [...] } oder direkt ein Array zurück
      var allEvents;
      if (Array.isArray(data)) {
        allEvents = data;
      } else if (data.events) {
        allEvents = data.events;
      } else {
        allEvents = [];
      }

      if (allEvents.length === 0) {
        var noResults = [{
          year: "",
          text: "Keine historischen Ereignisse für diesen Tag verzeichnet."
        }];
        eventsCache[cacheKey] = noResults;
        renderHistoryEvents(noResults);
        return;
      }

      // Events in mein einheitliches Format bringen
      var cleanEvents = convertToCleanEvents(allEvents);

      // Zuerst nach Japan-bezogenen Ereignissen filtern
      var japanEvents = filterJapanEvents(cleanEvents);

      var selected;
      if (japanEvents.length > 0) {
        var shuffled = shuffleArray(japanEvents);
        selected = shuffled.slice(0, 5);
      } else {
        // Keine Japan-Events an diesem Tag →
        // 5 zufällige globale Events zeigen damit es nicht leer bleibt
        var shuffled = shuffleArray(cleanEvents);
        selected = shuffled.slice(0, 5);
      }

      // Im Cache speichern für spätere Klicks
      eventsCache[cacheKey] = selected;
      renderHistoryEvents(selected);
    })
    .catch(function(error) {
      if (thisRequestId !== currentRequestId) return;
      console.log("Wikipedia API konnte nicht geladen werden:", error);
      renderHistoryEvents([{
        year: "",
        text: "Ereignisse konnten nicht geladen werden."
      }]);
    });
}


/* =========================================================
   4) LADEANIMATION ANZEIGEN (SPINNER + PUNKTE)
   ========================================================= */

// Zeigt einen drehenden Kreis und pulsierende Punkte
// während die API-Daten geladen werden.
// Die Animation ist rein CSS-basiert (in info-box.css).
function showLoadingIndicator() {
  var container = document.getElementById("history-events-list");
  if (!container) return;

  container.innerHTML =
    "<li class='history-loader'>" +
    "<div class='history-loader__spinner'></div>" +
    "<div class='history-loader__text'>Lade Ereignisse" +
    "<span class='history-loader__dots'>" +
    "<span>.</span><span>.</span><span>.</span>" +
    "</span></div>" +
    "</li>";
}


/* =========================================================
   5) JAPAN-FILTER
   ========================================================= */

// Durchsucht alle Events nach Japan-Keywords.
// Prüft den Text auf Schlüsselwörter wie "Japan", "Tokio" usw.
// Gibt nur die Events zurück die einen Japan-Bezug haben.
function filterJapanEvents(cleanEvents) {
  var filtered = [];

  for (var i = 0; i < cleanEvents.length; i++) {
    var eventText = cleanEvents[i].text.toLowerCase();

    for (var k = 0; k < japanKeywords.length; k++) {
      if (eventText.indexOf(japanKeywords[k]) !== -1) {
        filtered.push(cleanEvents[i]);
        break;
      }
    }
  }

  return filtered;
}


/* =========================================================
   6) EVENTS IN EINHEITLICHES FORMAT BRINGEN
   ========================================================= */

// Die Wikipedia API gibt { text, year, pages } zurück.
// Ich brauche nur { year, text } für mein Rendering.
function convertToCleanEvents(allEvents) {
  var clean = [];

  for (var i = 0; i < allEvents.length; i++) {
    clean.push({
      year: allEvents[i].year || "",
      text: allEvents[i].text || ""
    });
  }

  return clean;
}


/* =========================================================
   7) ÜBERSCHRIFT FÜR DEN EREIGNIS-BEREICH SETZEN
   ========================================================= */

// Die Überschrift zeigt das Datum an,
// z.B. "Historische Ereignisse am 9. März"
function updateHistoryTitle(optionalMonth, optionalDay) {
  var titleElement = document.getElementById("history-title");
  if (!titleElement) return;

  var monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  var today = new Date();
  var dayNumber = optionalDay || today.getDate();
  var monthIndex = optionalMonth ? (optionalMonth - 1) : today.getMonth();
  var monthName = monthNames[monthIndex];

  titleElement.textContent = "Historische Ereignisse am " + dayNumber + ". " + monthName;
}


/* =========================================================
   8) EREIGNISSE IM HTML RENDERN
   ========================================================= */

// Baut die <li>-Elemente mit den Ereignissen zusammen.
// Jahr wird fett angezeigt, danach der Text.
function renderHistoryEvents(eventsArray) {
  var historyContainer = document.getElementById("history-events-list");
  if (!historyContainer) return;

  var htmlString = "";
  for (var i = 0; i < eventsArray.length; i++) {
    var eventItem = eventsArray[i];
    if (eventItem.year) {
      htmlString += "<li><strong>" + eventItem.year + ":</strong> " + eventItem.text + "</li>";
    } else {
      htmlString += "<li>" + eventItem.text + "</li>";
    }
  }

  historyContainer.innerHTML = htmlString;
}


/* =========================================================
   9) ARRAY ZUFÄLLIG MISCHEN (FISHER-YATES)
   ========================================================= */

// Damit nicht immer die gleichen 5 Ereignisse kommen,
// mische ich das Array zufällig durch.
// Fisher-Yates ist der Standard-Algorithmus dafür.
function shuffleArray(array) {
  var shuffled = array.slice();

  for (var i = shuffled.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }

  return shuffled;
}
