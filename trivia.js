const readline = require('readline');

// Array of Questions
const questions = [
  {
    question: "How many states are in the United States of America?",
    options: ["50", "51", "52", "49"],
    correctAnswer: 0 
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Management Law"],
    correctAnswer: 0
  },
  {
    question: "Which player never wore  the Number 7 jersey?",
    options: ["Alexis Sanchez", "Hatem Ben Arfa", "Theo Walcott", "Arjen Robben"],
    correctAnswer: 3
  },
];

// Game State
let currentQuestionIndex = 0;
let userAnswers = []; 
let totalTimeRemaining = 60; 
let gameTimerInterval = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Timer
function startTimer() {
  gameTimerInterval = setInterval(() => {
    totalTimeRemaining--;

    if (totalTimeRemaining <= 0) {
      clearInterval(gameTimerInterval);
      console.log("TIME'S UP!");
      endGame();
    }
  }, 1000);
}

// Game-Flow
function startGame() {
  console.clear();
  console.log("WELCOME TO THE RANDOM TRIVIA GAME");
  console.log(`  You have ${totalTimeRemaining} seconds to complete the quiz!`);

  startTimer();
  askQuestions();
}

function askQuestions() {
  if (currentQuestionIndex >= questions.length) {
    clearInterval(gameTimerInterval);
    endGame();
    return;
  }

  const currentQ = questions[currentQuestionIndex];

  console.log(`Question ${currentQuestionIndex + 1} of ${questions.length}`);
  console.log(`[Time Remaining: ${totalTimeRemaining}s]`);
  console.log(`\n${currentQ.question}`);

  currentQ.options.forEach((option, index) => {
    console.log(`  ${index + 1}) ${option}`);
  });

  rl.question('\nSelect your answer (Enter number): ', (input) => {
    const selection = parseInt(input.trim()) - 1;

    if (isNaN(selection) || selection < 0 || selection >= currentQ.options.length) {
      console.log("Invalid!. Please choose one of the options.");
      askQuestions();
      return;
    }

    // Answer Evaluation
    const isCorrect = selection === currentQ.correctAnswer;
    if (isCorrect) {
      console.log("CORRECT!");
    } else {
      console.log(`INCORRECT! The right answer was: ${currentQ.options[currentQ.correctAnswer]}`);
    }

    userAnswers.push({
      questionText: currentQ.question,
      isCorrect: isCorrect
    });

    currentQuestionIndex++;
    setTimeout(askQuestions, 1000);
  });
}

// End Game!
function endGame() {
  rl.close();
  console.log("GAME OVER!");

  // Check for Marks
  const correctCount = userAnswers.filter(answer => answer.isCorrect).length;

  console.log("\nPerformance Summary:");
  const summaryReport = userAnswers.map((ans, idx) => {
    return `Q${idx + 1}: ${ans.isCorrect ? "Passed" : "Failed"}`;
  });

  summaryReport.forEach(line => console.log(line));

  console.log(`\nFinal Score: ${correctCount} / ${questions.length}`);
  const percentage = Math.round((correctCount / questions.length) * 100);
  console.log(`Success Rate: ${percentage}%`);
}

startGame();
