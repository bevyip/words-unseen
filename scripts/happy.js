const emojis = ["😊", "😄", "🥰", "💖"];
const container = document.querySelector(".container");
const happyWord = document.querySelector(".happy-word");

// Colors for fireworks
const fireworkColors = [
  "#ff0000", // bright red
  "#ff4000", // bright orange
  "#ffff00", // bright yellow
  "#00ff00", // bright green
  "#0000ff", // bright blue
  "#ff00ff", // bright magenta
  "#00ffff", // bright cyan
];

// Colors for confetti
const confettiColors = [
  "#ff0000", // red
  "#ff7f00", // orange
  "#ffff00", // yellow
  "#00ff00", // green
  "#0000ff", // blue
  "#4b0082", // indigo
  "#9400d3", // violet
  "#ff69b4", // pink
  "#00ffff", // cyan
  "#ff00ff", // magenta
];

class BouncingEmoji {
  constructor(emoji, x, y) {
    this.emoji = emoji;
    this.x = x;
    this.y = y;
    this.velocityY = 0;
    this.velocityX = (Math.random() - 0.5) * 10;
    this.gravity = 0.5;
    this.friction = 0.99;
    this.bounce = 0.7;
    this.element = document.createElement("div");
    this.element.className = "emoji";
    this.element.textContent = emoji;
    this.element.style.position = "fixed";
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.fontSize = "2rem";
    document.body.appendChild(this.element);
  }

  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.x += this.velocityX;

    if (this.y + 40 > window.innerHeight) {
      this.y = window.innerHeight - 40;
      this.velocityY *= -this.bounce;
      this.velocityX *= this.friction;
    }

    if (this.x < 0) {
      this.x = 0;
      this.velocityX *= -1;
    }
    if (this.x + 40 > window.innerWidth) {
      this.x = window.innerWidth - 40;
      this.velocityX *= -1;
    }

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

function createEmoji() {
  const corner = Math.floor(Math.random() * 4);
  let x, y;

  switch (corner) {
    case 0: // Top-left
      x = 0;
      y = 0;
      break;
    case 1: // Top-right
      x = window.innerWidth - 40;
      y = 0;
      break;
    case 2: // Bottom-left
      x = 0;
      y = window.innerHeight - 40;
      break;
    case 3: // Bottom-right
      x = window.innerWidth - 40;
      y = window.innerHeight - 40;
      break;
  }

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return new BouncingEmoji(emoji, x, y);
}

function createFirework() {
  // Create multiple streaks for each firework
  const numStreaks = 8 + Math.floor(Math.random() * 8); // 8-15 streaks per firework
  const color =
    fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

  for (let i = 0; i < numStreaks; i++) {
    const firework = document.createElement("div");
    firework.className = "firework";

    // Random position anywhere on screen
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    // Random angle and distance for each streak
    const angle = (Math.PI * 2 * i) / numStreaks + (Math.random() - 0.5) * 0.5;
    const distance = 60 + Math.random() * 60;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    // Set position and animation variables
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    firework.style.backgroundColor = color;
    firework.style.setProperty("--tx", `${tx}px`);
    firework.style.setProperty("--ty", `${ty}px`);

    // Random delay for each streak
    firework.style.animationDelay = `${Math.random() * 0.1}s`;

    document.body.appendChild(firework);

    // Remove after animation
    setTimeout(() => {
      firework.remove();
    }, 1000);
  }
}

function createConfetti() {
  // Create multiple confetti pieces
  const numPieces = 5 + Math.floor(Math.random() * 5); // 5-10 pieces per burst

  for (let i = 0; i < numPieces; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    // Random position anywhere on screen
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    // Random angle and distance for each piece
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    // Random rotation
    const rotation = (Math.random() - 0.5) * 720; // -360 to 360 degrees

    // Set position and animation variables
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.backgroundColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.setProperty("--tx", `${tx}px`);
    confetti.style.setProperty("--ty", `${ty}px`);
    confetti.style.setProperty("--rotation", `${rotation}deg`);

    // Random shape
    const shape = Math.random();
    if (shape < 0.3) {
      // Circle
      confetti.style.borderRadius = "50%";
    } else if (shape < 0.6) {
      // Square
      confetti.style.borderRadius = "0";
    } else {
      // Triangle
      confetti.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
    }

    // Random delay for each piece
    confetti.style.animationDelay = `${Math.random() * 0.2}s`;

    document.body.appendChild(confetti);

    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, 1500);
  }
}

let bouncingEmojis = [];
let animationFrameId = null;
let isHovering = false;
let lastEmojiTime = 0;
let lastConfettiTime = 0;
const emojiInterval = 100; // 100ms = 10 emojis per second
const confettiInterval = 400; // 400ms = 2.5 confetti bursts per second
let hasHovered = false;
const arrow = document.querySelector(".arrow");

function animate() {
  const currentTime = Date.now();

  if (isHovering) {
    // Create emojis
    if (currentTime - lastEmojiTime >= emojiInterval) {
      bouncingEmojis.push(createEmoji());
      lastEmojiTime = currentTime;
    }

    // Create confetti
    if (currentTime - lastConfettiTime >= confettiInterval) {
      createConfetti();
      lastConfettiTime = currentTime;
    }
  }

  // Update existing emojis
  bouncingEmojis.forEach((emoji) => emoji.update());
  bouncingEmojis = bouncingEmojis.filter((emoji) => {
    if (Math.abs(emoji.velocityY) < 0.1 && emoji.y >= window.innerHeight - 40) {
      emoji.element.remove();
      return false;
    }
    return true;
  });

  if (bouncingEmojis.length > 0 || isHovering) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
}

happyWord.addEventListener("mouseenter", () => {
  isHovering = true;
  lastEmojiTime = Date.now();
  lastConfettiTime = Date.now();
  if (!animationFrameId) {
    animate();
  }
});

happyWord.addEventListener("mouseleave", () => {
  isHovering = false;
  if (!hasHovered) {
    hasHovered = true;
    setTimeout(() => {
      arrow.classList.add("visible");
    }, 300);
  }
});

arrow.addEventListener("click", () => {
  window.location.href = "detail.html";
});
