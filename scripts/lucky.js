// Set default degree (360*5)
let degree = 1800;
// Number of clicks = 0
let clicks = 0;

document.addEventListener("DOMContentLoaded", () => {
  const spinButton = document.getElementById("spin");
  const wheel = document.querySelector(".wheel");
  const sections = document.querySelectorAll("#wheel .sec");
  const txt = document.getElementById("txt");
  const polaroid = document.getElementById("polaroid");
  const polaroidImage = polaroid.querySelector("img");
  const innerWheel = document.getElementById("inner-wheel");
  const overlay = document.getElementById("overlay");
  const spinAgainButton = document.getElementById("spin-again");
  let isSpinning = false;
  let clickCount = 0;

  /* WHEEL SPIN FUNCTION */
  spinButton.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    polaroid.classList.add("hidden");
    polaroid.classList.remove("visible");
    overlay.classList.add("hidden");
    overlay.classList.remove("visible");

    // Reset wheel to 0 degrees before spinning
    innerWheel.style.transition = "none";
    innerWheel.style.transform = "rotate(0deg)";

    // Force a reflow and wait for it to complete
    setTimeout(() => {
      // Restore transition
      innerWheel.style.transition = "all 6s cubic-bezier(0, 0.99, 0.44, 0.99)";

      // Calculate total rotation
      const extraDegrees = Math.floor(Math.random() * 360);
      const totalDegrees = 1800 + extraDegrees;

      // Apply rotation to inner wheel
      innerWheel.style.transform = `rotate(${totalDegrees}deg)`;

      // Calculate winning section
      setTimeout(() => {
        // Get the final position (0-360)
        const finalPosition = totalDegrees % 360;
        // Each section is 60 degrees (360/6)
        // Add 30 degrees offset to measure from center of section
        const adjustedPosition = (finalPosition + 30) % 360;
        const sectionIndex = Math.round(adjustedPosition / 60);
        // Since arrow starts at lucky5, we need to adjust and ensure positive result
        const winningSection = (5 - sectionIndex + 6) % 6;

        console.log("Final position:", finalPosition);
        console.log("Adjusted position:", adjustedPosition);
        console.log("Section index:", sectionIndex);
        console.log("Winning section:", winningSection);

        // Update polaroid image
        polaroidImage.src = `img/lucky${winningSection}.png`;
        polaroidImage.alt = `Image lucky${winningSection}`;

        // Show overlay and polaroid after spin
        setTimeout(() => {
          overlay.classList.remove("hidden");
          overlay.classList.add("visible");
          setTimeout(() => {
            polaroid.classList.remove("hidden");
            polaroid.classList.add("visible");
          }, 50);
        }, 1000);

        isSpinning = false;
      }, 6000);
    }, 50); // Small delay to ensure reset is complete
  });

  // Handle spin again button
  spinAgainButton.addEventListener("click", () => {
    polaroid.classList.add("hidden");
    polaroid.classList.remove("visible");
    overlay.classList.add("hidden");
    overlay.classList.remove("visible");
  });
});
