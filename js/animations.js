/* =========================================================
   ANIMATIONS.JS – Monats-Animationen als Overlay
   Jeder Monat bekommt eine passende Wetter-/Partikel-Animation.
   Alles Vanilla JS + Canvas, keine externen Libraries.
   ========================================================= */


/* =========================================================
   1) GLOBALE VARIABLEN
   ========================================================= */

// Canvas-Overlay und Context für alle Partikel-Animationen
var animCanvas = null;
var animCtx = null;

// Aktueller Animation-Frame und Monat (damit ich nicht
// bei jedem renderCalendar() die Animation neu starte)
var animFrameId = null;
var animCurrentMonth = 0;
var animParticles = [];

// Fog-Overlay (eigener Container, CSS-basiert)
var animFogContainer = null;

// Zuordnung: Monatsnummer → Animations-Funktion
// Monate ohne eigene Animation (5, 6, 8) bleiben leer
var monthAnimationMap = {
  1:  startSnowAnimation,
  2:  startFebruaryFogAnimation,
  3:  startMarchBlossomAnimation,
  4:  startAprilBlossomAnimation,
  5:  startMayBreezeAnimation,
  6:  startJuneCloudAnimation,
  7:  startEmberAnimation,
  8:  startAugustHazeAnimation,
  9:  startLeavesAnimation,
  10: startThunderstormAnimation,
  11: startNovemberFogAnimation,
  12: startHeavySnowAnimation
};


/* =========================================================
   2) OVERLAY INITIALISIEREN
   ========================================================= */

// Erstellt den Canvas-Layer über dem gesamten Bildschirm.
// pointer-events: none damit man noch alles anklicken kann.
// Wird einmal beim ersten Aufruf erzeugt.
function initAnimationOverlay() {
  if (animCanvas) return;

  animCanvas = document.createElement("canvas");
  animCanvas.id = "animation-canvas";
  animCanvas.style.cssText =
    "position:fixed; top:0; left:0; width:100%; height:100%;" +
    "z-index:5; pointer-events:none;";

  document.body.appendChild(animCanvas);
  animCtx = animCanvas.getContext("2d");

  resizeAnimCanvas();
  window.addEventListener("resize", resizeAnimCanvas);
}

function resizeAnimCanvas() {
  if (!animCanvas) return;
  animCanvas.width = window.innerWidth;
  animCanvas.height = window.innerHeight;
}


/* =========================================================
   3) ANIMATION WECHSELN (WIRD VON SCRIPT.JS AUFGERUFEN)
   ========================================================= */

// Prüft ob sich der Monat geändert hat.
// Wenn ja: alte Animation stoppen, neue starten.
// Wenn nein: nichts tun (Performance).
function switchMonthAnimation(monthNumber) {
  if (monthNumber === animCurrentMonth) return;
  animCurrentMonth = monthNumber;

  initAnimationOverlay();
  stopCurrentAnimation();

  var startFn = monthAnimationMap[monthNumber];
  if (startFn) {
    startFn();
  }
}


/* =========================================================
   4) AKTUELLE ANIMATION STOPPEN
   ========================================================= */

function stopCurrentAnimation() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  animParticles = [];

  if (animCtx && animCanvas) {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);
    animCanvas.style.zIndex = "5";
  }

  // Fog-Container entfernen falls vorhanden
  if (animFogContainer && animFogContainer.parentNode) {
    animFogContainer.parentNode.removeChild(animFogContainer);
    animFogContainer = null;
  }
}


/* =========================================================
   5) SCHNEE-ANIMATION (JANUAR)
   ========================================================= */

// Leichter Schneefall: weiße Kreise die sanft runterfallen
// mit leichtem Wind-Effekt.
function startSnowAnimation() {
  var count = 120;
  var w = animCanvas.width;
  var h = animCanvas.height;

  for (var i = 0; i < count; i++) {
    animParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      wind: -0.3 + Math.random() * 0.6,
      opacity: 0.3 + Math.random() * 0.7
    });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      animCtx.beginPath();
      animCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      animCtx.fillStyle = "rgba(255,255,255," + p.opacity + ")";
      animCtx.fill();

      p.y += p.speed;
      p.x += p.wind;

      if (p.y > animCanvas.height + p.r) {
        p.y = -p.r;
        p.x = Math.random() * animCanvas.width;
      }
      if (p.x > animCanvas.width) p.x = 0;
      if (p.x < 0) p.x = animCanvas.width;
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   6) STARKER SCHNEEFALL (DEZEMBER)
   ========================================================= */

// Dichter, schneller Schneefall – mehr Partikel,
// höhere Geschwindigkeit, stärkerer Wind.
function startHeavySnowAnimation() {
  var count = 250;
  var w = animCanvas.width;
  var h = animCanvas.height;

  for (var i = 0; i < count; i++) {
    animParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 3.5,
      speed: 1.5 + Math.random() * 3,
      wind: -0.5 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7
    });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      animCtx.beginPath();
      animCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      animCtx.fillStyle = "rgba(255,255,255," + p.opacity + ")";
      animCtx.fill();

      p.y += p.speed;
      p.x += p.wind;

      if (p.y > animCanvas.height + p.r) {
        p.y = -p.r;
        p.x = Math.random() * animCanvas.width;
      }
      if (p.x > animCanvas.width) p.x = 0;
      if (p.x < 0) p.x = animCanvas.width;
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   7a) FEBRUAR – FEINER WINTERNEBEL
   ========================================================= */

// Februar: frostiger Dunst in der unteren Bildschirmhälfte.
// Bläulich-weiß, dicker als vorher aber feiner als November.
function startFebruaryFogAnimation() {
  var w = animCanvas.width;
  var h = animCanvas.height;

  var layers = [
    { count: 6, rMin: 450, rMax: 800, sMin: 0.6, sMax: 1.2, oMin: 0.30, oMax: 0.50 },
    { count: 8, rMin: 300, rMax: 550, sMin: 0.8, sMax: 1.5, oMin: 0.25, oMax: 0.40 }
  ];

  for (var l = 0; l < layers.length; l++) {
    var cfg = layers[l];
    for (var i = 0; i < cfg.count; i++) {
      animParticles.push({
        x: Math.random() * w * 2 - w * 0.5,
        y: h * 0.4 + Math.random() * h * 0.7,
        radius: cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin),
        speed: cfg.sMin + Math.random() * (cfg.sMax - cfg.sMin),
        opacity: cfg.oMin + Math.random() * (cfg.oMax - cfg.oMin),
        drift: -0.05 + Math.random() * 0.1
      });
    }
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      var gradient = animCtx.createRadialGradient(
        p.x, p.y, p.radius * 0.15,
        p.x, p.y, p.radius
      );
      gradient.addColorStop(0, "rgba(210,220,240," + p.opacity + ")");
      gradient.addColorStop(0.4, "rgba(195,205,230," + p.opacity * 0.65 + ")");
      gradient.addColorStop(1, "rgba(160,180,210,0)");

      animCtx.beginPath();
      animCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      animCtx.fillStyle = gradient;
      animCtx.fill();

      p.x += p.speed;
      p.y += p.drift;

      if (p.x - p.radius > animCanvas.width) {
        p.x = -p.radius;
        p.y = animCanvas.height * 0.4 + Math.random() * animCanvas.height * 0.7;
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   7b) NOVEMBER – DICHTER BODENNEBEL
   ========================================================= */

// November: schwerer, grauer Bodennebel. Dicker als Februar,
// konzentriert in der unteren Hälfte. Warm-grau, stumpf,
// melancholisch. Deutlich sichtbar.
function startNovemberFogAnimation() {
  var w = animCanvas.width;
  var h = animCanvas.height;

  var layers = [
    { count: 5, rMin: 500, rMax: 800, sMin: 0.3, sMax: 0.6, oMin: 0.25, oMax: 0.40 },
    { count: 7, rMin: 300, rMax: 600, sMin: 0.5, sMax: 0.9, oMin: 0.20, oMax: 0.35 }
  ];

  for (var l = 0; l < layers.length; l++) {
    var cfg = layers[l];
    for (var i = 0; i < cfg.count; i++) {
      animParticles.push({
        x: Math.random() * w * 2 - w * 0.5,
        y: h * 0.35 + Math.random() * h * 0.75,
        radius: cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin),
        speed: cfg.sMin + Math.random() * (cfg.sMax - cfg.sMin),
        opacity: cfg.oMin + Math.random() * (cfg.oMax - cfg.oMin),
        drift: -0.05 + Math.random() * 0.1
      });
    }
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      var gradient = animCtx.createRadialGradient(
        p.x, p.y, p.radius * 0.15,
        p.x, p.y, p.radius
      );
      gradient.addColorStop(0, "rgba(200,195,185," + p.opacity + ")");
      gradient.addColorStop(0.4, "rgba(180,175,165," + p.opacity * 0.6 + ")");
      gradient.addColorStop(1, "rgba(150,145,135,0)");

      animCtx.beginPath();
      animCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      animCtx.fillStyle = gradient;
      animCtx.fill();

      p.x += p.speed;
      p.y += p.drift;

      if (p.x - p.radius > animCanvas.width) {
        p.x = -p.radius;
        p.y = animCanvas.height * 0.35 + Math.random() * animCanvas.height * 0.75;
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   8) KIRSCHBLÜTEN – BILDER LADEN (LOKAL)
   ========================================================= */

// März: petal.png (zartes rosa Blütenblatt)
// April: sakura_petal.png (anderer Stil, eher Blütenflocke)
// Beide liegen lokal im Projekt statt von externen URLs.
var marchPetalImg = null;
var marchPetalLoaded = false;
var aprilPetalImg = null;
var aprilPetalLoaded = false;

function loadMarchPetal() {
  if (marchPetalImg) return;
  marchPetalImg = new Image();
  marchPetalImg.src = "layout_pictures/animation_pictures/petal.png";
  marchPetalImg.onload = function() { marchPetalLoaded = true; };
}

function loadAprilPetal() {
  if (aprilPetalImg) return;
  aprilPetalImg = new Image();
  aprilPetalImg.src = "layout_pictures/animation_pictures/sakura_petal.png";
  aprilPetalImg.onload = function() { aprilPetalLoaded = true; };
}


/* =========================================================
   8a) MÄRZ – KIRSCHBLÜTEN AUS DER ECKE RECHTS OBEN
   ========================================================= */

// Im März kommen die Blütenblätter diagonal von rechts oben
// und fliegen nach links unten – wie ein frischer Frühlingswind.
// Beim Start sind die Blätter bereits über den gesamten
// Bildschirm verteilt, damit es sofort lebendig aussieht.
function startMarchBlossomAnimation() {
  loadMarchPetal();

  var count = 80;
  var w = animCanvas.width;
  var h = animCanvas.height;

  for (var i = 0; i < count; i++) {
    // Über den gesamten Bildschirm verteilen.
    // Bewegungsrichtung: diagonal von rechts-oben nach links-unten.
    animParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      w: 25 + Math.random() * 15,
      h: 20 + Math.random() * 10,
      opacity: (25 + Math.random() * 15) / 40,
      flip: Math.random(),
      xSpeed: -(1.5 + Math.random() * 2),
      ySpeed: 1 + Math.random() * 1.5,
      flipSpeed: Math.random() * 0.03
    });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      animCtx.globalAlpha = p.opacity;

      var drawW = p.w * (0.6 + Math.abs(Math.cos(p.flip)) / 3);
      var drawH = p.h * (0.8 + Math.abs(Math.sin(p.flip)) / 5);

      if (marchPetalLoaded) {
        animCtx.drawImage(marchPetalImg, p.x, p.y, drawW, drawH);
      } else {
        animCtx.beginPath();
        animCtx.ellipse(
          p.x + drawW / 2, p.y + drawH / 2,
          drawW / 2, drawH / 2, p.flip, 0, Math.PI * 2
        );
        animCtx.fillStyle = "#ffb7c5";
        animCtx.fill();
      }

      animCtx.globalAlpha = 1;

      p.x += p.xSpeed;
      p.y += p.ySpeed;
      p.flip += p.flipSpeed;

      // Respawn: zufällig am oberen ODER rechten Rand,
      // damit Blüten über die gesamte Breite und Höhe fliegen.
      if (p.y > animCanvas.height + 50 || p.x < -50) {
        if (Math.random() < 0.5) {
          p.x = Math.random() * animCanvas.width * 1.2;
          p.y = -30 - Math.random() * 60;
        } else {
          p.x = animCanvas.width + Math.random() * 80;
          p.y = -50 + Math.random() * animCanvas.height * 0.8;
        }
        p.xSpeed = -(1.5 + Math.random() * 2);
        p.ySpeed = 1 + Math.random() * 1.5;
        p.flip = Math.random();
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   8b) APRIL – SAKURA-BLÜTEN FALLEN VON OBEN HERAB
   ========================================================= */

// Im April fallen grüne Blätter (green_leaves.png + green_leaves_2.png)
// sanft von oben herab – wie ein leichter Frühlingsregen aus Blättern.
// Beim Start sind die Blätter bereits überall verteilt.
var aprilLeafImages = [];
var aprilLeafImagesLoaded = 0;
var aprilLeafPaths = [
  "layout_pictures/animation_pictures/green_leaves.png",
  "layout_pictures/animation_pictures/green_leaves_2.png"
];

function loadAprilLeafImages() {
  if (aprilLeafImages.length > 0) return;
  for (var i = 0; i < aprilLeafPaths.length; i++) {
    var img = new Image();
    img.src = aprilLeafPaths[i];
    (function(image) {
      image.onload = function() { aprilLeafImagesLoaded++; };
    })(img);
    aprilLeafImages.push(img);
  }
}

function startAprilBlossomAnimation() {
  loadAprilLeafImages();

  var count = 35;
  var w = animCanvas.width;
  var h = animCanvas.height;

  for (var i = 0; i < count; i++) {
    var doesFlip = Math.random() < 0.4;
    animParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 35 + Math.random() * 40,
      leafIdx: Math.floor(Math.random() * aprilLeafPaths.length),
      ySpeed: 0.6 + Math.random() * 1.0,
      xDrift: -0.3 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: -0.012 + Math.random() * 0.024,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      opacity: 0.6 + Math.random() * 0.4,
      doesFlip: doesFlip,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: doesFlip ? (0.012 + Math.random() * 0.02) : 0
    });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      animCtx.save();
      animCtx.translate(p.x, p.y);
      animCtx.rotate(p.rotation);
      if (p.doesFlip) {
        animCtx.scale(Math.cos(p.flipAngle), 1);
      }
      animCtx.globalAlpha = p.opacity;

      var img = aprilLeafImages[p.leafIdx];
      if (img && img.complete && img.naturalWidth > 0) {
        animCtx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
      }

      animCtx.restore();

      p.y += p.ySpeed;
      p.x += p.xDrift + Math.sin(p.wobble) * 0.4;
      p.rotation += p.rotSpeed;
      p.wobble += p.wobbleSpeed;
      if (p.doesFlip) p.flipAngle += p.flipSpeed;

      if (p.y > animCanvas.height + p.size) {
        p.y = -p.size * 2;
        p.x = Math.random() * animCanvas.width;
        p.ySpeed = 0.6 + Math.random() * 1.0;
        p.size = 35 + Math.random() * 40;
        p.leafIdx = Math.floor(Math.random() * aprilLeafPaths.length);
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   8c) MAI – FRÜHLINGSWIND MIT BLÄTTERN UND LICHTFLIMMERN
   ========================================================= */

// Mai: goldene Lichtflecken wie Sonnenstrahlen durch
// Baumkronen und Wasserspritzer von unten wie Wellen
// die auf Felsen klatschen.
function startMayBreezeAnimation() {
  var w = animCanvas.width;
  var h = animCanvas.height;

  // Goldene Lichtflecken
  for (var j = 0; j < 12; j++) {
    animParticles.push({
      type: "light",
      x: Math.random() * w,
      y: Math.random() * h * 0.7,
      radius: 30 + Math.random() * 60,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.012,
      baseOpacity: 0.03 + Math.random() * 0.04,
      drift: 0.05 + Math.random() * 0.1
    });
  }

  // Wasserspritzer an den Klippen – Wellen prallen gegen
  // die Felsen und das Wasser schießt nach oben, fächert
  // sich auf und fällt dann durch Schwerkraft zurück.
  var splashTimer = 0;
  var splashInterval = 30 + Math.floor(Math.random() * 50);

  function spawnSplash() {
    // Aufschlagpunkt: unteres Drittel, auf Höhe der Klippen
    var cx = w * 0.05 + Math.random() * w * 0.9;
    var cy = h * 0.72 + Math.random() * h * 0.15;

    // Hauptspritzer: schießen kräftig nach oben
    var mainCount = 12 + Math.floor(Math.random() * 12);
    for (var s = 0; s < mainCount; s++) {
      animParticles.push({
        type: "splash",
        x: cx + (-30 + Math.random() * 60),
        y: cy,
        r: 2 + Math.random() * 3.5,
        vx: -3 + Math.random() * 6,
        vy: -(6 + Math.random() * 10),
        gravity: 0.12 + Math.random() * 0.06,
        opacity: 0.6 + Math.random() * 0.4,
        life: 1.0,
        decay: 0.006 + Math.random() * 0.005
      });
    }

    // Gischt/Nebel: feine Tröpfchen die langsamer sind
    var mistCount = 6 + Math.floor(Math.random() * 6);
    for (var m = 0; m < mistCount; m++) {
      animParticles.push({
        type: "splash",
        x: cx + (-40 + Math.random() * 80),
        y: cy + Math.random() * 10,
        r: 1 + Math.random() * 1.5,
        vx: -1.5 + Math.random() * 3,
        vy: -(2 + Math.random() * 4),
        gravity: 0.04 + Math.random() * 0.03,
        opacity: 0.3 + Math.random() * 0.3,
        life: 1.0,
        decay: 0.004 + Math.random() * 0.004
      });
    }
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      if (p.type === "light") {
        var glow = p.baseOpacity * (0.5 + 0.5 * Math.sin(p.pulse));
        var grad = animCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, "rgba(255,230,150," + glow + ")");
        grad.addColorStop(1, "rgba(255,200,100,0)");
        animCtx.beginPath();
        animCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        animCtx.fillStyle = grad;
        animCtx.fill();

        p.pulse += p.pulseSpeed;
        p.x += p.drift;
        if (p.x - p.radius > animCanvas.width) {
          p.x = -p.radius;
          p.y = Math.random() * animCanvas.height * 0.7;
        }
      } else if (p.type === "splash") {
        animCtx.globalAlpha = p.opacity * p.life;
        animCtx.beginPath();
        animCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        animCtx.fillStyle = "rgba(200,225,245," + (p.opacity * p.life) + ")";
        animCtx.fill();

        var sg = animCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        sg.addColorStop(0, "rgba(220,240,255," + (p.opacity * p.life * 0.3) + ")");
        sg.addColorStop(1, "rgba(200,225,245,0)");
        animCtx.beginPath();
        animCtx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        animCtx.fillStyle = sg;
        animCtx.fill();

        animCtx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > animCanvas.height + 10) {
          animParticles.splice(i, 1);
          i--;
        }
      }
    }

    // Regelmäßig neue Spritzer spawnen
    splashTimer++;
    if (splashTimer >= splashInterval) {
      spawnSplash();
      splashTimer = 0;
      splashInterval = 40 + Math.floor(Math.random() * 60);
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   8d) JUNI – LANGSAME WOLKEN MIT POLLEN
   ========================================================= */

// Ruhiger Frühsommer: große halbtransparente Wolken ziehen
// sehr langsam über den Himmel. Dazwischen schweben winzige
// Pollenpartikel die im Licht glitzern.
function startJuneCloudAnimation() {
  var w = animCanvas.width;
  var h = animCanvas.height;

  // Große langsame Wolken (obere Hälfte)
  for (var c = 0; c < 5; c++) {
    animParticles.push({
      type: "cloud",
      x: Math.random() * w * 2 - w * 0.5,
      y: Math.random() * h * 0.5,
      radius: 300 + Math.random() * 400,
      speed: 0.1 + Math.random() * 0.2,
      opacity: 0.06 + Math.random() * 0.08
    });
  }

  // Feine Pollenpartikel
  for (var i = 0; i < 105; i++) {
    animParticles.push({
      type: "pollen",
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.5,
      xSpeed: 0.1 + Math.random() * 0.3,
      ySpeed: -0.05 + Math.random() * 0.1,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.008 + Math.random() * 0.015,
      opacity: 0.2 + Math.random() * 0.4,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.02
    });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      if (p.type === "cloud") {
        var grad = animCtx.createRadialGradient(
          p.x, p.y, p.radius * 0.1,
          p.x, p.y, p.radius
        );
        grad.addColorStop(0, "rgba(255,255,255," + p.opacity + ")");
        grad.addColorStop(0.5, "rgba(245,245,250," + p.opacity * 0.5 + ")");
        grad.addColorStop(1, "rgba(240,240,245,0)");

        animCtx.beginPath();
        animCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        animCtx.fillStyle = grad;
        animCtx.fill();

        p.x += p.speed;
        if (p.x - p.radius > animCanvas.width) {
          p.x = -p.radius;
          p.y = Math.random() * animCanvas.height * 0.5;
        }
      } else {
        var glitter = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        animCtx.beginPath();
        animCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        animCtx.fillStyle = "rgba(255,240,180," + glitter + ")";
        animCtx.fill();

        p.x += p.xSpeed + Math.sin(p.wobble) * 0.2;
        p.y += p.ySpeed + Math.cos(p.wobble) * 0.15;
        p.wobble += p.wobbleSpeed;
        p.pulse += p.pulseSpeed;

        if (p.x > animCanvas.width + p.r) {
          p.x = -p.r;
          p.y = Math.random() * animCanvas.height;
        }
        if (p.y < -p.r) p.y = animCanvas.height + p.r;
        if (p.y > animCanvas.height + p.r) p.y = -p.r;
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   8e) AUGUST – HITZE-FLIMMERUNG MIT STAUB UND WARMEM LICHT
   ========================================================= */

// August: nur helle schwebende Lichtpunkte, keine Wolken.
// 180 Partikel verteilt über den ganzen Bildschirm.
function startAugustHazeAnimation() {
  var w = animCanvas.width;
  var h = animCanvas.height;

  for (var d = 0; d < 180; d++) {
    animParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.5 + Math.random() * 2.5,
      xSpeed: 0.03 + Math.random() * 0.12,
      ySpeed: -0.03 + Math.random() * 0.06,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.005 + Math.random() * 0.01,
      opacity: 0.5 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02
    });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      var glitter = p.opacity * (0.4 + 0.6 * Math.sin(p.pulse));
      animCtx.beginPath();
      animCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      animCtx.fillStyle = "rgba(255,220,140," + glitter + ")";
      animCtx.fill();

      p.x += p.xSpeed + Math.sin(p.wobble) * 0.1;
      p.y += p.ySpeed + Math.cos(p.wobble) * 0.08;
      p.wobble += p.wobbleSpeed;
      p.pulse += p.pulseSpeed;

      if (p.x > animCanvas.width + p.r) {
        p.x = -p.r;
        p.y = Math.random() * animCanvas.height;
      }
      if (p.y < -p.r) p.y = animCanvas.height + p.r;
      if (p.y > animCanvas.height + p.r) p.y = -p.r;
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   9) GLÜHENDE ASCHE / FUNKEN (JULI)
   ========================================================= */

// Hitzeflimmern von unten: viele kleine Funken und Glühpartikel
// die aus der unteren Hälfte aufsteigen. Drei Schichten für Tiefe:
// - Hintergrund: große weiche Glühwolken (Hitze-Dunst)
// - Mitte: mittelgroße Funken
// - Vordergrund: kleine helle Partikel
function startEmberAnimation() {
  var w = animCanvas.width;
  var h = animCanvas.height;

  var layers = [
    { count: 20, rMin: 2,   rMax: 4,   sMin: 0.15, sMax: 0.5,  oMin: 0.15, oMax: 0.35, glowMult: 5 },
    { count: 80, rMin: 1,   rMax: 2.5, sMin: 0.3,  sMax: 0.8,  oMin: 0.3,  oMax: 0.6,  glowMult: 3 },
    { count: 60, rMin: 0.5, rMax: 1.5, sMin: 0.4,  sMax: 1.0,  oMin: 0.4,  oMax: 0.8,  glowMult: 2 }
  ];

  for (var l = 0; l < layers.length; l++) {
    var cfg = layers[l];
    for (var i = 0; i < cfg.count; i++) {
      animParticles.push({
        x: Math.random() * w,
        y: h * 0.3 + Math.random() * h * 0.7,
        r: cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin),
        speed: cfg.sMin + Math.random() * (cfg.sMax - cfg.sMin),
        drift: -0.3 + Math.random() * 0.6,
        opacity: cfg.oMin + Math.random() * (cfg.oMax - cfg.oMin),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.04,
        glowMult: cfg.glowMult
      });
    }
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];
      var glow = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      var gradient = animCtx.createRadialGradient(
        p.x, p.y, 0, p.x, p.y, p.r * p.glowMult
      );
      gradient.addColorStop(0, "rgba(255,140,50," + glow * 0.6 + ")");
      gradient.addColorStop(0.5, "rgba(255,100,30," + glow * 0.2 + ")");
      gradient.addColorStop(1, "rgba(255,80,20,0)");
      animCtx.beginPath();
      animCtx.arc(p.x, p.y, p.r * p.glowMult, 0, Math.PI * 2);
      animCtx.fillStyle = gradient;
      animCtx.fill();

      animCtx.beginPath();
      animCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      animCtx.fillStyle = "rgba(255,200,100," + glow + ")";
      animCtx.fill();

      p.y -= p.speed;
      p.x += p.drift + Math.sin(p.pulse) * 0.3;
      p.pulse += p.pulseSpeed;

      if (p.y < -p.r * p.glowMult) {
        p.y = animCanvas.height + p.r * p.glowMult;
        p.x = Math.random() * animCanvas.width;
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   10) HERBSTBLÄTTER (SEPTEMBER)
   ========================================================= */

// 4 echte Blattfotos als lokale Bilder:
// autumn_leaf.png   – roter Fächerahorn
// autumn_leaf_2.png – rot-gelbes Herzblatt
// autumn_leaf_3.png – brauner Ahorn
// autumn_leaf_4.png – gelbes Birkenblatt
// Jedes Blatt bekommt beim Spawn eine feste zufällige Größe
// die sich im Flug NICHT verändert (kein Scale-Pulsieren).
var leafImages = [];
var leafImagesLoaded = 0;
var leafImagePaths = [
  "layout_pictures/animation_pictures/autumn_leaf.png",
  "layout_pictures/animation_pictures/autumn_leaf_2.png",
  "layout_pictures/animation_pictures/autumn_leaf_3.png",
  "layout_pictures/animation_pictures/autumn_leaf_4.png"
];

function loadAllLeafImages() {
  if (leafImages.length > 0) return;

  for (var i = 0; i < leafImagePaths.length; i++) {
    var img = new Image();
    img.src = leafImagePaths[i];
    (function(image) {
      image.onload = function() { leafImagesLoaded++; };
    })(img);
    leafImages.push(img);
  }
}

function startLeavesAnimation() {
  loadAllLeafImages();

  var count = 40;
  var w = animCanvas.width;
  var h = animCanvas.height;

  for (var i = 0; i < count; i++) {
    // Etwa die Hälfte der Blätter dreht sich um die eigene Achse
    // (3D-Flip), die andere Hälfte fällt nur mit normaler Rotation.
    var doesFlip = Math.random() < 0.5;

    animParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 30 + Math.random() * 50,
      leafIdx: Math.floor(Math.random() * leafImagePaths.length),
      ySpeed: 0.8 + Math.random() * 1.8,
      xDrift: 0.5 - Math.random(),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: -0.015 + Math.random() * 0.03,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.012 + Math.random() * 0.018,
      opacity: 0.75 + Math.random() * 0.25,
      doesFlip: doesFlip,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: doesFlip ? (0.015 + Math.random() * 0.03) : 0
    });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      animCtx.save();
      animCtx.translate(p.x, p.y);
      animCtx.rotate(p.rotation);

      // Achsendrehung: scaleX oszilliert zwischen -1 und 1,
      // das simuliert das Umdrehen des Blattes im Wind.
      // Die Größe bleibt dabei fest (kein scaleY).
      if (p.doesFlip) {
        animCtx.scale(Math.cos(p.flipAngle), 1);
      }

      animCtx.globalAlpha = p.opacity;

      var img = leafImages[p.leafIdx];
      if (img && img.complete && img.naturalWidth > 0) {
        animCtx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
      }

      animCtx.restore();

      p.y += p.ySpeed;
      p.x += p.xDrift + Math.sin(p.wobble) * 0.8;
      p.rotation += p.rotSpeed;
      p.flipAngle += p.flipSpeed;
      p.wobble += p.wobbleSpeed;

      if (p.y > animCanvas.height + p.size) {
        p.y = -p.size * 2;
        p.x = Math.random() * animCanvas.width;
        p.size = 30 + Math.random() * 50;
        p.ySpeed = 0.8 + Math.random() * 1.8;
        p.leafIdx = Math.floor(Math.random() * leafImagePaths.length);
        p.doesFlip = Math.random() < 0.5;
        p.flipAngle = Math.random() * Math.PI * 2;
        p.flipSpeed = p.doesFlip ? (0.015 + Math.random() * 0.03) : 0;
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}


/* =========================================================
   11) GEWITTER MIT REGEN + BLITZ (OKTOBER)
   ========================================================= */

// Regentropfen als diagonale Linien + gelegentliche Blitze.
// Adaptiert aus dem Original (10_oktober), aber auf einen
// einzigen Canvas reduziert damit es nicht kollidiert.
var stormLightning = [];
var stormLightTimer = 0;
var stormLightInterval = 200;

function startThunderstormAnimation() {
  var w = animCanvas.width;
  var h = animCanvas.height;
  stormLightning = [];
  stormLightTimer = 0;

  // Regen-Partikel
  for (var i = 0; i < 300; i++) {
    animParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      length: 1,
      xs: -2 + Math.random() * 2,
      ys: 12 + Math.random() * 10,
      type: "rain"
    });
  }

  function createBolt() {
    var bx = 100 + Math.random() * (animCanvas.width - 200);
    var by = Math.random() * (animCanvas.height / 4);
    var path = [{ x: bx, y: by }];
    var steps = 40 + Math.floor(Math.random() * 20);

    for (var s = 0; s < steps; s++) {
      var last = path[path.length - 1];
      path.push({
        x: last.x + (Math.random() * 30 - 15),
        y: last.y + (Math.random() * 25)
      });
    }

    stormLightning.push({ path: path, alpha: 1 });
  }

  function loop() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

    // Regen zeichnen
    for (var i = 0; i < animParticles.length; i++) {
      var p = animParticles[i];

      animCtx.beginPath();
      animCtx.moveTo(p.x, p.y);
      animCtx.lineTo(p.x + p.length * p.xs, p.y + p.length * p.ys);
      animCtx.strokeStyle = "rgba(174,194,224,0.4)";
      animCtx.lineWidth = 1;
      animCtx.lineCap = "round";
      animCtx.stroke();

      p.x += p.xs;
      p.y += p.ys;

      if (p.x > animCanvas.width || p.y > animCanvas.height) {
        p.x = Math.random() * animCanvas.width;
        p.y = -20;
      }
    }

    // Blitz erzeugen
    stormLightTimer++;
    if (stormLightTimer >= stormLightInterval) {
      createBolt();
      stormLightTimer = 0;
      stormLightInterval = 150 + Math.floor(Math.random() * 250);
    }

    // Blitze zeichnen und ausblenden
    for (var b = stormLightning.length - 1; b >= 0; b--) {
      var bolt = stormLightning[b];

      animCtx.beginPath();
      animCtx.moveTo(bolt.path[0].x, bolt.path[0].y);
      for (var s = 1; s < bolt.path.length; s++) {
        animCtx.lineTo(bolt.path[s].x, bolt.path[s].y);
      }
      animCtx.strokeStyle = "rgba(255,255,255," + bolt.alpha * 0.8 + ")";
      animCtx.lineWidth = 2;
      animCtx.stroke();

      // Blitz-Schein über den ganzen Bildschirm
      if (bolt.alpha > 0.8) {
        animCtx.fillStyle = "rgba(255,255,255," + bolt.alpha * 0.03 + ")";
        animCtx.fillRect(0, 0, animCanvas.width, animCanvas.height);
      }

      bolt.alpha -= 0.02;
      if (bolt.alpha <= 0) {
        stormLightning.splice(b, 1);
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}
