var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

var particles = [];
var w = canvas.width;
var h = canvas.height;

for (var i = 0; i < 25; i++) {
  var isLeaf = Math.random() < 0.6;
  particles.push({
    type: "leaf",
    x: Math.random() * w,
    y: Math.random() * h,
    size: isLeaf ? (8 + Math.random() * 12) : (5 + Math.random() * 8),
    color: isLeaf
      ? "rgba(" + (80 + Math.floor(Math.random() * 60)) + "," + (140 + Math.floor(Math.random() * 60)) + ",60,"
      : "rgba(255,255," + (230 + Math.floor(Math.random() * 25)) + ",",
    xSpeed: 0.3 + Math.random() * 0.8,
    ySpeed: -0.1 + Math.random() * 0.2,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: -0.01 + Math.random() * 0.02,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.015,
    opacity: 0.4 + Math.random() * 0.4
  });
}

for (var j = 0; j < 12; j++) {
  particles.push({
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

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    if (p.type === "light") {
      var glow = p.baseOpacity * (0.5 + 0.5 * Math.sin(p.pulse));
      var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, "rgba(255,230,150," + glow + ")");
      grad.addColorStop(1, "rgba(255,200,100,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      p.pulse += p.pulseSpeed;
      p.x += p.drift;
      if (p.x - p.radius > canvas.width) { p.x = -p.radius; p.y = Math.random() * canvas.height * 0.7; }
    } else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size / 2, p.size / 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.opacity + ")";
      ctx.fill();
      ctx.restore();
      p.x += p.xSpeed + Math.sin(p.wobble) * 0.3;
      p.y += p.ySpeed + Math.cos(p.wobble) * 0.2;
      p.rotation += p.rotSpeed;
      p.wobble += p.wobbleSpeed;
      if (p.x > canvas.width + p.size) { p.x = -p.size; p.y = Math.random() * canvas.height; }
    }
  }

  requestAnimationFrame(loop);
}

loop();