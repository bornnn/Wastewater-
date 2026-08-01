// 從 quiz-data.js 中隨機抽 50 題
function getRandomQuestions(arr, count) {
    let shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

let activeQuiz = getRandomQuestions(quizData, 50);
let currentIndex = 0;
let score = 0;
let isAnswered = false;

const questionCounter = document.getElementById("question-counter");
const questionTitle = document.getElementById("question-title");
const optionsContainer = document.getElementById("options-container");
const feedbackBox = document.getElementById("feedback-box");
const feedbackText = document.getElementById("feedback-text");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const scoreKeeper = document.getElementById("score-keeper");

const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("result-card");
const finalScoreText = document.getElementById("final-score-text");
const finalStatsText = document.getElementById("final-stats-text");

function loadQuestion() {
    isAnswered = false;
    feedbackBox.classList.add("hidden");
    nextBtn.classList.add("hidden");
    optionsContainer.innerHTML = "";

    const currentQ = activeQuiz[currentIndex];
    
    // 更新進度
    questionCounter.innerText = `第 ${currentIndex + 1} 題 / 共 50 題`;
    scoreKeeper.innerText = `目前得分: ${score}`;
    let progressPercent = ((currentIndex) / 50) * 100;
    progressBar.style.width = `${progressPercent}%`;

    questionTitle.innerText = currentQ.q;

    // 渲染選項
    currentQ.options.forEach((opt) => {
        let optLetter = opt.substring(1, 2); // 擷取 A, B, C, D
        let btn = document.createElement("button");
        btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 font-medium text-slate-700 transition duration-150 flex items-center shadow-sm";
        btn.innerHTML = `<span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold mr-3 text-sm shrink-0">${optLetter}</span> <span class="flex-grow">${opt.substring(3)}</span>`;
        
        btn.onclick = () => selectOption(optLetter, btn, currentQ.ans, currentQ.rationale);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedLetter, selectedBtn, correctAns, rationale) {
    if (isAnswered) return;
    isAnswered = true;

    const allButtons = optionsContainer.querySelectorAll("button");
    
    allButtons.forEach(btn => {
        let letter = btn.querySelector("span").innerText;
        btn.disabled = true;
        if (letter === correctAns) {
            btn.className = "w-full text-left p-4 rounded-xl border border-green-300 bg-green-50 text-green-800 font-medium flex items-center shadow-sm";
            btn.querySelector("span").className = "w-8 h-8 rounded-lg bg-green-200 text-green-800 flex items-center justify-center font-bold mr-3 text-sm shrink-0";
        } else if (letter === selectedLetter && selectedLetter !== correctAns) {
            btn.className = "w-full text-left p-4 rounded-xl border border-red-300 bg-red-50 text-red-800 font-medium flex items-center shadow-sm";
            btn.querySelector("span").className = "w-8 h-8 rounded-lg bg-red-200 text-red-800 flex items-center justify-center font-bold mr-3 text-sm shrink-0";
        } else {
            btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-medium flex items-center opacity-60";
        }
    });

    feedbackBox.classList.remove("hidden");
    let explanation = rationale || "本題對應水污染防治設施甲級操作維護規範與相關設計標準。";

    if (selectedLetter === correctAns) {
        score += 2; // 50題制，每題2分共100分
        scoreKeeper.innerText = `目前得分: ${score}`;
        feedbackBox.className = "mt-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 space-y-2";
        feedbackText.innerHTML = `<div><strong>✔️ 回答正確！</strong></div><div class="text-sm font-normal text-green-700 mt-1">💡 <strong>詳細解析：</strong>${explanation}</div>`;
    } else {
        feedbackBox.className = "mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 space-y-2";
        feedbackText.innerHTML = `<div><strong>❌ 回答錯誤！正確答案是：(${correctAns})</strong></div><div class="text-sm font-normal text-red-700 mt-1">💡 <strong>詳細解析：</strong>${explanation}</div>`;
    }

    nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < 50) {
        loadQuestion();
    } else {
        // 顯示結算畫面
        quizCard.classList.add("hidden");
        resultCard.classList.remove("hidden");
        finalScoreText.innerText = `${score} 分`;
        let correctCount = score / 2;
        let wrongCount = 50 - correctCount;
        finalStatsText.innerText = `正確 ${correctCount} 題 / 錯誤 ${wrongCount} 題`;
    }
};

// 初始化載入
loadQuestion();
