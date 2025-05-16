const canvas = document.getElementById("sunsetCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let sunY = 100;
const sunRadius = 180;  // Increased sun radius from 120 to 180 for bigger sun
let stars = [];
let clouds = [
  { x: 100, y: 80 },
  { x: 300, y: 120 },
  { x: 600, y: 100 },
];

// Generate stars
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * (window.innerHeight * 0.6),
    opacity: Math.random(),
  });
}

let waveTime = 0;

// Text pulse animation variables
let textPulse = 0;

// Sun glow pulse
let sunGlowPulse = 0;

function drawGradientSky() {
  const sunsetProgress = Math.min(sunY / (canvas.height * 0.6), 1);

  const topColor = `rgba(${255 - 55 * sunsetProgress}, ${
    140 - 70 * sunsetProgress
  }, ${0 + 66 * sunsetProgress}, 1)`;
  const bottomColor = `rgba(${255 - 100 * sunsetProgress}, ${
    69 - 40 * sunsetProgress
  }, ${0 + 150 * sunsetProgress}, 1)`;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
}

function drawStars() {
  const sunsetProgress = Math.min(sunY / (canvas.height * 0.6), 1);
  const starOpacity = (sunsetProgress - 0.5) * 2;
  if (sunsetProgress > 0.5) {
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * starOpacity})`;
      ctx.fill();
    });
  }
}

function drawSun() {
  const centerX = canvas.width / 2;

  // Calculate pulsing shadowBlur
  const pulse = (Math.sin(sunGlowPulse) + 1) / 2; // 0 to 1
  ctx.shadowColor = "rgba(255, 140, 0, 0.7)";
  ctx.shadowBlur = 30 + pulse * 30;

  // Main sun radial gradient
  const grad = ctx.createRadialGradient(centerX, sunY, sunRadius * 0.1, centerX, sunY, sunRadius);
  grad.addColorStop(0, "rgba(255, 200, 0, 1)");       // bright yellow core
  grad.addColorStop(0.5, "rgba(255, 140, 0, 0.8)");   // orange
  grad.addColorStop(1, "rgba(255, 69, 0, 0)");        // transparent edge

  ctx.beginPath();
  ctx.arc(centerX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.shadowBlur = 0;

  // Add subtle halo - larger circle with low opacity
  ctx.beginPath();
  ctx.arc(centerX, sunY, sunRadius * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 140, 0, 0.1)";
  ctx.fill();

  sunGlowPulse += 0.03;
}

function drawReflection() {
  const centerX = canvas.width / 2;
  const baseY = canvas.height * 0.6;
  const reflectionLength = 180;

  const grad = ctx.createLinearGradient(centerX, baseY, centerX, baseY + reflectionLength);
  grad.addColorStop(0, "rgba(255, 140, 0, 0.4)");
  grad.addColorStop(1, "rgba(255, 140, 0, 0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(centerX - 20, baseY);
  ctx.lineTo(centerX + 20, baseY);
  ctx.lineTo(centerX + 80, baseY + reflectionLength);
  ctx.lineTo(centerX - 80, baseY + reflectionLength);
  ctx.closePath();
  ctx.fill();
}

function drawCloud(x, y) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.arc(x + 40, y + 10, 25, 0, Math.PI * 2);
  ctx.arc(x - 40, y + 10, 25, 0, Math.PI * 2);
  ctx.fill();
}

function drawWater() {
  const startY = canvas.height * 0.6;
  const waterHeight = canvas.height * 0.4;

  // Base water gradient
  const grad = ctx.createLinearGradient(0, startY, 0, canvas.height);
  grad.addColorStop(0, "#204070");
  grad.addColorStop(1, "#000022");
  ctx.fillStyle = grad;
  ctx.fillRect(0, startY, canvas.width, waterHeight);

  // Draw multiple overlapping waves for realistic effect
  const waveCount = 5;
  ctx.lineWidth = 1.5;

  for (let i = 0; i < waveCount; i++) {
    const amplitude = 5 + i * 3; // increasing amplitude for each wave
    const wavelength = 100 + i * 60;
    const speed = 0.03 + i * 0.01;
    const yOffset = startY + i * 8;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + 0.04 * i})`; // subtle white lines
    for (let x = 0; x <= canvas.width; x++) {
      const y =
        yOffset +
        amplitude * Math.sin((x * 2 * Math.PI) / wavelength + waveTime * speed);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  waveTime += 1;
}

function drawText() {
  const text = "TAKING OLISA TO WATCH SUNSET";
  const x = canvas.width / 2;
  const baseY = 60;

  // Animate vertical pulse ±3px
  const y = baseY + Math.sin(textPulse) * 3;
  textPulse += 0.03;
  if (textPulse > Math.PI * 2) {
    textPulse = 0;
  }

  ctx.font = "54px 'Dancing Script', cursive";
  ctx.textAlign = "center";
  ctx.lineJoin = "round";

  ctx.shadowColor = "rgba(255, 255, 255, 0.8)"; // white glow
  ctx.shadowBlur = 15;

  ctx.fillStyle = "#FFFFFF"; // bright white fill
  ctx.fillText(text, x, y);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"; // subtle white stroke
  ctx.strokeText(text, x, y);

  ctx.shadowBlur = 0;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGradientSky();
  drawStars();
  drawSun();
  drawWater();
  drawReflection();
  drawText();

  clouds.forEach((cloud) => {
    drawCloud(cloud.x, cloud.y);
    cloud.x += 0.3;
    if (cloud.x > canvas.width + 100) {
      cloud.x = -100;
    }
  });

  sunY += 0.7; // Faster sun descent
  if (sunY > canvas.height * 0.6 + 80) sunY = 100;

  requestAnimationFrame(animate);
}

animate();
