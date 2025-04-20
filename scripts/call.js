document.addEventListener("DOMContentLoaded", () => {
  const callButton = document.querySelector(".call-button");
  const phoneIcon = document.querySelector(".phone-icon");
  const speechBubbles = document.querySelectorAll(".speech-bubble");
  const arrow = document.querySelector(".arrow");
  let currentIndex = 0;

  function typeText(element, text, callback) {
    let index = 0;
    element.innerHTML = ""; // Clear the text
    element.style.display = "block";
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";

    // If this is the final message, make the text bold
    if (element.classList.contains("bubble-5-continue")) {
      element.style.fontWeight = "700";
    }

    function type() {
      if (index < text.length) {
        element.innerHTML += text[index];
        index++;
        setTimeout(type, 50);
      } else if (callback) {
        callback();
      }
    }

    type();
  }

  function showNextBubble() {
    if (currentIndex < speechBubbles.length) {
      const bubble = speechBubbles[currentIndex];
      const originalText = bubble.innerHTML;

      typeText(bubble, originalText, () => {
        // Special handling for split messages
        if (
          bubble.classList.contains("bubble-2") ||
          bubble.classList.contains("bubble-3") ||
          bubble.classList.contains("bubble-5") ||
          bubble.classList.contains("bubble-4")
        ) {
          setTimeout(() => {
            currentIndex++;
            showNextBubble();
          }, 1000);
        } else if (bubble.classList.contains("bubble-5-continue")) {
          // This is the final message
          setTimeout(() => {
            // Fade out all other bubbles
            speechBubbles.forEach((b, i) => {
              if (i !== currentIndex) {
                b.style.transition = "opacity 1s ease";
                b.style.opacity = "0";
              }
            });

            // Get the container dimensions
            const container = document.querySelector(".container");
            const containerRect = container.getBoundingClientRect();

            // Get the bubble's current position
            const bubbleRect = bubble.getBoundingClientRect();

            // Calculate the center position relative to the container
            const centerX = (containerRect.width - bubbleRect.width) / 2;
            const centerY = (containerRect.height - bubbleRect.height) / 2;

            // Calculate the current position relative to the container
            const currentX = bubbleRect.left - containerRect.left;
            const currentY = bubbleRect.top - containerRect.top;

            // Set up the transition
            bubble.style.transition = "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
            bubble.style.position = "absolute";
            bubble.style.transform = "translate(0, 0)";

            // Animate to center with floating effect
            requestAnimationFrame(() => {
              const finalX = centerX - currentX;
              const finalY = centerY - currentY;

              // Set CSS variables for the floating animation
              bubble.style.setProperty("--center-x", `${finalX}px`);
              bubble.style.setProperty("--center-y", `${finalY}px`);

              bubble.style.transform = `translate(${finalX}px, ${finalY}px) scale(1.1)`;

              // Add click event listener to the final bubble
              bubble.addEventListener("click", () => {
                window.location.href = "change.html";
              });

              // Add floating animation after centering animation completes
              setTimeout(() => {
                bubble.classList.add("floating");
              }, 1500);
            });
          }, 1000);
        } else {
          setTimeout(() => {
            currentIndex++;
            if (currentIndex < speechBubbles.length) {
              showNextBubble();
            }
          }, 1500);
        }
      });
    }
  }

  callButton.addEventListener("click", () => {
    callButton.style.display = "none";
    phoneIcon.style.display = "block";
  });

  phoneIcon.addEventListener("click", () => {
    phoneIcon.style.display = "none";
    showNextBubble(); // Start the typing sequence
  });
});
