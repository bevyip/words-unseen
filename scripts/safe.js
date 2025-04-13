document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const message = document.getElementById("message");
  const container = document.querySelector(".checkbox-container");
  const arrow = document.getElementById("arrow");

  // Reset all checkboxes when page loads
  function resetCheckboxes() {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    container.classList.remove("hidden");
    message.classList.remove("visible");
    arrow.classList.remove("visible");
  }

  // Call reset function when page loads
  resetCheckboxes();

  function checkAllChecked() {
    const allChecked = Array.from(checkboxes).every(
      (checkbox) => checkbox.checked
    );
    if (allChecked) {
      container.classList.add("hidden");
      // Add a delay to match the container fade-out duration
      setTimeout(() => {
        message.classList.add("visible");
        // Show arrow after 3 seconds
        setTimeout(() => {
          arrow.classList.add("visible");
        }, 3000);
      }, 1000);
    } else {
      container.classList.remove("hidden");
      message.classList.remove("visible");
      arrow.classList.remove("visible");
    }
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", checkAllChecked);
  });

  // Add click event listener to arrow
  arrow.addEventListener("click", function () {
    window.location.href = "disappear.html";
  });
});
