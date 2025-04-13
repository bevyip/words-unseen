document.addEventListener("DOMContentLoaded", () => {
  const textColorWheel = document.getElementById("text-color-wheel");
  const contrastRatioDisplay = document.getElementById("contrast-ratio");
  const accessibilityStatus = document.getElementById("accessibility-status");
  const luckyWord = document.querySelector(".lucky-word");
  const luckyOnly = document.querySelector(".lucky-only");
  const fullText = document.querySelector(".full-text");

  // Generate random background color that's non-compliant
  function getRandomNonCompliantColor() {
    const letters = "0123456789ABCDEF";
    let color;
    let isCompliant = true;

    // Keep generating colors until we find a non-compliant one
    while (isCompliant) {
      // Generate a green color (G component will be higher than R and B)
      const r = Math.floor(Math.random() * 100); // Low red
      const g = Math.floor(Math.random() * 155) + 100; // Higher green (100-255)
      const b = Math.floor(Math.random() * 100); // Low blue

      color = `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

      // Check if the color would be compliant with white text
      const bgRgb = hexToRgb(color);
      const textRgb = { r: 255, g: 255, b: 255 }; // White text
      const bgLuminance = getRelativeLuminance(bgRgb);
      const textLuminance = getRelativeLuminance(textRgb);
      const contrastRatio = getContrastRatio(bgLuminance, textLuminance);
      isCompliant = contrastRatio >= 4.5;
    }

    return color;
  }

  // Set random non-compliant background color
  const bgColor = getRandomNonCompliantColor();
  document.body.style.backgroundColor = bgColor;

  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function drawColorWheel(canvas, size = 200) {
    const context = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    const radius = size / 2;
    const center = radius;

    // Clear the canvas
    context.clearRect(0, 0, size, size);

    // Draw the color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 0.5) * Math.PI) / 180;
      const endAngle = ((angle + 0.5) * Math.PI) / 180;

      // Create gradient for each degree
      const gradient = context.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        radius
      );

      // Add color stops for smooth transition
      const hue = angle;
      const saturation = 100;
      const lightness = 50;

      // Convert HSL to RGB for the gradient
      const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100;
      const x1 = c * (1 - Math.abs(((hue / 60) % 2) - 1));
      const m = lightness / 100 - c / 2;

      let r, g, b;
      if (hue < 60) {
        [r, g, b] = [c, x1, 0];
      } else if (hue < 120) {
        [r, g, b] = [x1, c, 0];
      } else if (hue < 180) {
        [r, g, b] = [0, c, x1];
      } else if (hue < 240) {
        [r, g, b] = [0, x1, c];
      } else if (hue < 300) {
        [r, g, b] = [x1, 0, c];
      } else {
        [r, g, b] = [c, 0, x1];
      }

      const rgbColor = `rgb(${Math.round((r + m) * 255)}, ${Math.round(
        (g + m) * 255
      )}, ${Math.round((b + m) * 255)})`;

      gradient.addColorStop(0, rgbColor);
      gradient.addColorStop(1, rgbColor);

      context.beginPath();
      context.moveTo(center, center);
      context.arc(center, center, radius, startAngle, endAngle);
      context.closePath();
      context.fillStyle = gradient;
      context.fill();
    }

    // Add a small white dot in the center for the indicator
    context.beginPath();
    context.arc(center, center, 2, 0, Math.PI * 2);
    context.fillStyle = "white";
    context.fill();
  }

  function getColorAtPoint(canvas, x, y) {
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = rect.width / 2;

    // Calculate angle
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    // Calculate saturation based on distance from center
    const saturation = Math.min(1, distance / radius) * 100;

    // Get brightness from slider
    const brightness = document.getElementById("brightness-slider").value;

    // Convert HSL to RGB
    const h = angle;
    const s = saturation;
    const l = brightness; // Use slider value for lightness

    const c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
    const x1 = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;

    let r, g, b;
    if (h < 60) {
      [r, g, b] = [c, x1, 0];
    } else if (h < 120) {
      [r, g, b] = [x1, c, 0];
    } else if (h < 180) {
      [r, g, b] = [0, c, x1];
    } else if (h < 240) {
      [r, g, b] = [0, x1, c];
    } else if (h < 300) {
      [r, g, b] = [x1, 0, c];
    } else {
      [r, g, b] = [c, 0, x1];
    }

    return `rgb(${Math.round((r + m) * 255)}, ${Math.round(
      (g + m) * 255
    )}, ${Math.round((b + m) * 255)})`;
  }

  function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g);
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function getRelativeLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function getContrastRatio(l1, l2) {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function updateColors(textColor) {
    const bgRgb = hexToRgb(bgColor);
    const textRgb = hexToRgb(textColor);

    // Calculate contrast ratio
    const bgLuminance = getRelativeLuminance(bgRgb);
    const textLuminance = getRelativeLuminance(textRgb);
    const contrastRatio = getContrastRatio(bgLuminance, textLuminance);

    // Update display
    contrastRatioDisplay.textContent = contrastRatio.toFixed(2) + ":1";

    // Check WCAG compliance and set color
    const isCompliant = contrastRatio >= 4.5;
    contrastRatioDisplay.style.color = isCompliant ? "#4CAF50" : "#f44336";

    // Update lucky word color
    luckyWord.style.color = textColor;
    fullText.style.color = textColor;

    // Show/hide clover button based on compliance
    const cloverButton = document.getElementById("clover-button");
    if (isCompliant) {
      cloverButton.classList.add("visible");
      cloverButton.style.color = textColor;
    } else {
      cloverButton.classList.remove("visible");
      // Reset everything if not compliant
      luckyOnly.classList.remove("hidden");
      fullText.classList.remove("visible");
      document.querySelector(".color-controls").classList.remove("hidden");
    }
  }

  // Add click handler for clover button
  document.getElementById("clover-button").addEventListener("click", () => {
    // Start fading out the color controls
    document.querySelector(".color-controls").classList.add("hidden");
    document.querySelector(".controls").classList.add("hidden");

    // Start fading out the single word and fading in the full text
    luckyOnly.classList.add("hidden");
    fullText.classList.add("visible");

    // Add class to center the full text
    document
      .querySelector(".text-container")
      .classList.add("full-text-visible");

    // Show the arrow
    document.querySelector(".arrow").classList.add("visible");
    // Add click event listener to navigate to safe.html
    document.querySelector(".arrow").addEventListener("click", () => {
      window.location.href = "safe.html";
    });
  });

  // Initialize color wheel
  drawColorWheel(textColorWheel);

  // Start with a non-compliant text color
  let currentTextColor = "#f1f1f1";
  const colorIndicator = document.querySelector(".color-indicator");
  const colorWheelContainer = document.querySelector(".color-wheel-container");
  let isDragging = false;

  // Position the indicator at the center initially
  const centerX = textColorWheel.width / 2;
  const centerY = textColorWheel.height / 2;
  colorIndicator.style.left = `${centerX}px`;
  colorIndicator.style.top = `${centerY}px`;

  function updateColorFromPosition(x, y) {
    const rect = textColorWheel.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = rect.width / 2;

    // Limit the distance to the radius
    const limitedDistance = Math.min(distance, radius);
    const angle = Math.atan2(dy, dx);

    // Calculate new position
    const newX = centerX + limitedDistance * Math.cos(angle);
    const newY = centerY + limitedDistance * Math.sin(angle);

    // Update indicator position
    colorIndicator.style.left = `${newX}px`;
    colorIndicator.style.top = `${newY}px`;

    // Get color at position
    const color = getColorAtPoint(textColorWheel, newX, newY);
    currentTextColor = rgbToHex(color);
    updateColors(currentTextColor);
  }

  // Mouse event handlers
  colorWheelContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateColorFromPosition(e.offsetX, e.offsetY);
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const rect = colorWheelContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateColorFromPosition(x, y);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch event handlers for mobile
  colorWheelContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    const touch = e.touches[0];
    const rect = colorWheelContainer.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    updateColorFromPosition(x, y);
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const rect = colorWheelContainer.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    updateColorFromPosition(x, y);
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Add brightness slider event listener
  document.getElementById("brightness-slider").addEventListener("input", () => {
    const color = getColorAtPoint(
      textColorWheel,
      parseFloat(colorIndicator.style.left),
      parseFloat(colorIndicator.style.top)
    );
    currentTextColor = rgbToHex(color);
    updateColors(currentTextColor);
  });

  // Initial update
  updateColors(currentTextColor);
});
