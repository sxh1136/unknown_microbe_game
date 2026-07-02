let currentOrganism;
let orderedTests = [];
let guesses = 0;
let gameOver = false;

const testButtonsEl = document.getElementById("testButtons");
const resultsEl = document.getElementById("results");
const testsOrderedEl = document.getElementById("testsOrdered");
const guessesEl = document.getElementById("guesses");
const guessInputEl = document.getElementById("guessInput");
const guessButtonEl = document.getElementById("guessButton");
const guessFeedbackEl = document.getElementById("guessFeedback");
const newGameButtonEl = document.getElementById("newGameButton");

// Reveal answer elements
const revealAnswerButtonEl = document.getElementById("revealAnswerButton");
const answerRevealEl = document.getElementById("answerReveal");

function startNewGame() {
  currentOrganism = ORGANISMS[Math.floor(Math.random() * ORGANISMS.length)];

  orderedTests = [];
  guesses = 0;
  gameOver = false;

  guessInputEl.value = "";
  guessInputEl.disabled = false;
  guessButtonEl.disabled = false;
  guessFeedbackEl.textContent = "";
  guessFeedbackEl.className = "";

  // Hide and reset reveal answer section
  revealAnswerButtonEl.style.display = "none";
  answerRevealEl.innerHTML = "";
  answerRevealEl.className = "";

  renderStats();
  renderTestButtons();
  renderResults();
}

function renderStats() {
  testsOrderedEl.textContent = orderedTests.length;
  guessesEl.textContent = guesses;
}

function renderTestButtons() {
  testButtonsEl.innerHTML = "";

  currentOrganism.tests.forEach((test) => {
    const button = document.createElement("button");
    button.className = "test-button";
    button.textContent = test.name;

    if (orderedTests.includes(test.id) || gameOver) {
      button.disabled = true;
    }

    button.addEventListener("click", () => orderTest(test.id));

    testButtonsEl.appendChild(button);
  });
}

function scrollToLatestResult() {
  requestAnimationFrame(() => {
    const resultCards = resultsEl.querySelectorAll(".result-card");
    const latestCard = resultCards[resultCards.length - 1];

    if (latestCard) {
      latestCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}

function orderTest(testId) {
  if (gameOver || orderedTests.includes(testId)) {
    return;
  }

  const test = currentOrganism.tests.find((t) => t.id === testId);

  if (!test) {
    return;
  }

  orderedTests.push(test.id);

  renderStats();
  renderTestButtons();
  renderResults();
  scrollToLatestResult();
}

function renderResults() {
  resultsEl.innerHTML = "";

  if (orderedTests.length === 0) {
    resultsEl.innerHTML = `<p class="muted">No tests ordered yet.</p>`;
    return;
  }

  orderedTests.forEach((testId) => {
    const test = currentOrganism.tests.find((t) => t.id === testId);

    const resultCard = document.createElement("div");
    resultCard.className = test.image ? "result-card has-image" : "result-card";

    const resultHtml = test.result
      ? `<p>${test.result}</p>`
      : "";

    let statusHtml = "";

    if (test.status === "positive") {
      statusHtml = `
        <span class="result-status positive" aria-label="Positive result">
          ✓
        </span>
      `;
    }

    if (test.status === "negative") {
      statusHtml = `
        <span class="result-status negative" aria-label="Negative result">
          ✕
        </span>
      `;
    }

    const imageHtml = test.image
      ? `
        <div class="result-image-wrapper">
          <img
            class="result-image"
            src="${test.image}"
            alt="${test.alt || test.name}"
          >
        </div>
      `
      : "";

    resultCard.innerHTML = `
      <div>
        <div class="result-heading">
          <h3>${test.name}</h3>
          ${statusHtml}
        </div>

        ${resultHtml}
      </div>

      ${imageHtml}
    `;

    resultsEl.appendChild(resultCard);
  });
}

function normalizeAnswer(answer) {
  return answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function submitGuess() {
  if (gameOver) {
    return;
  }

  const guess = normalizeAnswer(guessInputEl.value);

  if (!guess) {
    guessFeedbackEl.textContent = "Enter a guess first.";
    guessFeedbackEl.className = "warning";
    return;
  }

  guesses += 1;

  const acceptedAnswers = currentOrganism.acceptedAnswers.map(normalizeAnswer);
  const isCorrect = acceptedAnswers.includes(guess);

  if (isCorrect) {
    gameOver = true;

    guessFeedbackEl.innerHTML = `
      <p><strong>Correct.</strong> The organism is <em>${currentOrganism.name}</em>.</p>
      <p>You identified it using <strong>${orderedTests.length}</strong> test(s).</p>
    `;
    guessFeedbackEl.className = "correct";

    guessInputEl.disabled = true;
    guessButtonEl.disabled = true;

    // Hide reveal button if they got it correct
    revealAnswerButtonEl.style.display = "none";
    answerRevealEl.innerHTML = "";
    answerRevealEl.className = "";

  } else {
    guessFeedbackEl.textContent = "Incorrect. Try another guess or order more tests.";
    guessFeedbackEl.className = "incorrect";

    // Show reveal answer button after one wrong guess
    revealAnswerButtonEl.style.display = "inline-block";
  }

  renderStats();
  renderTestButtons();
}

function revealAnswer() {
  if (gameOver) {
    return;
  }

  gameOver = true;

  answerRevealEl.innerHTML = `
    <p>Whole genome sequencing identified the organism as <em><u>${currentOrganism.name}</u></em>.</p>
  `;
  answerRevealEl.className = "warning";

  guessInputEl.disabled = true;
  guessButtonEl.disabled = true;

  // Hide the reveal button after it has been clicked
  revealAnswerButtonEl.style.display = "none";

  renderStats();
  renderTestButtons();
}

guessButtonEl.addEventListener("click", submitGuess);

guessInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitGuess();
  }
});

revealAnswerButtonEl.addEventListener("click", revealAnswer);

newGameButtonEl.addEventListener("click", startNewGame);

startNewGame();
