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
              bubble.style.transform = `translate(${centerX - currentX}px, ${
                centerY - currentY
              }px) scale(1.1)`;

              // Wait for the bubble to be centered, then position the arrow
              setTimeout(() => {
                // Get the new position of the centered bubble
                const newBubbleRect = bubble.getBoundingClientRect();
                const newBubbleX = newBubbleRect.left - containerRect.left;
                const newBubbleY = newBubbleRect.top - containerRect.top;

                // Position the arrow relative to the centered bubble
                arrow.style.position = "absolute";
                arrow.style.left = `${newBubbleX + newBubbleRect.width}px`;
                arrow.style.top = `${newBubbleY + newBubbleRect.height}px`;

                // Show and animate the arrow
                arrow.classList.add("visible");
                arrow.addEventListener("click", () => {
                  window.location.href = "change.html";
                });
              }, 2000); // Wait for the centering animation to complete
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
