// 🎄 트리 모양 데이터
// 1, 2, 3, 4 -> 별 위치 식별자
const treeTemplate = [
  "*",
  "*1*",
  "*2*3*",
  "*1*4***",
  "*3*2*1*4*",
  "*1***3*2*1*",
  "*2*1*4*3***1*",
  "4*3*2***4*3*2*1*",
  "      |||      ",
  "      |||      ",
];

// 🎨 색상 정보
// BLINK_CHARS = '1', '2', '3', '4' 식별자 사용
const BLINK_CHARS = ["1", "2", "3", "4"];

// COLORS는 각 식별자에 해당하는 고정된 색상을 정의
const COLORS = {
  1: "#ff69b4",
  2: "#2ecc71",
  3: "#f1c40f",
  4: "#3498db",
  "*": "white",
};

const TRUNK_CLASSES = {
  "|": "#FF9BFD",
  "-": "white",
};

// 1. HTML 요소 생성 함수
function createTreeHTML() {
  const container = document.getElementById("tree-container");
  let html = "";

  treeTemplate.forEach((line) => {
    for (const char of line) {
      let span;

      // 모든 별 위치에 'data-char'를 부여하고 출력 문자는 항상 '*'로 고정 🚨🚨🚨
      if (BLINK_CHARS.includes(char) || char === "*") {
        // 아까 정한 각 별의 기본 색 가져오기 (깜박이는 별이면 해당 식별자의 색, 아니면 흰색)
        const baseColor = COLORS[char] || COLORS["*"];

        // span 태그 내부에는 항상 '*'를 넣고,
        // data-char 속성에는 실제 식별자(1,2,3,4 또는 *)를 저장
        span = `<span class="star" data-char="${char}" style="color: ${baseColor}">*</span>`;
      }
      // 밑동
      else if (char === "|" || char === "-") {
        const className = TRUNK_CLASSES[char];
        span = `<span class="trunk-char ${className}">${char}</span>`;
      }
      // 공백
      else {
        span = "&nbsp;";
      }
      html += span;
    }
    html += "\n";
  });
  container.innerHTML = html;
}

// 2. 깜박이는 애니메이션 함수
let step = 0;
function animateTree() {
  const stars = document.querySelectorAll("#tree-container .star");
  const newColors = {};

  // 깜박이는 색상 순환 맵 생성 (Cyclic Shift)
  for (let i = 0; i < BLINK_CHARS.length; i++) {
    const char = BLINK_CHARS[i]; // '1', '2', '3', '4'
    const colorIndex = (step + i) % BLINK_CHARS.length;
    newColors[char] = COLORS[BLINK_CHARS[colorIndex]];
  }

  stars.forEach((star) => {
    const char = star.getAttribute("data-char"); // data-char로 식별자를 가져옴
    if (BLINK_CHARS.includes(char)) {
      // 깜박이는 별 식별자(1,2,3,4)에 해당하는 별의 색상만 변경
      star.style.color = newColors[char];
    }
    // 기본 별('*')은 이 루프에서 변경되지 않고 초기 설정된 흰색을 유지
  });

  // 스텝 증가 및 순환
  step = (step + 1) % BLINK_CHARS.length;
}

// 3. 💬 타이핑 효과 구현
const lyrics = [
  "Oh, I don't want a lot for Christmas",
  "This is all I'm asking for",
  "I just want to see my baby",
  "Standing right outside my door",
  "I just want you for my own",
  "Oh, I just want him for my own",
  "More than you could ever know",
  "Make my wish come true",
  "Baby all I want for Cristmas is you",
];

let lineIndex = 0;
let charIndex = 0;
const lyricsContainer = document.getElementById("lyrics-container");

function typeWriter() {
  if (lineIndex < lyrics.length) {
    const currentLine = lyrics[lineIndex];
    if (charIndex < currentLine.length) {
      lyricsContainer.innerHTML += currentLine.charAt(charIndex);
      charIndex++;
    } else {
      lyricsContainer.innerHTML += "<br>";
      lineIndex++;
      charIndex = 0;
      if (lineIndex < lyrics.length) {
        setTimeout(typeWriter, 500);
        return;
      }
    }
    setTimeout(typeWriter, 80);
  }
}

// --- 실행 ---
document.addEventListener("DOMContentLoaded", () => {
  createTreeHTML(); // 트리를 HTML로 변환하여 삽입

  // 0.5초 간격으로 트리를 깜박
  setInterval(animateTree, 500);

  const audio = document.getElementById("background-music");
  const startMessage = document.getElementById("audio-start-message");

  // 1. 메시지를 클릭 -> 음악을 재생 -> 메시지를 숨김
  startMessage.addEventListener(
    "click",
    () => {
      // 음악 재생 시도
      audio.play().catch((error) => {
        console.error("음악 재생 중 오류 발생:", error);
      });

      // 메시지 숨기기
      startMessage.style.display = "none";

      // 타이핑 바로 ㄱㄱ
      typeWriter();
    },
    { once: true }
  );
});
