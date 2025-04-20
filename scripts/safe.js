document.addEventListener("DOMContentLoaded", function () {
  const textContent = document.querySelector(".text-content");
  const arrow = document.getElementById("arrow");
  let clickedSentences = new Set();

  // Original sentences to insert
  const specialSentences = [
    "You always make sure I'm walking on the inside of the sidewalk.",
    "You never make me feel dumb for being scared.",
    "You check in when I get quiet.",
    "You walk me home even if it's out of your way.",
    "You remember the stuff that stresses me out and try to make it easier.",
    "You always say the right things when I'm down.",
    "You always make sure I'm comfortable.",
    "You ask me if I slept well, even on your busiest days.",
    "You're gentle when I'm being hard on myself.",
    "You always listen — even when I think I'm rambling.",
  ];

  // Lines from safe.txt
  const textLines = [
    "There's no shortcut to relationship security.",
    'Never make promises you can\'t (or won\'t) keep, balance your priorities (don\'t be the idiot who thinks "equal priority" means "equal time".',
    "Making time for one another, regular texting, remembering the little things, giving affirmation he values and loves me, being there for me and always willing to listen to my problems. Really the basics of a good relationships.",
    "Reassuring me when needed. Being there when needed.",
    "Loving me in a way that I've never experienced. Ensuring that I know what my place is in their lives.",
    "Keeping promises. Never making me feel secondary. Prioritizing my feelings - and never making me feel like my feelings are invalid.",
    "Puts equal energy into the relationship as I do, initiating plans and time together, not just responding to me.",
    "consistency! my primary keeps her word and is very transparent. we don't run away from difficult conversations; no matter how hard they are. We say that we can solve everything as long as we communicate with transparency. that makes me feel pretty safe.",
    "They show up. Everytime. Regardless of what is going on. I mean a few illness days, a few life events and reschedules as does come up in life, but they made an effort to be there whenever I need them and I them. They followed through on the promises they made when we defined the relationship.",
    "There is always a message in the morning and before bed regardless of our lives during the day. Loves, cherishes and makes time for me and by all appearances enjoys our time together.",
    "Making space for check ins, making time for each other and having a policy of radical honesty.",
    "I need my partner to show a genuine and sustained interest in knowing who I am, and I need them to be consistent in how they show up for me. That's it.",
    "Communicating with me. Even when at work we text. Being home with me and making effort to watch movies and eat together every night.",
    "I love being the broken record on this- they show up! They are genuinely present emotionally and logistically and motivationally.",
    "They show up, communicate, love me and tell me so. I appreciate and love them.",
    "Showing up and sticking to their word, mostly. Being honest even when it's an uncomfortable or painful truth.",
    "Even though my answer is always, 'No issues... Go ahead... that's fine...' You still ask if I'm ok with anything before doing it that is outside of plans. Knowing that my opinion matters is validating.",
    "They were there to support me when I was depressed, unemployed and in my lowest.",
  ];

  // Create a single paragraph with all text joined together
  const paragraph = document.createElement("p");
  paragraph.style.margin = "0";
  paragraph.style.padding = "0";
  let fullText = "";

  // Shuffle the special sentences to ensure random placement
  const shuffledSentences = [...specialSentences];
  for (let i = shuffledSentences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledSentences[i], shuffledSentences[j]] = [
      shuffledSentences[j],
      shuffledSentences[i],
    ];
  }

  // Divide the text into sections for even distribution
  const numSections = 5; // Number of vertical sections
  const linesPerSection = Math.ceil(textLines.length / numSections);
  const sentencesPerSection = Math.ceil(specialSentences.length / numSections);

  let usedSentences = new Set();
  let currentSection = 0;
  let sentencesInCurrentSection = 0;

  // Process each line with height-based distribution
  textLines.forEach((line, index) => {
    fullText += `<span class="regular-text">${line}</span> `;

    // Check if we should move to next section
    if (index > 0 && index % linesPerSection === 0) {
      currentSection++;
      sentencesInCurrentSection = 0;
    }

    // Try to place sentences in current section
    if (
      sentencesInCurrentSection < sentencesPerSection &&
      usedSentences.size < specialSentences.length &&
      Math.random() < 0.6
    ) {
      // 60% chance to place in this section

      const sentenceIndex = getRandomUnusedSentence(
        usedSentences,
        specialSentences.length
      );
      if (sentenceIndex !== null) {
        fullText += `<span class="special-sentence" data-index="${sentenceIndex}">${specialSentences[sentenceIndex]}</span> `;
        sentencesInCurrentSection++;
      }
    }
  });

  // Helper function to get a random unused sentence
  function getRandomUnusedSentence(usedSet, totalSentences) {
    let availableIndices = [];
    for (let i = 0; i < totalSentences; i++) {
      if (!usedSet.has(i)) {
        availableIndices.push(i);
      }
    }
    if (availableIndices.length === 0) return null;
    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedSet.add(randomIndex);
    return randomIndex;
  }

  // If any sentences weren't used, append them at the end
  if (usedSentences.size < specialSentences.length) {
    specialSentences.forEach((sentence, index) => {
      if (!usedSentences.has(index)) {
        fullText += `<span class="special-sentence" data-index="${index}">${sentence}</span> `;
      }
    });
  }

  paragraph.innerHTML = fullText;
  textContent.appendChild(paragraph);

  // Add click handlers to all special sentences
  document.querySelectorAll(".special-sentence").forEach((span) => {
    span.addEventListener("click", function () {
      if (!this.classList.contains("clicked")) {
        this.classList.add("clicked");
        clickedSentences.add(parseInt(this.dataset.index));

        // Check if all sentences have been clicked
        if (clickedSentences.size === specialSentences.length) {
          // Fade out regular text
          document.querySelectorAll(".regular-text").forEach((span) => {
            span.classList.add("fade-out");
          });

          // After regular text fades out, start the flowing animation
          setTimeout(() => {
            // Add flowing class to all special sentences
            document.querySelectorAll(".special-sentence").forEach((span) => {
              span.classList.add("flowing");
            });

            // Create and show final message after sentences fade out
            setTimeout(() => {
              const finalMessage = document.createElement("div");
              finalMessage.className = "final-message";
              finalMessage.textContent = "You make me feel safe.";
              document.body.appendChild(finalMessage);

              // Show arrow after the message has fully appeared
              setTimeout(() => {
                arrow.classList.add("visible");
              }, 4000);
            }, 1500);
          }, 1000);
        }
      }
    });
  });

  // Handle arrow click
  arrow.addEventListener("click", function () {
    window.location.href = "disappear.html";
  });
});
