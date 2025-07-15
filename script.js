// Từ vựng mẫu
const vocabulary = [
  { word: "Hello", pronunciation: "/həˈloʊ/", meaning: "Xin chào" },
  {
    word: "Beautiful",
    pronunciation: "/ˈbjuːtɪfəl/",
    meaning: "Đẹp, xinh đẹp",
  },
  { word: "Friendship", pronunciation: "/ˈfrendʃɪp/", meaning: "Tình bạn" },
  {
    word: "Adventure",
    pronunciation: "/ədˈventʃər/",
    meaning: "Cuộc phiêu lưu",
  },
  { word: "Knowledge", pronunciation: "/ˈnɑːlɪdʒ/", meaning: "Kiến thức" },
  { word: "Courage", pronunciation: "/ˈkɜːrɪdʒ/", meaning: "Lòng dũng cảm" },
  { word: "Happiness", pronunciation: "/ˈhæpɪnəs/", meaning: "Hạnh phúc" },
  { word: "Success", pronunciation: "/səkˈses/", meaning: "Thành công" },
  { word: "Challenge", pronunciation: "/ˈtʃælɪndʒ/", meaning: "Thử thách" },
  { word: "Dream", pronunciation: "/driːm/", meaning: "Giấc mơ, ước mơ" },
  { word: "Wisdom", pronunciation: "/ˈwɪzdəm/", meaning: "Trí tuệ" },
  { word: "Opportunity", pronunciation: "/ˌɑːpərˈtuːnəti/", meaning: "Cơ hội" },
  { word: "Creative", pronunciation: "/kriˈeɪtɪv/", meaning: "Sáng tạo" },
  {
    word: "Determination",
    pronunciation: "/dɪˌtɜːrmɪˈneɪʃn/",
    meaning: "Quyết tâm",
  },
  { word: "Inspiration", pronunciation: "/ˌɪnspəˈreɪʃn/", meaning: "Cảm hứng" },
];

// Biến global
let currentCardIndex = 0;
let isFlipped = false;
let streak = 0;
let correctAnswers = 0;
let totalAnswers = 0;
let score = 0;
let currentUser = "";
let players = [];

// Load dữ liệu từ memory
function loadData() {
  const savedData = {
    players: players,
    currentUser: currentUser,
    streak: streak,
    correctAnswers: correctAnswers,
    totalAnswers: totalAnswers,
    score: score,
  };

  if (savedData.players) {
    players = savedData.players;
  }
  if (savedData.currentUser) {
    currentUser = savedData.currentUser;
    document.getElementById("usernameInput").value = currentUser;
    document.querySelector(".user-panel").style.display = "none";
  }
  if (savedData.streak) streak = savedData.streak;
  if (savedData.correctAnswers) correctAnswers = savedData.correctAnswers;
  if (savedData.totalAnswers) totalAnswers = savedData.totalAnswers;
  if (savedData.score) score = savedData.score;

  updateStats();
  updateLeaderboard();
}

// Lưu dữ liệu vào memory
function saveData() {
  // Cập nhật thông tin player hiện tại
  const playerIndex = players.findIndex((p) => p.name === currentUser);
  if (playerIndex !== -1) {
    players[playerIndex] = {
      name: currentUser,
      score: score,
      streak: streak,
      correct: correctAnswers,
      total: totalAnswers,
    };
  }
}

// Thiết lập tên người dùng
function setUsername() {
  const username = document.getElementById("usernameInput").value.trim();
  if (username) {
    currentUser = username;

    // Kiểm tra nếu player đã tồn tại
    const existingPlayer = players.find((p) => p.name === currentUser);
    if (existingPlayer) {
      streak = existingPlayer.streak;
      correctAnswers = existingPlayer.correct;
      totalAnswers = existingPlayer.total;
      score = existingPlayer.score;
    } else {
      // Tạo player mới
      players.push({
        name: currentUser,
        score: 0,
        streak: 0,
        correct: 0,
        total: 0,
      });
    }

    document.querySelector(".user-panel").style.display = "none";
    updateStats();
    updateLeaderboard();
    loadFirstCard();
  }
}

// Tải thẻ đầu tiên
function loadFirstCard() {
  const card = vocabulary[currentCardIndex];
  document.getElementById("word").textContent = card.word;
  document.getElementById("pronunciation").textContent = card.pronunciation;
  document.getElementById("meaning").textContent = "Nhấp vào thẻ để xem nghĩa";
  document.getElementById("flashcard").classList.remove("flipped");
  isFlipped = false;
}

// Lật thẻ
function flipCard() {
  if (!currentUser) return;

  const card = vocabulary[currentCardIndex];
  const flashcard = document.getElementById("flashcard");

  if (!isFlipped) {
    document.getElementById("meaning").textContent = card.meaning;
    flashcard.classList.add("flipped");
    isFlipped = true;
  } else {
    document.getElementById("meaning").textContent =
      "Nhấp vào thẻ để xem nghĩa";
    flashcard.classList.remove("flipped");
    isFlipped = false;
  }
}

// Thẻ tiếp theo
function nextCard() {
  if (!currentUser) return;

  currentCardIndex = (currentCardIndex + 1) % vocabulary.length;
  loadFirstCard();
  updateProgress();
}

// Đánh dấu đúng
function markCorrect() {
  if (!currentUser) return;

  correctAnswers++;
  totalAnswers++;
  streak++;
  score += 10 + streak * 2; // Bonus điểm theo streak

  showCelebration("🎉");
  updateStats();
  saveData();
  updateLeaderboard();

  setTimeout(() => {
    nextCard();
  }, 500);
}

// Đánh dấu sai
function markIncorrect() {
  if (!currentUser) return;

  totalAnswers++;
  streak = 0; // Reset streak
  score = Math.max(0, score - 2); // Trừ điểm nhưng không âm

  showCelebration("💪");
  updateStats();
  saveData();
  updateLeaderboard();

  setTimeout(() => {
    nextCard();
  }, 500);
}

// Cập nhật thống kê
function updateStats() {
  document.getElementById("streakCount").textContent = streak;
  document.getElementById("correctCount").textContent = correctAnswers;
  document.getElementById("totalCount").textContent = totalAnswers;
  document.getElementById("scoreCount").textContent = score;
}

// Cập nhật thanh tiến trình
function updateProgress() {
  const progress = ((currentCardIndex + 1) / vocabulary.length) * 100;
  document.getElementById("progressFill").style.width = progress + "%";
}

// Dữ liệu fake cho leaderboard (chỉ dùng demo, có thể xóa khi dùng thật)
if (players.length === 0) {
  players = [
    {
      name: "Nguyễn Đức Linh",
      score: 1290000,
      streak: 3,
      correct: 12,
      total: 15,
    },
    {
      name: "Trịnh Trần Phương Tuấn",
      score: 95000,
      streak: 100,
      correct: 90,
      total: 14,
    },
    { name: "Khá Bảnh", score: 10080, streak: 90, correct: 80, total: 13 },
    { name: "David Laid", score: 60000, streak: 2, correct: 60, total: 10 },
    { name: "Hồng Tỷ", score: 405000, streak: 0, correct: 40, total: 9 },
  ];
}

// Cập nhật bảng xếp hạng
function updateLeaderboard() {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const leaderboardList = document.getElementById("leaderboardList");

  leaderboardList.innerHTML = "";

  sortedPlayers.forEach((player, index) => {
    const playerItem = document.createElement("div");
    playerItem.className = "player-item";

    const isCurrentUser = player.name === currentUser;
    if (isCurrentUser) {
      playerItem.style.background = "rgba(102, 126, 234, 0.3)";
      playerItem.style.border = "2px solid #667eea";
    }

    playerItem.innerHTML = `
            <div class="player-rank">#${index + 1}</div>
            <div class="player-name">${player.name} ${
      isCurrentUser ? "(Bạn)" : ""
    }</div>
            <div class="player-score">${
              player.score
            } <span class="streak-flame">${
      player.streak > 0 ? "🔥" + player.streak : ""
    }</span></div>
        `;

    leaderboardList.appendChild(playerItem);
  });
}

// Hiển thị celebration
function showCelebration(emoji) {
  const celebration = document.createElement("div");
  celebration.className = "celebration";
  celebration.textContent = emoji;
  document.body.appendChild(celebration);

  setTimeout(() => {
    document.body.removeChild(celebration);
  }, 1000);
}

// Khởi tạo ứng dụng
function init() {
  loadData();
  if (currentUser) {
    document.querySelector(".user-panel").style.display = "none";
    loadFirstCard();
  }
  updateProgress();
}

// Bắt đầu ứng dụng
init();

// Xử lý phím Enter cho input username
document
  .getElementById("usernameInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      setUsername();
    }
  });
