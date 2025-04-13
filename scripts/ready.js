document.addEventListener("DOMContentLoaded", () => {
  const knowButton = document.querySelector(".know-button");
  const body = document.body;
  const modal = document.getElementById("customModal");
  const modalMessage = document.getElementById("modalMessage");
  const backButton = document.getElementById("backButton");
  const forwardButton = document.getElementById("forwardButton");
  const dialogArrow = document.querySelector(".dialog-arrow");

  const messages = [
    "Are you ready to know just how much you're loved?",
    "I really can't imagine my life without you.",
    "I think about you and us all the time...",
    "... and it always reminds me how lucky I am to have you by my side.",
    "我爱你。",
  ];

  let currentMessageIndex = 0;

  function showModal() {
    modal.style.display = "flex";
    updateButtons();
  }

  function hideModal() {
    modal.style.display = "none";
  }

  function updateButtons() {
    backButton.classList.toggle("active", currentMessageIndex > 0);
    forwardButton.textContent =
      currentMessageIndex === messages.length - 1 ? "❤︎" : "→";
    dialogArrow.style.display =
      currentMessageIndex === messages.length - 1 ? "none" : "block";
  }

  function updateMessage() {
    modalMessage.textContent = messages[currentMessageIndex];
    modalMessage.classList.toggle(
      "final-message",
      currentMessageIndex === messages.length - 1
    );
    updateButtons();
  }

  knowButton.addEventListener("click", () => {
    if (currentMessageIndex < messages.length) {
      updateMessage();
      showModal();
    }
  });

  backButton.addEventListener("click", () => {
    if (currentMessageIndex > 0) {
      currentMessageIndex--;
      updateMessage();
    }
  });

  forwardButton.addEventListener("click", () => {
    if (currentMessageIndex < messages.length - 1) {
      currentMessageIndex++;
      updateMessage();
    } else {
      hideModal();
      body.classList.add("dimmed");
      window.location.href = "sleep.html";
    }
  });
});
