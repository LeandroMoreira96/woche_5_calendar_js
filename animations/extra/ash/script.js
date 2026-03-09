const canvasEl = document.getElementById("canvas");

const ctx = canvasEl.getContext("2d");

let ashParticles = [];
let numParticles = 200;

function resizeCanvas() {
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  numParticles = Math.floor((canvasEl.width * canvasEl.height) / 6000);
  updateParticles();
}

class AshParticle {
  constructor(isInitial = false) {
    this.init(isInitial);
  }

  init(isInitial = false) {
    const isFromLeft = Math.random() < 0.5;

    if (isInitial) {
      this.x = Math.random() * canvasEl.width;
      this.y = Math.random() * canvasEl.height;
    } else {
      this.x = isFromLeft ? -10 : Math.random() * canvasEl.width;
      this.y = isFromLeft ? Math.random() * canvasEl.height : canvasEl.height + 10;
    }

    this.sizeX = Math.random() * 2 + 0.5;
    this.sizeY = Math.random() * 8 + 2;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.speedX = Math.random() * 1.5 + 0.5;
    this.speedY = -(Math.random() * 1.5 + 0.5);
    this.fadeSpeed = Math.random() * 0.0008 + 0.0003;

    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.rotationXSpeed = Math.random() * 0.1 - 0.05;
    this.rotationYSpeed = Math.random() * 0.1 - 0.05;
    this.rotationZSpeed = Math.random() * 0.1 - 0.05;

    this.scaleX = 1;
    this.scaleY = 1;
  }

  checkBounds() {
    if (this.y < -50 || this.x > canvasEl.width + 50 || this.opacity <= 0) {
      this.init();
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= this.fadeSpeed;

    this.rotationX += this.rotationXSpeed;
    this.rotationY += this.rotationYSpeed;
    this.rotationZ += this.rotationZSpeed;

    const cosRotationX = Math.cos(this.rotationX);
    const cosRotationY = Math.cos(this.rotationY);
    this.scaleY = 0.8 + 0.2 * cosRotationX;
    this.scaleX = 0.8 + 0.2 * cosRotationY;

    this.checkBounds();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotationZ);
    ctx.scale(this.scaleX, this.scaleY);

    const rotationFactor = Math.cos(this.rotationZ);
    const red = 255 - Math.abs(rotationFactor) * 80;
    const green = 100 + Math.abs(rotationFactor) * 80;
    const blue = 50 + Math.abs(rotationFactor) * 30;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.sizeX, this.sizeY, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.floor(red)}, ${Math.floor(green)}, ${Math.floor(blue)}, ${this.opacity})`;
    ctx.fill();

    ctx.restore();
  }
}

function updateParticles() {
  const diff = numParticles - ashParticles.length;
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      ashParticles.push(new AshParticle(true));
    }
  } else if (diff < 0) {
    ashParticles.length = numParticles;
  }
}

function animate() {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  for (const particle of ashParticles) {
    particle.update();
    particle.draw();
  }
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate();