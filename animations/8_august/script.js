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

for (var s = 0; s < 8; s++) {
  particles.push({
    type: "haze",
    x: Math.random() * w,
    y: h * 0.6 + Math.random() * h * 0.4,
    width: 200 + Math.random() * 400,
    height: 15 + Math.random() * 25,
    speed: 0.15 + Math.random() * 0.3,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.015,
    opacity: 0.03 + Math.random() * 0.04
  });
}

for (var d = 0; d < 20; d++) {
  particles.push({
    type: "dust",
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.6 + Math.random() * 1.2,
    xSpeed: 0.05 + Math.random() * 0.15,
    ySpeed: -0.02 + Math.random() * 0.04,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.006 + Math.random() * 0.01,
    opacity: 0.15 + Math.random() * 0.3,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015
  });
}

for (var c = 0; c < 3; c++) {
  particles.push({
    type: "cloud",
    x: Math.random() * w * 2 - w * 0.3,
    y: Math.random() * h * 0.35,
    radius: 250 + Math.random() * 350,
    speed: 0.05 + Math.random() * 0.1,
    opacity: 0.04 + Math.random() * 0.05
  });
}

for (var l = 0; l < 4; l++) {
  particles.push({
    type: "glow",
    x: w * 0.2 + Math.random() * w * 0.6,
    y: h * 0.3 + Math.random() * h * 0.4,
    radius: 150 + Math.random() * 200,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.005 + Math.random() * 0.008,
    baseOpacity: 0.02 + Math.random() * 0.03
  });
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    if (p.type === "haze") {
      var wobbleOffset = Math.sin(p.wobble) * 20;
      ctx.fillStyle = "rgba(255,240,210," + p.opacity + ")";
      ctx.fillRect(p.x + wobbleOffset, p.y, p.width, p.height);
      p.x += p.speed;
      p.wobble += p.wobbleSpeed;
      if (p.x > canvas.width) { p.x = -p.width; p.y = canvas.height * 0.6 + Math.random() * canvas.height * 0.4; }
    } else if (p.type === "dust") {
      var glitter = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,230,170," + glitter + ")";
      ctx.fill();
      p.x += p.xSpeed + Math.sin(p.wobble) * 0.1;
      p.y += p.ySpeed + Math.cos(p.wobble) * 0.08;
      p.wobble += p.wobbleSpeed;
      p.pulse += p.pulseSpeed;
      if (p.x > canvas.width + p.r) { p.x = -p.r; p.y = Math.random() * canvas.height; }
    } else if (p.type === "cloud") {
      var grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
      grad.addColorStop(0, "rgba(255,250,240," + p.opacity + ")");
      grad.addColorStop(1, "rgba(255,245,230,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      p.x += p.speed;
      if (p.x - p.radius > canvas.width) { p.x = -p.radius; p.y = Math.random() * canvas.height * 0.35; }
    } else if (p.type === "glow") {
      var glowOp = p.baseOpacity * (0.4 + 0.6 * Math.sin(p.pulse));
      var grad2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad2.addColorStop(0, "rgba(255,200,120," + glowOp + ")");
      grad2.addColorStop(1, "rgba(255,180,100,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad2;
      ctx.fill();
      p.pulse += p.pulseSpeed;
    }
  }

  requestAnimationFrame(loop);
}

loop();