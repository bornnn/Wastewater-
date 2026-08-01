let currentQuestionIndex = 0;
let score = 0;
let userAnswers = {}; // 記錄使用者的作答選擇

const questionNumberEl = document.getElementById("question-number");
const questionTitleEl = document.getElementById("question-title");
const optionsListEl = document.getElementById("options-list");
const feedbackBoxEl = document.getElementById("feedback-box");
const feedbackTextEl = document.getElementById("feedback-text");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressText = document.getElementById("progress-text");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const finalScoreEl = document.getElementById("final-score");

function loadQuestion() {
    const currentQ = quizData[currentQuestionIndex];
    questionNumberEl.innerText = `第 ${currentQuestionIndex + 1} 題 / 共 ${quizData.length} 題`;
    questionTitleEl.innerText = currentQ.q;
    progressText.innerText = `進度: ${currentQuestionIndex + 1} / ${quizData.length}`;

    optionsListEl.innerHTML = "";
    feedbackBoxEl.classList.add("hidden");

    currentQ.options.forEach((option, index) => {
        const optionLetter = option.substring(1, 2); // 擷取 (A) 中的 A
        const btn = document.createElement("button");
        btn.className = "option-btn w-full text-left p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 font-medium text-slate-700 flex items-center";
        btn.innerText = option;

        // 如果之前已經答過這題，顯示先前的選擇狀態
        if (userAnswers[currentQuestionIndex] !== undefined) {
            btn.disabled = true;
            if (optionLetter === currentQ.ans) {
                btn.classList.add("bg-green-100", "border-green-400", "text-green-800");
            } else if (optionLetter === userAnswers[currentQuestionIndex]) {
                btn.classList.add("bg-red-100", "border-red-400", "text-red-800");
            }
        } else {
            btn.onclick = () => selectAnswer(optionLetter, btn);
        }

        optionsListEl.appendChild(btn);
    });

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.innerText = currentQuestionIndex === quizData.length - 1 ? "查看結算" : "下一題";
}

function selectAnswer(selectedOption, selectedBtn) {
    const currentQ = quizData[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedOption;

    const allBtns = optionsListEl.querySelectorAll("button");
    allBtns.forEach(btn => {
        btn.disabled = true;
        const btnLetter = btn.innerText.substring(1, 2);
        if (btnLetter === currentQ.ans) {
            btn.classList.add("bg-green-100", "border-green-400", "text-green-800");
        } else if (btnLetter === selectedOption && selectedOption !== currentQ.ans) {
            btn.classList.add("bg-red-100", "border-red-400", "text-red-800");
        }
    });

    feedbackBoxEl.classList.remove("hidden");
    if (selectedOption === currentQ.ans) {
        feedbackBoxEl.className = "mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700";
        feedbackTextEl.innerText = "✔️ 回答正確！";
    } else {
        feedbackBoxEl.className = "mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700";
        feedbackTextEl.innerText = `❌ 回答錯誤！正確答案是：(${currentQ.ans})`;
    }
}

nextBtn.onclick = () => {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        // 計算總分
        score = 0;
        quizData.forEach((q, idx) => {
            if (userAnswers[idx] === q.ans) score++;
        });
        quizContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden");
        finalScoreEl.innerText = `${score} / ${quizData.length} (得分: ${Math.round((score / quizData.length) * 100)})`;
    }
};

prevBtn.onclick = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
};

// 初始化載入第一題
loadQuestion();
