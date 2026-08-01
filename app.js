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
    
    questionCounter.innerText = `第 ${currentIndex + 1} 題 / 共 50 題`;
    scoreKeeper.innerText = `目前得分: ${score}`;
    let progressPercent = ((currentIndex) / 50) * 100;
    progressBar.style.width = `${progressPercent}%`;

    questionTitle.innerText = currentQ.q;

    currentQ.options.forEach((opt) => {
        let optLetter = opt.substring(1, 2); // A, B, C, D
        
        let wrapper = document.createElement("div");
        wrapper.className = "space-y-1";

        let btn = document.createElement("button");
        btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 font-medium text-slate-700 transition duration-150 flex items-center shadow-sm";
        btn.innerHTML = `<span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold mr-3 text-sm shrink-0">${optLetter}</span> <span class="flex-grow">${opt.substring(3)}</span>`;
        
        // 建立每個選項專屬的解析區塊（預設隱藏）
        let explainDiv = document.createElement("div");
        explainDiv.className = "text-xs sm:text-sm p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hidden ml-2 mr-2";
        if (currentQ.explanations && currentQ.explanations[optLetter]) {
            explainDiv.innerHTML = `<strong>選項 ${optLetter} 解析：</strong> ${currentQ.explanations[optLetter]}`;
        }

        btn.onclick = () => selectOption(optLetter, btn, currentQ.ans, wrapper);
        
        wrapper.appendChild(btn);
        wrapper.appendChild(explainDiv);
        optionsContainer.appendChild(wrapper);
    });
}

function selectOption(selectedLetter, selectedBtn, correctAns, selectedWrapper) {
    if (isAnswered) return;
    isAnswered = true;

    const allWrappers = optionsContainer.querySelectorAll(".space-y-1");
    
    allWrappers.forEach(wrapper => {
        let btn = wrapper.querySelector("button");
        let explainDiv = wrapper.querySelector("div");
        let letter = btn.querySelector("span").innerText;
        
        btn.disabled = true;
        explainDiv.classList.remove("hidden"); // 顯示所有選項的解析

        if (letter === correctAns) {
            btn.className = "w-full text-left p-4 rounded-xl border border-green-300 bg-green-50 text-green-800 font-medium flex items-center shadow-sm";
            btn.querySelector("span").className = "w-8 h-8 rounded-lg bg-green-200 text-green-800 flex items-center justify-center font-bold mr-3 text-sm shrink-0";
            explainDiv.className = "text-xs sm:text-sm p-3 rounded-lg bg-green-50/80 border border-green-200 text-green-800 ml-2 mr-2";
        } else if (letter === selectedLetter && selectedLetter !== correctAns) {
            btn.className = "w-full text-left p-4 rounded-xl border border-red-300 bg-red-50 text-red-800 font-medium flex items-center shadow-sm";
            btn.querySelector("span").className = "w-8 h-8 rounded-lg bg-red-200 text-red-800 flex items-center justify-center font-bold mr-3 text-sm shrink-0";
            explainDiv.className = "text-xs sm:text-sm p-3 rounded-lg bg-red-50/80 border border-red-200 text-red-800 ml-2 mr-2";
        } else {
            btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-medium flex items-center opacity-60";
            explainDiv.className = "text-xs sm:text-sm p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 ml-2 mr-2 opacity-70";
        }
    });

    feedbackBox.classList.remove("hidden");

    if (selectedLetter === correctAns) {
        score += 2;
        scoreKeeper.innerText = `目前得分: ${score}`;
        feedbackBox.className = "mt-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800";
        feedbackText.innerHTML = `<strong>✔️ 回答正確！</strong> 請參考下方各選項的詳細解析。`;
    } else {
        feedbackBox.className = "mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800";
        feedbackText.innerHTML = `<strong>❌ 回答錯誤！正確答案是：(${correctAns})</strong> 請參考下方各選項的詳細解析。`;
    }

    nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < 50) {
        loadQuestion();
    } else {
        quizCard.classList.add("hidden");
        resultCard.classList.remove("hidden");
        finalScoreText.innerText = `${score} 分`;
        let correctCount = score / 2;
        let wrongCount = 50 - correctCount;
        finalStatsText.innerText = `正確 ${correctCount} 題 / 錯誤 ${wrongCount} 題`;
    }
};

loadQuestion();
