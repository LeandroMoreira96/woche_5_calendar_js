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

for (var c = 0; c < 5; c++) {
  particles.push({
    type: "cloud",
    x: Math.random() * w * 2 - w * 0.5,
    y: Math.random() * h * 0.5,
    radius: 300 + Math.random() * 400,
    speed: 0.1 + Math.random() * 0.2,
    opacity: 0.06 + Math.random() * 0.08
  });
}

for (var i = 0; i < 35; i++) {
  particles.push({
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    if (p.type === "cloud") {
      var grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
      grad.addColorStop(0, "rgba(255,255,255," + p.opacity + ")");
      grad.addColorStop(0.5, "rgba(245,245,250," + p.opacity * 0.5 + ")");
      grad.addColorStop(1, "rgba(240,240,245,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      p.x += p.speed;
      if (p.x - p.radius > canvas.width) { p.x = -p.radius; p.y = Math.random() * canvas.height * 0.5; }
    } else {
      var glitter = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,240,180," + glitter + ")";
      ctx.fill();
      p.x += p.xSpeed + Math.sin(p.wobble) * 0.2;
      p.y += p.ySpeed + Math.cos(p.wobble) * 0.15;
      p.wobble += p.wobbleSpeed;
      p.pulse += p.pulseSpeed;
      if (p.x > canvas.width + p.r) { p.x = -p.r; p.y = Math.random() * canvas.height; }
      if (p.y < -p.r) p.y = canvas.height + p.r;
      if (p.y > canvas.height + p.r) p.y = -p.r;
    }
  }

  requestAnimationFrame(loop);
}

loop();