const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");
const inputContainer = document.querySelector(".input-container");
const arrow = document.querySelector(".arrow");

// Focus the input when the page loads
window.addEventListener("load", () => {
  input.focus();
});

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Star class
class Star {
  constructor(x, y, message, isYellow = false) {
    this.x = x;
    this.y = y;
    this.message = message;
    this.size = Math.random() * 4 + 2; // Size range: 2-6
    this.speed = Math.random() * 0.3 + 0.1; // Slower speed
    this.opacity = 1;
    this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    this.twinkleDirection = 1;
    this.rotation = Math.random() * Math.PI * 2; // Random initial rotation
    this.rotationSpeed = (Math.random() - 0.5) * 0.02; // Slow rotation
    this.isYellow = isYellow;
    this.growth = isYellow ? 0 : 1;
    this.growthSpeed = isYellow ? 0.05 : 0;
  }

  update() {
    this.y -= this.speed;
    this.rotation += this.rotationSpeed;

    if (this.isYellow) {
      this.growth = Math.min(1, this.growth + this.growthSpeed);
    }

    // Twinkle effect
    this.opacity += this.twinkleSpeed * this.twinkleDirection;
    if (this.opacity >= 1) {
      this.twinkleDirection = -1;
    } else if (this.opacity <= 0.3) {
      this.twinkleDirection = 1;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw star shape
    ctx.beginPath();
    const spikes = 5;
    const outerRadius = this.size * (this.isYellow ? this.growth : 1);
    const innerRadius = outerRadius * 0.4;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    if (this.isYellow) {
      ctx.fillStyle = `rgba(255, 255, 0, ${this.opacity * this.growth})`;
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    }
    ctx.fill();
    ctx.restore();
  }
}

let stars = [];

// Create initial stars
function createInitialStars() {
  for (let i = 0; i < 25; i++) {
    // Reduced to 25 stars
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    stars.push(new Star(x, y));
  }
}

// Animation loop
function animate() {
  // Clear with a slight fade effect
  ctx.fillStyle = "rgba(10, 10, 42, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star, index) => {
    star.update();
    star.draw();
    // Only remove stars that have moved off screen
    if (star.y < -20) {
      stars.splice(index, 1);
      // Add a new star at the bottom
      if (!star.isYellow) {
        const x = Math.random() * canvas.width;
        stars.push(new Star(x, canvas.height + 20));
      }
    }
  });

  requestAnimationFrame(animate);
}

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    // Add shrinking class to trigger the animation
    inputContainer.classList.add("shrinking");

    // Create a yellow star starting from the bottom of the screen
    setTimeout(() => {
      const x = Math.random() * (canvas.width - 100) + 50; // Keep 50px from edges horizontally
      const y = canvas.height + 20; // Start from just below the canvas
      const newStar = new Star(x, y, message, true);
      newStar.growth = 1; // Start at full size
      newStar.opacity = 1; // Start at full opacity
      newStar.size = 8; // Make it larger than regular stars
      stars.push(newStar);
      input.value = "";
    }, 300);

    // Show the arrow after the input container has fully shrunk (assuming 1s animation)
    setTimeout(() => {
      arrow.classList.add("visible");
      arrow.addEventListener("click", () => {
        window.location.href = "happy.html";
      });
    }, 1500);
  }
});

// Start animation
createInitialStars();
animate();
