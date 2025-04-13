const message = "I love you.";
const messageElement = document.getElementById("message");
const cursorElement = document.querySelector(".cursor");
const paper = document.querySelector(".paper");
const arrow = document.querySelector(".arrow");
let index = 0;
let hasStarted = false;

messageElement.textContent = " ";
messageElement.classList.add("visible");

document.addEventListener("keydown", (event) => {
  if (!hasStarted) {
    hasStarted = true;
    typeNextLetter();
  } else if (index < message.length) {
    typeNextLetter();
  }
});

function typeNextLetter() {
  if (index < message.length) {
    const currentText = messageElement.textContent;
    let newContent = "";

    // If current character is a space, include it and the next character
    if (message[index] === " ") {
      newContent = currentText + " " + `<span>${message[index + 1]}</span>`;
      index += 2;
    } else {
      newContent = currentText + `<span>${message[index]}</span>`;
      index++;
    }

    messageElement.innerHTML = newContent;

    // Update message width based on actual content width
    const tempSpan = document.createElement("span");
    tempSpan.style.visibility = "hidden";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "pre";
    tempSpan.style.fontFamily = "Playfair Display";
    tempSpan.style.fontSize = "2rem";
    tempSpan.textContent = messageElement.textContent;
    document.body.appendChild(tempSpan);
    messageElement.style.width = `${tempSpan.offsetWidth}px`;
    document.body.removeChild(tempSpan);

    if (index === message.length) {
      // Add love effect which includes both blushing and line fading
      paper.classList.add("love-effect");
      // Remove cursor when done
      cursorElement.style.display = "none";
      // Show arrow after animations complete
      setTimeout(() => {
        arrow.classList.add("visible");
        // Add click event listener to navigate to call.html
        arrow.addEventListener("click", () => {
          window.location.href = "call.html";
        });
      }, 5000); // Show arrow after line fading completes
    }
  }
}
