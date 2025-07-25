// script.js
const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing speed is a skill that improves with practice and consistency over time.",
  "JavaScript is a versatile programming language used for web development, game development, and even mobile apps.",
  "The only way to learn a new programming language is by writing programs in it.",
  "Clean code always looks like it was written by someone who cares.",
  "Programming isn't about what you know; it's about what you can figure out.",
  "The most disastrous thing that you can ever learn is your first programming language.",
  "The best error message is the one that never shows up.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
];

const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const charsEl = document.getElementById("chars");
const totalCharsEl = document.getElementById("totalChars");
const restartBtn = document.getElementById("restart");

let startTime, endTime, currentQuote, timerInterval;
let isTestRunning = false;

function getRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

function displayQuote(quote) {
  quoteEl.innerHTML = '';
  quote.split('').forEach(char => {
    const charSpan = document.createElement('span');
    charSpan.innerText = char;
    quoteEl.appendChild(charSpan);
  });
}

function startTest() {
  currentQuote = getRandomQuote();
  displayQuote(currentQuote);
  inputEl.value = "";
  inputEl.focus();
  isTestRunning = false;
  
  // Reset results
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0%";
  charsEl.textContent = "0";
  totalCharsEl.textContent = currentQuote.length;
  timerEl.textContent = "00:00";
  
  // Clear previous timer if exists
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // Setup input event listener
  inputEl.addEventListener('input', handleInput);
}

function handleInput() {
  if (!isTestRunning) {
    // Start the test on first input
    isTestRunning = true;
    startTime = new Date();
    startTimer();
  }
  
  const inputText = inputEl.value;
  const quoteText = currentQuote;
  
  // Update character count
  charsEl.textContent = inputText.length;
  
  // Highlight characters in quote
  Array.from(quoteEl.children).forEach((charSpan, index) => {
    const inputChar = inputText[index];
    
    // Reset classes
    charSpan.className = '';
    
    if (inputChar == null) {
      // Not typed yet
      if (index === inputText.length) {
        charSpan.classList.add('current'); // Current position
      }
    } else if (inputChar === charSpan.innerText) {
      charSpan.classList.add('correct'); // Correct character
    } else {
      charSpan.classList.add('incorrect'); // Incorrect character
    }
    
    // Set current position
    if (index === inputText.length) {
      charSpan.classList.add('current');
    }
  });
  
  // Check if test is complete
  if (inputText.length === quoteText.length) {
    endTest();
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    timerEl.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function endTest() {
  clearInterval(timerInterval);
  endTime = new Date();
  calculateResults();
  inputEl.removeEventListener('input', handleInput);
}

function calculateResults() {
  const totalTime = (endTime - startTime) / 1000; // in seconds
  const textTyped = inputEl.value;
  const wordCount = textTyped.split(/\s+/).filter(word => word.length > 0).length;
  const wpm = Math.round((wordCount / totalTime) * 60);
  
  // Calculate accuracy
  let correctChars = 0;
  const minLength = Math.min(textTyped.length, currentQuote.length);
  for (let i = 0; i < minLength; i++) {
    if (textTyped[i] === currentQuote[i]) {
      correctChars++;
    }
  }
  const accuracy = ((correctChars / currentQuote.length) * 100).toFixed(2);
  
  wpmEl.textContent = wpm;
  accuracyEl.textContent = `${accuracy}%`;
}

restartBtn.addEventListener('click', startTest);

// Start the test initially
startTest();
