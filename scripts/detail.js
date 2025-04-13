document.addEventListener("DOMContentLoaded", () => {
  const memoryItems = document.querySelectorAll(".memory-item");
  const memoryItemsContainer = document.getElementById("memoryItems");
  const quoteContainer = document.getElementById("quoteContainer");
  let collectedItems = 0;
  const totalItems = memoryItems.length;

  // Function to ensure tooltip stays within viewport
  function adjustTooltipPosition(item) {
    const tooltipContainer = item.querySelector(".tooltip-container");
    if (!tooltipContainer) return;

    const tooltipRect = tooltipContainer.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 10;

    if (tooltipRect.left < padding) {
      tooltipContainer.style.left = `${padding}px`;
      tooltipContainer.style.transform = "none";
    } else if (tooltipRect.right > viewportWidth - padding) {
      tooltipContainer.style.left = "auto";
      tooltipContainer.style.right = `${padding}px`;
      tooltipContainer.style.transform = "none";
    }

    if (tooltipRect.top < padding) {
      tooltipContainer.style.top = `${padding}px`;
      tooltipContainer.style.bottom = "auto";
    } else if (tooltipRect.bottom > viewportHeight - padding) {
      tooltipContainer.style.top = "auto";
      tooltipContainer.style.bottom = `${padding}px`;
    }
  }

  // Add tooltips to memory items
  memoryItems.forEach((item) => {
    const tooltipContainer = document.createElement("div");
    tooltipContainer.className = "tooltip-container";
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = item.getAttribute("data-tooltip");
    tooltipContainer.appendChild(tooltip);
    item.appendChild(tooltipContainer);

    // Update tooltip position on hover
    item.addEventListener("mouseenter", () => {
      item.style.zIndex = "2000";
      adjustTooltipPosition(item);
    });

    item.addEventListener("mouseleave", () => {
      item.style.zIndex = "1000";
    });
  });

  // Handle memory item clicks
  memoryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("collected")) {
        // Get the current position of the clicked item
        const currentRect = item.getBoundingClientRect();
        const currentX = currentRect.left;
        const currentY = currentRect.top;

        // Create a clone of the clicked item
        const clone = item.cloneNode(true);
        clone.classList.add("collected");

        // Remove the tooltip from the clone
        const tooltipContainer = clone.querySelector(".tooltip-container");
        if (tooltipContainer) {
          tooltipContainer.remove();
        }

        // Position the clone at the current position
        clone.style.position = "fixed";
        clone.style.left = `${currentX}px`;
        clone.style.top = `${currentY}px`;
        clone.style.width = "200px";
        clone.style.height = "200px";
        clone.style.transition = "all 0.5s ease";

        // Add the clone to the notebook
        memoryItemsContainer.appendChild(clone);

        // Force a reflow
        clone.offsetHeight;

        // Calculate the target position in the grid
        const gridSpacing = 170; // 150px + 20px gap
        const gridX = (index % 3) * gridSpacing;
        const gridY = Math.floor(index / 3) * gridSpacing;

        // Calculate the center position of the notebook
        const notebookRect = document
          .querySelector(".notebook-page")
          .getBoundingClientRect();
        const notebookCenterX = notebookRect.left + notebookRect.width / 2;
        const notebookCenterY = notebookRect.top + notebookRect.height / 2;

        // Calculate the final position relative to the notebook center
        const finalX = notebookCenterX - 450 / 2 + gridX; // 450 is total width of 3 items + gaps
        const finalY = notebookCenterY - 340 / 2 + gridY; // 340 is total height of 2 rows + gap

        // Animate to the grid position
        clone.style.left = `${finalX}px`;
        clone.style.top = `${finalY}px`;
        clone.style.width = "150px";
        clone.style.height = "150px";

        // Mark the original item as collected and hide it
        item.classList.add("collected");
        item.style.opacity = "0";
        item.style.pointerEvents = "none";

        // Increment collected items counter
        collectedItems++;

        // Check if all items are collected
        if (collectedItems === totalItems) {
          setTimeout(() => {
            // Hide the memory items container with a longer fade
            memoryItemsContainer.style.opacity = "0";
            memoryItemsContainer.style.transition = "opacity 1.5s ease";

            // Show the quote and arrow after a longer delay
            setTimeout(() => {
              quoteContainer.style.opacity = "1";
              quoteContainer.style.transition = "opacity 1.5s ease";
              const arrow = document.querySelector(".arrow");
              arrow.classList.add("visible");
              arrow.addEventListener("click", () => {
                window.location.href = "believe.html";
              });
            }, 1500);
          }, 1500);
        }
      }
    });
  });
});
