document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const arrow = document.querySelector(".arrow");

  // Reset toggle state after a small delay to ensure it overrides any browser state
  setTimeout(() => {
    darkModeToggle.checked = false;
    body.classList.remove("dark-mode");
  }, 100);

  // Toggle dark mode
  darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  });

  // Arrow click redirect
  arrow.addEventListener("click", () => {
    window.location.href = "lucky.html";
  });
});
