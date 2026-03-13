/* Hintergründe & Rollenbilder */

// Kalender-Rolle passend zum Monat
function setCalendarRollBackground(monthNumber) {
  var rollenPath = "layout_pictures/roll/" + rollenFileNames[monthNumber - 1];
  var fallbackPath = "layout_pictures/kalender-style.png";
  var wrapElement = document.getElementById("calendar-roll-area");

  if (!wrapElement) return;

  var img = new Image();
  img.onload = function() {
    wrapElement.style.backgroundImage = "url('" + rollenPath + "')";
  };
  img.onerror = function() {
    wrapElement.style.backgroundImage = "url('" + fallbackPath + "')";
  };
  img.src = rollenPath;
}

// Hintergrundbild passend zum Monat
function setMonthBackground(monthNumber) {
  var imageFileName = monthNames[monthNumber - 1] + ".png";
  var imagePath = "layout_pictures/backgrounds/" + imageFileName;

  var targetElement;
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
