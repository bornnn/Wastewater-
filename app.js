let activeQuiz = [];
let currentIndex = 0;
let score = 0;
let isAnswered = false;
let currentChapter = 'ch1';

// 章節對應的教材來源與 GitHub 檔案下載連結設定
const chapterMeta = {
    ch1: { name: "01水污染防治概論與實務", source: "國家環境研究院（國環院）專責人員訓練教材", url: "https://github.com/bornnn/Wastewater-/raw/main/01水污染防治概論與實務練習題(甲乙級).pdf" },
    ch2: { name: "02水污染防治法規簡介", source: "國家環境研究院（國環院）專責人員訓練教材", url: "https://github.com/bornnn/Wastewater-/raw/main/02水污染防治法規簡介練習題(甲乙級).pdf" },
    ch3: { name: "03水污染防治許可申請與檢測申報法規", source: "國家環境研究院（國環院）專責人員訓練教材", url: "https://github.com/bornnn/Wastewater-/raw/main/03水污染防治許可申請與檢測申報法規練習題(甲乙級).pdf" },
    ch4: { name: "04廢(污)水物化處理技術原理與實務", source: "國家環境研究院（國環院）專責人員訓練教材", url: "https://github.com/bornnn/Wastewater-/raw/main/04廢(污)水物化處理技術原理與實務練習題.pdf" },
    ch5: { name: "05廢(污)水生物處理技術與應用", source: "國家環境研究院（國環院）專責人員訓練教材", url: "https://github.com/bornnn/Wastewater-/raw/main/05廢(污)水生物處理技術與應用練習題.pdf" },
    ch6: { name: "06廢水高級處理與水質淨化技術", source: "國家環境研究院（國環院）專責人員訓練教材", url: "https://github.com/bornnn/Wastewater-/raw/main/06廢水高級處理與水質淨化技術練習題.pdf" },
    ch7: { name: "07水污染防治設施操作維護、管理與緊急應變", source: "國家環境研究院（國環院）專責人員訓練教材", url: "https://github.com/bornnn/Wastewater-/raw/main/07水污染防治設施操作維護、管理與緊急應變練習題.pdf" }
};

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
const sourceText = document.getElementById("source-text");
const downloadLink = document.getElementById("download-link");

function initQuiz(chapterKey) {
    currentChapter = chapterKey;
    let selectedData = quizData; // 預設第1章

    if (chapterKey === 'ch1' && typeof quizData !== 'undefined') selectedData = quizData;
    if (chapterKey === 'ch2' && typeof chapter2Data !== 'undefined') selectedData = chapter2Data;
    if (chapterKey === 'ch3' && typeof chapter3Data !== 'undefined') selectedData = chapter3Data;
    if (chapterKey === 'ch4' && typeof chapter4Data !== 'undefined') selectedData = chapter4Data;
    if (chapterKey === 'ch5' && typeof chapter5Data !== 'undefined') selectedData = chapter5Data;
    if (chapterKey === 'ch6' && typeof chapter6Data !== 'undefined') selectedData = chapter6Data;
    if (chapterKey === 'ch7' && typeof chapter7Data !== 'undefined') selectedData = chapter7Data;

    // 更新教材來源與下載按鈕資訊
    if (chapterMeta[chapterKey]) {
        sourceText.innerText = chapterMeta[chapterKey].source;
        downloadLink.href = chapterMeta[chapterKey].url; 
        downloadLink.innerText = `📥 下載 PDF 教材`;
    }

    let defaultCount = 50;
    let targetCount = Math.min(selectedData.length, defaultCount);
    activeQuiz = [...selectedData].sort(() => 0.5 - Math.random()).slice(0, targetCount);

    currentIndex = 0;
    score = 0;

    quizCard.classList.remove("hidden");
    resultCard.classList.add("hidden");

    loadQuestion();
}

function switchChapter(chapterKey) {
    const keys = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'];
    keys.forEach(k => {
        let btn = document.getElementById(`btn-${k}`);
        if (btn) {
            if (k === chapterKey) {
                btn.className = "p-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow";
            } else {
                btn.className = "p-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700";
            }
        }
    });
    initQuiz(chapterKey);
}

function loadQuestion() {
    isAnswered = false;
    feedbackBox.classList.add("hidden");
    nextBtn.classList.add("hidden");
    optionsContainer.innerHTML = "";

    const currentQ = activeQuiz[currentIndex];
    const totalQ = activeQuiz.length;
    
    questionCounter.innerText = `第 ${currentIndex + 1} 題 / 共 ${totalQ} 題`;
    scoreKeeper.innerText = `目前得分: ${score}`;
    let progressPercent = (currentIndex / totalQ) * 100;
    progressBar.style.width = `${progressPercent}%`;

    questionTitle.innerText = currentQ.q;

    currentQ.options.forEach((opt) => {
        let optLetter = opt.substring(1, 2);
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
    let explanation = rationale || "本題對應國家環境研究院甲級專責人員訓練教材規範。";
    let pointsPerQ = Math.round(100 / activeQuiz.length);

    if (selectedLetter === correctAns) {
        score += pointsPerQ;
        scoreKeeper.innerText = `目前得分: ${score}`;
        feedbackBox.className = "mt-6 p-5 rounded-xl bg-green-50 border border-green-200 text-green-800 space-y-2 shadow-sm";
        feedbackText.innerHTML = `<div class="font-bold text-base">✔️ 回答正確！</div><div class="text-sm font-normal text-green-700 mt-2 leading-relaxed">💡 <strong>詳細解析：</strong>${explanation}</div>`;
    } else {
        feedbackBox.className = "mt-6 p-5 rounded-xl bg-red-50 border border-red-200 text-red-800 space-y-2 shadow-sm";
        feedbackText.innerHTML = `<div class="font-bold text-base">❌ 回答錯誤！正確答案是：(${correctAns})</div><div class="text-sm font-normal text-red-700 mt-2 leading-relaxed">💡 <strong>詳細解析：</strong>${explanation}</div>`;
    }

    nextBtn.classList.remove("hidden");
};

nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < activeQuiz.length) {
        loadQuestion();
    } else {
        quizCard.classList.add("hidden");
        resultCard.classList.remove("hidden");
        finalScoreText.innerText = `${score} 分`;
        let correctCount = Math.round(score / (100 / activeQuiz.length));
        let wrongCount = activeQuiz.length - correctCount;
        finalStatsText.innerText = `正確 ${correctCount} 題 / 錯誤 ${wrongCount} 題`;
    }
};

// 初始化載入第一章
initQuiz('ch1');
