const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const quizQuestions = [
  {
    question: "JavaScript'te '===' operatörü ile '==' operatörü arasındaki temel fark nedir?",
    answers: [
      { text: "Fark yoktur, ikisi de aynı işi yapar.", correct: false },
      { text: "=== sadece değerleri karşılaştırırken, == tipi de karşılaştırır.", correct: false },
      { text: "=== hem değeri hem de veri tipini kontrol eder.", correct: true },
      { text: "== operatörü sadece sayısal değerlerde kullanılır.", correct: false },
    ],
  },
  {
    question: "SQL'de mevcut bir tablodaki verileri güncellemek için hangi komut kullanılır?",
    answers: [
      { text: "CHANGE", correct: false },
      { text: "MODIFY", correct: false },
      { text: "SAVE", correct: false },
      { text: "UPDATE", correct: true },
    ],
  },
  {
    question: "Java'da 'Encapsulation' (Kapsülleme) kavramı neyi ifade eder?",
    answers: [
      { text: "Verilerin ve metodların bir sınıf içinde gizlenip korunması.", correct: true },
      { text: "Bir sınıfın başka bir sınıftan özellik miras alması.", correct: false },
      { text: "Aynı isimli metodun farklı parametrelerle kullanılması.", correct: false },
      { text: "Kodun çalışma zamanında hangi metodun çağrılacağına karar verilmesi.", correct: false },
    ],
  },
  {
    question: "RESTful API'larda bir kaynağı (resource) silmek için hangi HTTP metodu tercih edilir?",
    answers: [
      { text: "GET", correct: false },
      { text: "POST", correct: false },
      { text: "DELETE", correct: true },
      { text: "REMOVE", correct: false },
    ],
  },
  {
    question: "Git versiyon kontrol sisteminde, yereldeki değişiklikleri uzak sunucuya (remote) göndermek için hangi komut kullanılır?",
    answers: [
      { text: "git pull", correct: false },
      { text: "git commit", correct: false },
      { text: "git push", correct: true },
      { text: "git fetch", correct: false },
    ],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  showQuestion();
}

function showQuestion() {
  answersDisabled = false;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";
  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;
  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });
  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}
function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  finalScoreSpan.textContent = score;
  const percentage = (score / quizQuestions.length) * 100;
  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}
function restartQuiz() {
  resultScreen.classList.remove("active");

  startQuiz();
}