const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");
const mittens = document.getElementById("mittens");
const catsImage = document.getElementById("cats-image");
const body = document.body;
const snowflakeOutlines = document.querySelectorAll(".snowflake-outline");

let backgroundSnowflakes = [];
let catchableSnowflakes = [];
let caughtSnowflakes = 0;
let isWarm = false;
let mouseX = 0;
let mouseY = 0;
let lastCatchableSpawn = 0;
const CATCHABLE_SPAWN_INTERVAL = 2000; // 2 seconds between catchable snowflakes

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Snowflake class
class Snowflake {
  constructor(isCatchable = false) {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.size = isCatchable ? Math.random() * 4 + 6 : Math.random() * 2 + 1;
    this.speed = isCatchable
      ? Math.random() * 1 + 1
      : Math.random() * 0.5 + 0.5;
    this.wind = Math.random() * 2 - 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    this.isCatchable = isCatchable;

    if (isCatchable) {
      this.element = document.createElement("span");
      this.element.textContent = "❆";
      this.element.style.position = "absolute";
      this.element.style.fontSize = `${this.size * 4}px`;
      this.element.style.color = "rgba(255, 255, 255, 0.9)";
      this.element.style.transition = "all 0.3s ease";
      document.body.appendChild(this.element);
    }
  }

  update() {
    this.y += this.speed;
    this.x += this.wind;
    this.rotation += this.rotationSpeed;

    if (this.isCatchable) {
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
      this.element.style.transform = `rotate(${this.rotation}rad)`;
    }

    // Check if snowflake is off screen
    if (this.y > canvas.height + 50) {
      if (this.isCatchable) {
        this.element.remove();
      }
      // Reset position to top of screen with new random x
      this.y = -10;
      this.x = Math.random() * canvas.width;
      // Reset other properties for variety
      this.speed = this.isCatchable
        ? Math.random() * 1 + 1
        : Math.random() * 0.5 + 0.5;
      this.wind = Math.random() * 2 - 1;
      this.rotation = Math.random() * Math.PI * 2;

      if (this.isCatchable) {
        this.element = document.createElement("span");
        this.element.textContent = "❆";
        this.element.style.position = "absolute";
        this.element.style.fontSize = `${this.size * 4}px`;
        this.element.style.color = "rgba(255, 255, 255, 0.9)";
        this.element.style.transition = "all 0.3s ease";
        document.body.appendChild(this.element);
      }
    }
  }

  draw() {
    if (!this.isCatchable) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Draw snowflake arms
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(angle) * this.size * 2,
          Math.sin(angle) * this.size * 2
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw smaller branches
        for (let j = 1; j <= 2; j++) {
          const branchLength = this.size * 0.5;
          const branchAngle = angle + (j % 2 === 0 ? -0.3 : 0.3);
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
          ctx.lineTo(
            Math.cos(angle) * this.size + Math.cos(branchAngle) * branchLength,
            Math.sin(angle) * this.size + Math.sin(branchAngle) * branchLength
          );
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  isCaught(mittensX, mittensY) {
    if (!this.isCatchable) return false;

    // Get mittens center point
    const mittensRect = mittens.getBoundingClientRect();
    const mittensCenterX = mittensRect.left + mittensRect.width / 2;
    const mittensCenterY = mittensRect.top + mittensRect.height / 2;

    // Get snowflake center point
    const snowflakeRect = this.element.getBoundingClientRect();
    const snowflakeCenterX = snowflakeRect.left + snowflakeRect.width / 2;
    const snowflakeCenterY = snowflakeRect.top + snowflakeRect.height / 2;

    // Calculate distance between centers
    const distance = Math.sqrt(
      Math.pow(snowflakeCenterX - mittensCenterX, 2) +
        Math.pow(snowflakeCenterY - mittensCenterY, 2)
    );

    // Use a larger collision radius based on mittens size
    const collisionRadius = mittensRect.width * 0.6;

    return distance < collisionRadius;
  }
}

// Create sparkle effect
function createSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 500);
}

// Initialize background snowflakes
function initBackgroundSnowflakes() {
  for (let i = 0; i < 50; i++) {
    backgroundSnowflakes.push(new Snowflake(false));
  }
}

// Spawn a new catchable snowflake
function spawnCatchableSnowflake() {
  catchableSnowflakes.push(new Snowflake(true));
}

// Update game state
function update(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update mittens position
  mittens.style.left = `${mouseX - mittens.offsetWidth / 2}px`;
  mittens.style.top = `${mouseY - mittens.offsetHeight / 2}px`;

  // Only update snowflakes if not all collected
  if (!isWarm) {
    // Update and draw background snowflakes
    backgroundSnowflakes.forEach((snowflake) => {
      snowflake.update();
      snowflake.draw();
    });

    // Spawn new catchable snowflake if needed
    if (
      timestamp - lastCatchableSpawn > CATCHABLE_SPAWN_INTERVAL &&
      catchableSnowflakes.length < 1
    ) {
      spawnCatchableSnowflake();
      lastCatchableSpawn = timestamp;
    }

    // Update and draw catchable snowflakes
    catchableSnowflakes.forEach((snowflake, index) => {
      snowflake.update();
      snowflake.draw();

      if (snowflake.isCaught(mouseX, mouseY)) {
        createSparkle(snowflake.x, snowflake.y);
        snowflake.element.remove();
        catchableSnowflakes.splice(index, 1);
        caughtSnowflakes++;

        // Fill in the corresponding snowflake outline
        if (caughtSnowflakes <= 5) {
          snowflakeOutlines[caughtSnowflakes - 1].classList.add("filled");
        }

        if (caughtSnowflakes >= 5 && !isWarm) {
          isWarm = true;
          body.classList.add("warm");
          catsImage.style.opacity = "1";

          // Remove all remaining snowflakes
          catchableSnowflakes.forEach((snowflake) => {
            if (snowflake.element) {
              snowflake.element.remove();
            }
          });
          catchableSnowflakes = [];
          backgroundSnowflakes = [];

          // Hide progress container
          document.getElementById("progress-container").style.opacity = "0";

          // Show message after image is fully visible (3s transition + 1s delay)
          setTimeout(() => {
            document.getElementById("warm-message").style.opacity = "1";
          }, 4000);

          // Show arrow after background transition completes (5s)
          setTimeout(() => {
            document.querySelector(".arrow").classList.add("visible");
          }, 5000);
        }
      }
    });
  }

  requestAnimationFrame(update);
}

// Mouse movement handler
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Touch movement handler
function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  mouseX = touch.clientX;
  mouseY = touch.clientY;
}

// Event listeners
window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("touchmove", handleTouchMove);

// Initialize game
resizeCanvas();
initBackgroundSnowflakes();
requestAnimationFrame(update);
