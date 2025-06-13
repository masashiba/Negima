const questions = [
  { img: "images/image1.png", a: "man", placeholder: "半角アルファベット小文字" },
  { img: "images/image2.png", a: "ねぎとろ", placeholder: "全角ひらがな" },
  { img: "images/image3.png", a: "いざよい", placeholder: "全角ひらがな" },
  { img: "images/image4.png", a: "エネルギー", placeholder: "全角カタカナ" },
  { img: "images/image5.png", a: "ビーガン", placeholder: "全角カタカナ" },
  { img: "images/image6.png", a: "たのもしい", placeholder: "全角ひらがな" },
  { img: "images/image7.png", a: "ぽ", placeholder: "１文字で解答" },
  { img: "images/image8.png", a: "ひきにく", placeholder: "全角ひらがな" },
  { img: "images/image9.png", a: "ハンバーグ", placeholder: "全角カタカナ" },
  { img: "images/image10.png", a: "ねぎらい", placeholder: "全角ひらがな" },
  { img: "images/image11.png", a: "いか", placeholder: "全角ひらがな" },
  { img: "images/image12.png", a: "ねぎとろ", placeholder: "全角ひらがな" },
  { img: "images/image13.png", a: "くうき", placeholder: "全角ひらがな" },
  { img: "images/image14.png", a: "ねたぎれ", placeholder: "全角ひらがな" },
  { img: "images/image15.png", a: "シーフ", placeholder: "全角カタカナ" }
];


let current = 0;
let correct = 0;
let interval;
let correctAnswers = [];
let startTime; // クイズ全体開始時間
let questionStartTime; // 現在の問題表示開始時間
let questionTimes = []; // 各問題の滞在時間（秒）
const QUIZ_DURATION = 180; // 制限時間（秒）

function startQuiz() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  current = 0;
  correct = 0;
  correctAnswers = [];
  questionTimes = [];
  startTime = Date.now();
  showQuestion();
  interval = setInterval(updateTimer, 500); // 500ms ごとに残り時間更新
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remaining = QUIZ_DURATION - elapsed;
  document.getElementById("timer").innerText = `残り時間: ${remaining}秒`;

  if (remaining <= 0) {
    clearInterval(interval);
    endQuiz();
  }
}

function showQuestion() {
  if (current >= questions.length) {
    endQuiz();
    return;
  }
  questionStartTime = Date.now();

  const question = questions[current];
  const container = document.getElementById("question");
  container.innerHTML = `<img src="${question.img}" alt="問題${current + 1}">`;

  const answerInput = document.getElementById("answer");
  answerInput.value = "";
  answerInput.placeholder = question.placeholder || "答えを入力してください";
}

function submitAnswer() {
  const now = Date.now();
  questionTimes[current] = Math.floor((now - questionStartTime) / 1000);

  const userAnswer = document.getElementById("answer").value.trim().toLowerCase();
  const correctAnswer = questions[current].a.toLowerCase();

  if (userAnswer === correctAnswer) {
    correct++;
    correctAnswers.push(current + 1);
    current++;
    showQuestion();
  } else {
    const answerInput = document.getElementById("answer");
    answerInput.classList.add("flash-red");
    setTimeout(() => {
      answerInput.classList.remove("flash-red");
    }, 1000);
    answerInput.value = "";
  }
}

function passQuestion() {
  const now = Date.now();
  questionTimes[current] = Math.floor((now - questionStartTime) / 1000);
  current++;
  showQuestion();
}

function endQuiz() {
  clearInterval(interval);

  // 最後の問題の滞在時間を記録（まだ保存されていない場合）
  if (questionStartTime && questionTimes[current] === undefined) {
    questionTimes[current] = Math.floor((Date.now() - questionStartTime) / 1000);
  }

  const elapsedMs = Date.now() - startTime;
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const min = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const sec = String(elapsedSec % 60).padStart(2, "0");
  const elapsedStr = `${min}:${sec}`;

  document.getElementById("quiz-screen").classList.add("hidden");
  const result = document.getElementById("result");
  result.classList.remove("hidden");

  const correctSet = new Set(correctAnswers);

  let imagesHTML = '<div id="result-images">';
  for (let i = 0; i < questions.length; i++) {
    const isCorrect = correctSet.has(i + 1);
    imagesHTML += `<img src="${questions[i].img}" alt="問題${i + 1}" class="${isCorrect ? "correct" : ""}">`;
  }
  imagesHTML += "</div>";

  let timesHTML = "<ul>";
  for (let i = 0; i < questions.length; i++) {
    const t = questionTimes[i] !== undefined ? questionTimes[i] : 0;
    timesHTML += `<li>問題${i + 1}: ${t}秒</li>`;
  }
  timesHTML += "</ul>";

  const resultText = `
    終了！<br>
    正解数: ${correct} / ${questions.length}<br>
    正解した問題: ${correctAnswers.length > 0 ? correctAnswers.join(", ") : "なし"}<br>
    経過時間: ${elapsedStr}<br><br>
    ${imagesHTML}<br><br>
    <strong>各問題の滞在時間</strong><br>
    ${timesHTML}
  `;
  result.innerHTML = resultText;
}
