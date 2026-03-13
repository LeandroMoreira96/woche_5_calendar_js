/* Wikipedia-Events laden */

/* JAPAN-FILTER KEYWORDS */
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


/* REQUEST-COUNTER + CACHE + DEBOUNCE */
// letzter Klick zählt
var currentRequestId = 0;
// Cache MM-DD
var eventsCache = {};
// Debounce 150ms
var historyDebounceTimer = null;

/* WIKIPEDIA API LADEN */
// Events holen, Japan-Filter, sonst 5 globale
function loadHistoricalEvents(optionalMonth, optionalDay) {
  var today = new Date();
  var targetMonth = optionalMonth || (today.getMonth() + 1);
  var targetDay = optionalDay || today.getDate();

  // MM-DD
  var mm = targetMonth < 10 ? "0" + targetMonth : "" + targetMonth;
  var dd = targetDay < 10 ? "0" + targetDay : "" + targetDay;
  var cacheKey = mm + "-" + dd;

  // Cache
  if (eventsCache[cacheKey]) {
    renderHistoryEvents(eventsCache[cacheKey]);
    return;
  }

  currentRequestId++;
  var thisRequestId = currentRequestId;

  // Spinner
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
      // veraltet
      if (thisRequestId !== currentRequestId) return;

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

      var cleanEvents = convertToCleanEvents(allEvents);

      var japanEvents = filterJapanEvents(cleanEvents);

      var selected;
      if (japanEvents.length > 0) {
        var shuffled = shuffleArray(japanEvents);
        selected = shuffled.slice(0, 5);
      } else {
        // Fallback
        var shuffled = shuffleArray(cleanEvents);
        selected = shuffled.slice(0, 5);
      }

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


/* LADEANIMATION (SPINNER + PUNKTE) */
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


/* JAPAN-FILTER */
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


/* EVENTS FORMAT */
// API → { year, text }
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


/* TITEL SETZEN */
function updateHistoryTitle(optionalMonth, optionalDay) {
  var titleElement = document.getElementById("history-title");
  if (!titleElement) return;

  var today = new Date();
  var dayNumber = optionalDay || today.getDate();
  var monthIndex = optionalMonth ? (optionalMonth - 1) : today.getMonth();
  var monthName = monthNames[monthIndex];

  titleElement.textContent = "Historische Ereignisse am " + dayNumber + ". " + monthName;
}


/* EVENTS RENDERN */
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

// shuffleArray aus utils.js
