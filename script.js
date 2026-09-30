const dinosaurFacts = {
  trex: {
    name: "T-Rex",
    emoji: "🦖",
    facts: ["T-Rex had big teeth and a large head.", "T-Rex was a meat-eating dinosaur.", "T-Rex could make a very loud roar!"]
  },
  brachio: {
    name: "Brachiosaurus",
    emoji: "🦕",
    facts: ["Brachiosaurus had a very long neck.", "It used its long neck to reach tall plants.", "Brachiosaurus was a plant eater."]
  },
  triceratops: {
    name: "Triceratops",
    emoji: "🦏",
    facts: ["Triceratops had three horns.", "It had a large frill behind its head.", "Triceratops ate plants."]
  },
  stego: {
    name: "Stegosaurus",
    emoji: "🦕",
    facts: ["Stegosaurus had plates on its back.", "It was a plant-eating dinosaur.", "It had a spiky tail."]
  },
  raptor: {
    name: "Velociraptor",
    emoji: "🦖",
    facts: ["Velociraptor was a small meat-eater.", "It had sharp claws.", "It was much smaller than it looks in some movies."]
  }
};

const funFacts = [
  "Some dinosaurs were much bigger than humans!",
  "Not all dinosaurs ate meat. Many ate plants.",
  "Dinosaurs lived a very long time ago.",
  "A fossil is a clue left behind by an ancient living thing.",
  "Some dinosaurs had feathers."
];

const questions = [
  { q: "Which dinosaur had three horns?", emoji: "🦏", answers: ["T-Rex", "Triceratops", "Stegosaurus"], correct: 1, explain: "Correct! Triceratops had three horns." },
  { q: "Which dinosaur had a very long neck?", emoji: "🦕", answers: ["Brachiosaurus", "T-Rex", "Velociraptor"], correct: 0, explain: "Yes! Brachiosaurus had a very long neck." },
  { q: "Which dinosaur had big teeth?", emoji: "🦖", answers: ["Triceratops", "Stegosaurus", "T-Rex"], correct: 2, explain: "That's right! T-Rex had big teeth." },
  { q: "Which dinosaur had plates on its back?", emoji: "🦕", answers: ["Velociraptor", "Stegosaurus", "T-Rex"], correct: 1, explain: "Great! Stegosaurus had plates on its back." },
  { q: "Which dinosaur was a small meat-eater?", emoji: "🦖", answers: ["Velociraptor", "Brachiosaurus", "Triceratops"], correct: 0, explain: "Correct! Velociraptor was a small meat-eater." },
  { q: "What did Brachiosaurus eat?", emoji: "🥬", answers: ["Plants", "Meat", "Rocks"], correct: 0, explain: "Yes! Brachiosaurus ate plants." },
  { q: "What did T-Rex eat?", emoji: "🥩", answers: ["Leaves only", "Meat", "Grass only"], correct: 1, explain: "That's right! T-Rex was a meat eater." },
  { q: "What is a fossil?", emoji: "🪨", answers: ["A toy dinosaur", "A clue from long ago", "A kind of food"], correct: 1, explain: "Correct! Fossils are clues left from long ago." },
  { q: "When did dinosaurs live?", emoji: "⏳", answers: ["Long ago", "Next year", "Tomorrow"], correct: 0, explain: "Yes! Dinosaurs lived a very long time ago." },
  { q: "Which one is a dinosaur?", emoji: "⭐", answers: ["Dolphin", "Cat", "T-Rex"], correct: 2, explain: "Great job! T-Rex is a dinosaur." }
];

const dinoGrid = document.getElementById("dinoGrid");
const dinoDetail = document.getElementById("dinoDetail");
const funFactText = document.getElementById("funFactText");
const factButton = document.getElementById("factButton");
const quizQuestions = document.getElementById("quizQuestions");
const checkButton = document.getElementById("checkButton");
const nextButton = document.getElementById("nextButton");
const quizFeedback = document.getElementById("quizFeedback");
const questionCounter = document.getElementById("questionCounter");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const finalScore = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");
const resultSubtext = document.getElementById("resultSubtext");
const retryButton = document.getElementById("retryButton");

let currentQuestion = 0;
let score = 0;
let answered = false;
let factIndex = 0;

// Dinosaur cards: dynamically update the detail panel using the HTML DOM.
dinoGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-dino]");
  if (!card) return;

  document.querySelectorAll(".dino-card").forEach(item => item.classList.remove("selected"));
  card.classList.add("selected");

  const dino = dinosaurFacts[card.dataset.dino];
  dinoDetail.innerHTML = `
    <div class="detail-emoji">${dino.emoji}</div>
    <div>
      <h3>${dino.name}</h3>
      <p>${dino.facts[0]}</p>
      <p>${dino.facts[1]}</p>
    </div>`;
});

// Fun fact button: change visible text and its color with DOM properties.
factButton.addEventListener("click", () => {
  factIndex = (factIndex + 1) % funFacts.length;
  funFactText.innerHTML = "✨ " + funFacts[factIndex];
  funFactText.style.color = "#126b50";
});

function renderQuestion() {
  answered = false;
  const item = questions[currentQuestion];
  questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  quizQuestions.innerHTML = `
    <div class="question-dino">${item.emoji}</div>
    <h3 class="question-title">${currentQuestion + 1}. ${item.q}</h3>
    <div class="answer-list">
      ${item.answers.map((answer, index) => `
        <label class="answer-option" data-option="${index}">
          <input type="radio" name="Q${currentQuestion + 1}" id="Q${currentQuestion + 1}_${index}" value="${index}">
          <span>${answer}</span>
        </label>`).join("")}
    </div>`;

  quizFeedback.textContent = "";
  quizFeedback.style.color = "";
  checkButton.classList.remove("hidden");
  nextButton.classList.add("hidden");
}

function CheckAnswer() {
  if (answered) return;
  const selected = document.querySelector(`input[name="Q${currentQuestion + 1}"]:checked`);

  if (!selected) {
    quizFeedback.textContent = "Please choose an answer first! 😊";
    quizFeedback.style.color = "#bd5a24";
    return;
  }

  answered = true;
  const selectedIndex = Number(selected.value);
  const item = questions[currentQuestion];
  const options = document.querySelectorAll(".answer-option");

  options.forEach((option, index) => {
    const radio = option.querySelector("input");
    radio.disabled = true;
    if (index === item.correct) option.classList.add("correct");
    if (index === selectedIndex && selectedIndex !== item.correct) option.classList.add("incorrect");
  });

  if (selectedIndex === item.correct) {
    score++;
    quizFeedback.innerHTML = `🎉 Great Job! ${item.explain}`;
    quizFeedback.style.color = "#16834b";
  } else {
    quizFeedback.innerHTML = `💪 Good try! ${item.explain}`;
    quizFeedback.style.color = "#c45d36";
  }

  checkButton.classList.add("hidden");
  nextButton.classList.remove("hidden");
  nextButton.textContent = currentQuestion === questions.length - 1 ? "See My Result →" : "Next Question →";
}

function showResult() {
  finalScore.textContent = score;
  if (score >= 8) {
    resultMessage.textContent = "Amazing, Dino Expert!";
    resultSubtext.textContent = "You know so much about dinosaurs. Keep exploring!";
  } else if (score >= 5) {
    resultMessage.textContent = "Great Dino Explorer!";
    resultSubtext.textContent = "Well done! Explore the learning pages and try again.";
  } else {
    resultMessage.textContent = "Good Try, Little Explorer!";
    resultSubtext.textContent = "Keep learning. You can take the quiz again!";
  }
  document.querySelector("#result").scrollIntoView({ behavior: "smooth" });
}

function TakeQuizAgain() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  renderQuestion();
  document.querySelector("#quiz").scrollIntoView({ behavior: "smooth" });
}

checkButton.addEventListener("click", CheckAnswer);
nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
});
retryButton.addEventListener("click", TakeQuizAgain);

// Highlight the navigation item for the section currently being viewed.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => observer.observe(section));

renderQuestion();
