const insecurities = [
  "I'm not good enough.",
  "What if they don't like me?",
  "I'm going to fail.",
  "I can't speak up — I'll sound stupid.",
  "I'm not smart enough.",
  "I think too much about what others think about me.",
  "I'm not attractive enough.",
  "I'm not creative enough to belong here.",
  "This is too difficult for me.",
  "I only got this because of luck.",
];

let popupsClosed = 0;
const totalPopups = insecurities.length;
let usedPositions = [];

function getRandomPosition(popupWidth, popupHeight) {
  // Divide screen into a 3x3 grid
  const gridX = Math.floor(Math.random() * 3);
  const gridY = Math.floor(Math.random() * 3);

  // Calculate section boundaries
  const sectionWidth = window.innerWidth / 3;
  const sectionHeight = window.innerHeight / 3;

  // Calculate position within the selected grid section
  const minX = gridX * sectionWidth;
  const maxX = (gridX + 1) * sectionWidth - popupWidth;
  const minY = gridY * sectionHeight;
  const maxY = (gridY + 1) * sectionHeight - popupHeight;

  // Generate random position within the section
  const x = Math.max(
    minX,
    Math.min(maxX, minX + Math.random() * (maxX - minX))
  );
  const y = Math.max(
    minY,
    Math.min(maxY, minY + Math.random() * (maxY - minY))
  );

  return { x, y };
}

function createPopup() {
  if (insecurities.length === 0) return;

  const popup = document.createElement("div");
  popup.className = "popup";

  const insecurity = insecurities.pop();

  popup.innerHTML = `
        <div class="popup-header">
            <div class="popup-title">!!</div>
            <button class="close-button">&times;</button>
        </div>
        <div class="popup-content">${insecurity}</div>
    `;

  // Get popup dimensions
  document.body.appendChild(popup);
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  // Get a position that's not too close to existing popups
  let position;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    position = getRandomPosition(popupWidth, popupHeight);
    attempts++;
  } while (
    attempts < maxAttempts &&
    usedPositions.some(
      (pos) =>
        Math.abs(pos.x - position.x) < popupWidth * 0.8 &&
        Math.abs(pos.y - position.y) < popupHeight * 0.8
    )
  );

  usedPositions.push(position);

  popup.style.left = `${position.x}px`;
  popup.style.top = `${position.y}px`;

  const closeButton = popup.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    popup.remove();
    popupsClosed++;

    if (popupsClosed === totalPopups) {
      // Start the background fade
      document.body.classList.add("black-bg");
      // Add blurred effect
      document.body.classList.add("blurred");
      // Show the final message after a delay
      setTimeout(() => {
        document.querySelector(".final-message").classList.add("visible");
        // Show the arrow after the final message transition completes (5 seconds)
        setTimeout(() => {
          const arrow = document.querySelector(".arrow");
          arrow.classList.add("visible");
          // Add click event to redirect to warm.html
          arrow.addEventListener("click", () => {
            window.location.href = "warm.html";
          });
        }, 5000);
      }, 2000);
    }
  });
}

// Create first popup immediately
createPopup();

// Create remaining popups with a delay
let popupIndex = 1;
const createNextPopup = () => {
  if (insecurities.length > 0) {
    createPopup();
    popupIndex++;
    setTimeout(createNextPopup, 800); // 800ms delay between popups
  }
};

// Start creating popups after a short initial delay
setTimeout(createNextPopup, 1500);
