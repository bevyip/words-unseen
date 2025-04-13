const message = "I love you.";
const messageElement = document.getElementById("message");
const cursorElement = document.querySelector(".cursor");
const paper = document.querySelector(".paper");
const emoji = document.querySelector(".emoji");
const response = document.querySelector(".response");

messageElement.textContent = message;
messageElement.classList.add("visible");
cursorElement.style.display = "none";
emoji.classList.add("visible");

emoji.addEventListener("click", () => {
  paper.classList.add("fade");
  emoji.classList.remove("visible");

  const responseText = "I love you too.";
  const responseElement = document.querySelector(".response");
  responseElement.innerHTML = responseText;
  responseElement.style.opacity = "0";
  responseElement.classList.add("visible");

  setTimeout(() => {
    responseElement.style.transition = "opacity 2s ease-in";
    responseElement.style.opacity = "1";
  }, 2000);

  setTimeout(() => {
    document.body.style.transition = "background-color 3s ease-in-out";
    document.getElementById("pinkBackground").style.transition =
      "opacity 3s ease-in-out";

    document.getElementById("pinkBackground").style.opacity = "0";
    document.body.style.backgroundColor = "white";
    document.querySelector(".paper-container").style.backgroundColor =
      "transparent";

    setTimeout(() => {
      const paper = document.querySelector(".paper");
      paper.style.transition =
        "background-image 4s ease-in-out, box-shadow 3s ease-in-out";
      paper.offsetHeight;
      paper.style.backgroundImage = "none";
      paper.style.boxShadow = "none";
    }, 1000);

    setTimeout(() => {
      messageElement.style.transition = "transform 2s ease-out";
      responseElement.style.transition = "transform 2s ease-out";

      messageElement.style.transform = "translateY(120px)";
      responseElement.style.transform = "translateY(-120px)";
    }, 2000);
  }, 5000);
});
