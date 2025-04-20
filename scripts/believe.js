document.addEventListener("DOMContentLoaded", () => {
  const correctSentence =
    "You mean so much more to me than you let yourself believe.";
  const words = correctSentence.split(" ");

  // Shuffle the words
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledWords = shuffleArray([...words]);
  const wordContainer = document.getElementById("wordContainer");
  let draggedWord = null;
  let currentPositions = new Array(words.length).fill(null);

  // Create initial word pills
  shuffledWords.forEach((word, index) => {
    createWordPill(word, index);
    currentPositions[index] = word;
  });

  function createWordPill(word, index) {
    const pill = document.createElement("div");
    pill.className = "word-pill";
    pill.textContent = word;
    pill.draggable = true;
    pill.dataset.index = index;

    pill.addEventListener("dragstart", (e) => {
      if (!pill.classList.contains("correct")) {
        draggedWord = pill;
        pill.classList.add("dragging");
        e.dataTransfer.setData("text/plain", word);
      }
    });

    pill.addEventListener("dragend", () => {
      pill.classList.remove("dragging");
      draggedWord = null;
    });

    wordContainer.appendChild(pill);
    checkPosition(pill);
  }

  function checkPosition(pill) {
    const currentIndex = parseInt(pill.dataset.index);
    const word = pill.textContent;
    const correctIndex = words.indexOf(word);

    if (currentIndex === correctIndex) {
      pill.classList.add("correct");
      pill.draggable = false;
    } else {
      pill.classList.remove("correct");
      pill.draggable = true;
    }

    // Check if all pills are correct
    checkCompletion();
  }

  function checkCompletion() {
    const allPills = Array.from(wordContainer.children);
    const allCorrect = allPills.every((pill) =>
      pill.classList.contains("correct")
    );

    if (allCorrect) {
      // Add flashing class to all pills
      allPills.forEach((pill) => pill.classList.add("flashing"));

      // After flashing animation completes (1.5 seconds = 3 flashes * 0.5s each)
      setTimeout(() => {
        // Remove pills and show final sentence
        wordContainer.classList.add("completed");

        // Create container for final content
        const finalContainer = document.createElement("div");
        finalContainer.className = "final-container";
        document.body.appendChild(finalContainer);

        // Create background image container
        const backgroundImage = document.createElement("div");
        backgroundImage.className = "background-image";
        document.body.appendChild(backgroundImage);

        // Create and show final sentence
        const finalSentence = document.createElement("h1");
        finalSentence.className = "final-sentence";
        finalSentence.textContent = correctSentence;
        finalContainer.appendChild(finalSentence);

        // Create arrow
        const arrow = document.createElement("div");
        arrow.className = "arrow";
        arrow.addEventListener("click", () => {
          window.location.href = "ready.html";
        });
        finalContainer.appendChild(arrow);

        // Fade in the final sentence and arrow after container fade out
        setTimeout(() => {
          finalContainer.classList.add("visible");
          arrow.classList.add("visible");
          backgroundImage.classList.add("visible");
        }, 1000); // Wait for container fade out
      }, 4500); // 3 flashes (1.5s × 3) + 1s for fade out
    }
  }

  // Make word container a drop target
  wordContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    if (dragging && !dragging.classList.contains("correct")) {
      const pills = Array.from(wordContainer.children);
      const draggingIndex = parseInt(dragging.dataset.index);
      const dropIndex = pills.findIndex((pill) => {
        const rect = pill.getBoundingClientRect();
        return e.clientY < rect.bottom && e.clientX < rect.right;
      });

      if (dropIndex !== -1 && !pills[dropIndex].classList.contains("correct")) {
        // Swap positions
        const tempIndex = pills[dropIndex].dataset.index;
        pills[dropIndex].dataset.index = draggingIndex;
        dragging.dataset.index = tempIndex;

        // Reorder pills in container
        const sortedPills = [...pills].sort(
          (a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index)
        );
        sortedPills.forEach((pill) => wordContainer.appendChild(pill));

        // Check positions after swap
        checkPosition(dragging);
        checkPosition(pills[dropIndex]);
      }
    }
  });

  wordContainer.addEventListener("drop", (e) => {
    e.preventDefault();
  });
});
