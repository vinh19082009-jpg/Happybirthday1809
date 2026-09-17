const giftContainer = document.getElementById("giftContainer");
const giftBox = document.getElementById("giftBox");
const boxBody = document.getElementById("boxBody");
const hintText = document.getElementById("hintText");
const numflower = 6;

function createFloatingStars() {
  const count = 40;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("bg-star");

    const size = Math.random() * 4 + 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;

    star.style.setProperty("--dur", `${(Math.random() * 4 + 3).toFixed(1)}s`);
    star.style.setProperty("--delay", `${(Math.random() * 5).toFixed(1)}s`);
    star.style.setProperty(
      "--op",
      `${(Math.random() * 0.45 + 0.25).toFixed(2)}`,
    );
    star.style.setProperty("--dx", `${(Math.random() * 28 - 14).toFixed(0)}px`);
    star.style.setProperty("--dy", `${(Math.random() * 28 - 14).toFixed(0)}px`);

    document.body.appendChild(star);
  }
}
createFloatingStars();

const imageList = [];
const gifList = [
  "https://i.pinimg.com/originals/bc/33/f3/bc33f3bc72f43ca1045b7c4f98dc760d.gif",
  "https://i.pinimg.com/originals/33/76/db/3376dbdfc1b6e8b71a2ea7353e4fc0f2.gif",
  "https://i.pinimg.com/originals/6a/ec/ee/6aecee875e4844f34a1539054bf8aa8a.gif",
  "https://i.pinimg.com/originals/1d/ea/fb/1deafb64c0c0c1c64700548be28c1a0f.gif",
  "https://i.pinimg.com/originals/c2/22/bf/c222bf9ed4b952db2259dd39f98a97a1.gif",
  "https://i.pinimg.com/originals/5c/f8/49/5cf849f45bad6a929714a2409b51d75f.gif",
  "https://i.pinimg.com/originals/45/c9/a6/45c9a6bc85a1af62e70b1da357d1a3cb.gif",
  "https://i.pinimg.com/originals/74/7d/d5/747dd59381484e52d37fb5ed2988115a.gif",
  "https://i.pinimg.com/originals/ae/4d/b2/ae4db26185faa3877723c5914dd91523.gif",
];

for (let i = 1; i <= 10; i++) {
  if (Math.random() < 0.6) {
    imageList.push(`./style/image/Anh (${i}).jpg`);
  } else {
    const gif = gifList[Math.floor(Math.random() * gifList.length)];
    imageList.push(gif);
  }
}
let letterTypingState = null;
let balloonsRunning = false;
let isUnlocked = false;
let bearInterval = null;
let fallingItems = [];

function showPasscodeModal(onSuccess, onCancel) {
  if (isUnlocked) {
    if (onSuccess) onSuccess();
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("passcode-modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("passcode-modal");

  const closeBtn = document.createElement("button");
  closeBtn.className = "passcode-modal-close";
  closeBtn.textContent = "✕";

  const title = document.createElement("div");
  title.className = "passcode-title";
  title.textContent = "Nhập mật khẩu";

  const inputsContainer = document.createElement("div");
  inputsContainer.className = "passcode-inputs";

  const inputs = [];
  for (let i = 0; i < 4; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.maxLength = 1;
    input.className = "passcode-box";
    inputsContainer.appendChild(input);
    inputs.push(input);
  }

  const hint = document.createElement("div");
  hint.className = "passcode-hint";
  hint.textContent = "Sinh nhật cậu";

  modal.appendChild(closeBtn);
  modal.appendChild(title);
  modal.appendChild(inputsContainer);
  modal.appendChild(hint);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  setTimeout(() => inputs[0].focus(), 300);

  function checkPasscode() {
    const entered = inputs.map((inp) => inp.value).join("");
    if (entered.length === 4) {
      if (entered === "1809") {
        isUnlocked = true;
        overlay.style.animation = "overlayFadeOut 0.35s ease forwards";
        modal.style.animation = "letterModalOut 0.3s ease forwards";
        setTimeout(() => {
          overlay.remove();
          if (onSuccess) onSuccess();
        }, 350);
      } else {
        modal.classList.add("shake");
        inputs.forEach((inp) => inp.classList.add("error"));
        setTimeout(() => {
          modal.classList.remove("shake");
          inputs.forEach((inp) => {
            inp.value = "";
            inp.classList.remove("error");
          });
          inputs[0].focus();
        }, 500);
      }
    }
  }

  inputs.forEach((input, idx) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = val;
      if (val && idx < 3) {
        inputs[idx + 1].focus();
      }
      checkPasscode();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim();
      if (/^\d{4}$/.test(pasteData)) {
        pasteData.split("").forEach((char, i) => {
          inputs[i].value = char;
        });
        inputs[3].focus();
        checkPasscode();
      }
    });
  });

  function closeModal() {
    overlay.style.animation = "overlayFadeOut 0.35s ease forwards";
    modal.style.animation = "letterModalOut 0.3s ease forwards";
    setTimeout(() => {
      overlay.remove();
      if (onCancel) onCancel();
    }, 350);
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

function startLetterFallingEffects() {
  const W = window.innerWidth;
  const H = window.innerHeight;

  // 1. Rơi 1 đến 2 bông hoa xuống quanh lá thư
  const numFlowersToDrop = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < numFlowersToDrop; i++) {
    setTimeout(() => {
      const flower = document.createElement("img");
      const fIdx = Math.floor(Math.random() * numflower) + 1;
      flower.src = `./style/flower/Anh (${fIdx}).png`;
      flower.classList.add("falling-letter-item");

      const fSize = 65 + Math.random() * 50;
      const startX = W / 2 + (Math.random() - 0.5) * 320;
      flower.style.cssText += `
        width: ${fSize}px;
        height: ${fSize}px;
        left: ${startX}px;
        top: 0px;
        opacity: 0.95;
      `;
      document.body.appendChild(flower);
      fallingItems.push(flower);

      const fDx = (Math.random() - 0.5) * 180;
      const duration = 3800 + Math.random() * 2200;
      const rot = Math.random() * 360 - 180;

      const anim = flower.animate(
        [
          { transform: "translate(-50%, -100%) rotate(0deg)", opacity: 0.95 },
          { transform: `translate(calc(-50% + ${fDx}px), calc(${H}px + 100%)) rotate(${rot}deg)`, opacity: 0.3 },
        ],
        { duration, easing: "ease-in-out", fill: "forwards" }
      );
      anim.finished.then(() => flower.remove());
    }, i * 700);
  }

  // 2. Gấu ngẫu nhiên rơi xuống liên tục
  const bearList = [
    "./style/bear/bear (1).png",
    "./style/bear/bear (2).png",
    "./style/bear/bear (3).png",
    "./style/bear/bear (4).png",
  ];

  function dropBear() {
    const bear = document.createElement("img");
    const bSrc = bearList[Math.floor(Math.random() * bearList.length)];
    bear.src = bSrc;
    bear.classList.add("falling-letter-item");

    const bSize = 70 + Math.random() * 45;
    const startX = Math.max(60, Math.min(W - 60, W / 2 + (Math.random() - 0.5) * (W * 0.75)));
    bear.style.cssText += `
      width: ${bSize}px;
      height: ${bSize}px;
      left: ${startX}px;
      top: 0px;
      opacity: 0.95;
    `;
    document.body.appendChild(bear);
    fallingItems.push(bear);

    const bDx = (Math.random() - 0.5) * 140;
    const duration = 4800 + Math.random() * 2500;
    const rot = Math.random() * 40 - 20;

    const anim = bear.animate(
      [
        { transform: "translate(-50%, -100%) rotate(0deg)", opacity: 0.95 },
        { transform: `translate(calc(-50% + ${bDx}px), calc(${H}px + 100%)) rotate(${rot}deg)`, opacity: 0.6 },
      ],
      { duration, easing: "ease-out", fill: "forwards" }
    );
    anim.finished.then(() => bear.remove());
  }

  dropBear();
  if (bearInterval) clearInterval(bearInterval);
  bearInterval = setInterval(dropBear, 2400);
}

function stopLetterFallingEffects() {
  if (bearInterval) {
    clearInterval(bearInterval);
    bearInterval = null;
  }
}

function showLetterModal(text, onClose) {
  const lines = text
    .trim()
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => l.trim());

  if (!letterTypingState) {
    letterTypingState = { lines, lineIdx: 0, charIdx: 0, isComplete: false };
  }

  const state = letterTypingState;
  const overlay = document.createElement("div");
  overlay.classList.add("letter-modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("letter-modal");

  // Hoa mờ làm nền bức thư (1-2 bông)
  const bgFlower1 = document.createElement("img");
  bgFlower1.src = `./style/flower/Anh (${Math.floor(Math.random() * numflower) + 1}).png`;
  bgFlower1.classList.add("letter-bg-flower", "letter-bg-flower-1");
  modal.appendChild(bgFlower1);

  const bgFlower2 = document.createElement("img");
  bgFlower2.src = `./style/flower/Anh (${Math.floor(Math.random() * numflower) + 1}).png`;
  bgFlower2.classList.add("letter-bg-flower", "letter-bg-flower-2");
  modal.appendChild(bgFlower2);

  const body = document.createElement("div");
  body.classList.add("letter-modal-body");

  const paragraphs = lines.map(() => {
    const p = document.createElement("p");
    body.appendChild(p);
    return p;
  });

  for (let i = 0; i < state.lineIdx; i++) {
    paragraphs[i].textContent = state.lines[i];
  }

  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  cursor.textContent = "💖";

  if (!state.isComplete && state.lineIdx < lines.length) {
    const p = paragraphs[state.lineIdx];
    p.textContent = state.lines[state.lineIdx].substring(0, state.charIdx);
    p.appendChild(cursor);
  } else if (state.isComplete) {
    for (let i = state.lineIdx; i < lines.length; i++) {
      paragraphs[i].textContent = state.lines[i];
    }
  }

  const closeBtn = document.createElement("button");
  closeBtn.className = "letter-modal-close";
  closeBtn.textContent = "✕";

  modal.appendChild(closeBtn);
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  shootBalloons();

  let typingTimer = null;

  function typeNext() {
    if (state.isComplete) return;
    if (state.lineIdx >= state.lines.length) {
      state.isComplete = true;
      cursor.remove();
      return;
    }

    const p = paragraphs[state.lineIdx];
    const line = state.lines[state.lineIdx];

    if (state.charIdx < line.length) {
      state.charIdx++;
      p.textContent = line.substring(0, state.charIdx);
      p.appendChild(cursor);
      if (state.charIdx % 6 === 0) cursor.scrollIntoView({ block: "nearest" });
      typingTimer = setTimeout(typeNext, 28 + Math.random() * 38);
    } else {
      p.textContent = line;
      state.lineIdx++;
      state.charIdx = 0;
      if (state.lineIdx < state.lines.length) {
        const nextP = paragraphs[state.lineIdx];
        nextP.appendChild(cursor);
        nextP.scrollIntoView({ block: "nearest" });
        typingTimer = setTimeout(typeNext, 230);
      } else {
        state.isComplete = true;
        cursor.remove();
      }
    }
  }

  function stopTyping() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    cursor.remove();
  }

  if (!state.isComplete) {
    typingTimer = setTimeout(typeNext, 300);
  }

  function closeModal() {
    stopTyping();
    overlay.style.animation = "overlayFadeOut 0.4s ease forwards";
    modal.style.animation = "letterModalOut 0.35s ease forwards";
    setTimeout(() => {
      overlay.remove();
      if (onClose) onClose(state.isComplete);
    }, 420);
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

function showLetter() {
  const letter = document.createElement("img");
  letter.src = "./style/letter.png";
  letter.style.cssText = `
    position: fixed;
    left: 50%;
    top: 50%;
    width: clamp(130px, 22vw, 260px);
    cursor: pointer;
    z-index: 600;
    opacity: 0;
    pointer-events: none;
    filter: drop-shadow(0 10px 30px rgba(200, 80, 150, 0.55));
  `;
  document.body.appendChild(letter);

  let floatAnim = null;
  let modalOpen = false;
  let balloonsOn = false;
  let miniIcon = null;

  const textPromise = fetch("./style/letter.txt")
    .then((r) => r.text())
    .catch(() => "Không thể đọc nội dung thư.");

  const flyAnim = letter.animate(
    [
      {
        transform: "translate(-50%, 80vh) scale(0.25) rotate(-12deg)",
        opacity: 0,
      },
      {
        transform: "translate(-50%, -55%) scale(1.1) rotate(4deg)",
        opacity: 1,
        offset: 0.72,
      },
      {
        transform: "translate(-50%, -50%) scale(1)   rotate(0deg)",
        opacity: 1,
      },
    ],
    {
      duration: 1900,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    },
  );

  flyAnim.onfinish = () => {
    letter.style.pointerEvents = "auto";
    floatAnim = letter.animate(
      [
        { transform: "translate(-50%, -50%) rotate(-3deg)" },
        { transform: "translate(-50%, calc(-50% - 14px)) rotate(3deg)" },
        { transform: "translate(-50%, -50%) rotate(-3deg)" },
      ],
      { duration: 3000, easing: "ease-in-out", iterations: Infinity },
    );
    startLetterFallingEffects();
  };

  letter.addEventListener("mouseenter", () => {
    if (!modalOpen)
      letter.style.filter =
        "drop-shadow(0 14px 40px rgba(200, 80, 150, 0.9)) brightness(1.07)";
  });
  letter.addEventListener("mouseleave", () => {
    letter.style.filter = "drop-shadow(0 10px 30px rgba(200, 80, 150, 0.55))";
  });

  // ── Mở modal + xử lý callback đóng ──
  function openModal(text) {
    showLetterModal(text, (typingComplete) => {
      modalOpen = false;
      showMiniIcon(text);
      if (typingComplete && !balloonsOn) {
        balloonsOn = true;
        shootBalloons();
      }
    });
  }

  // ── Icon nhỏ góc dưới phải ──
  function showMiniIcon(text) {
    if (!miniIcon) {
      miniIcon = document.createElement("img");
      miniIcon.src = "./style/letter.png";
      miniIcon.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 58px;
        cursor: pointer;
        z-index: 700;
        opacity: 0;
        transition: opacity 0.25s, transform 0.2s, filter 0.2s;
        filter: drop-shadow(0 4px 14px rgba(200, 80, 150, 0.55));
      `;
      document.body.appendChild(miniIcon);

      miniIcon.animate(
        [
          { opacity: 0, transform: "scale(0.35) rotate(-20deg)" },
          { opacity: 1, transform: "scale(1.1)  rotate(4deg)", offset: 0.72 },
          { opacity: 1, transform: "scale(1)    rotate(0deg)" },
        ],
        { duration: 550, easing: "ease-out", fill: "forwards" },
      );

      miniIcon.addEventListener("mouseenter", () => {
        miniIcon.style.transform = "scale(1.18) rotate(-6deg)";
        miniIcon.style.filter =
          "drop-shadow(0 6px 20px rgba(200, 80, 150, 0.85)) brightness(1.08)";
      });
      miniIcon.addEventListener("mouseleave", () => {
        miniIcon.style.transform = "";
        miniIcon.style.filter =
          "drop-shadow(0 4px 14px rgba(200, 80, 150, 0.55))";
      });

      miniIcon.addEventListener("click", async () => {
        if (modalOpen) return;
        showPasscodeModal(async () => {
          const t = await textPromise;
          modalOpen = true;
          miniIcon.style.opacity = "0.25";
          miniIcon.style.pointerEvents = "none";

          const r = miniIcon.getBoundingClientRect();
          const ox = r.left + r.width / 2;
          const oy = r.top + r.height / 2;

          flowerExplosion(
            () => {
              showLetterModal(t, (typingComplete) => {
                modalOpen = false;
                miniIcon.style.opacity = "1";
                miniIcon.style.pointerEvents = "auto";
                if (typingComplete && !balloonsOn) {
                  balloonsOn = true;
                  shootBalloons();
                }
              });
            },
            ox,
            oy,
          );
        });
      });
    } else {
      miniIcon.style.opacity = "1";
      miniIcon.style.pointerEvents = "auto";
    }
  }

  // ── Click lá thư lớn lần đầu ──
  letter.addEventListener("click", async () => {
    if (modalOpen) return;
    showPasscodeModal(async () => {
      stopLetterFallingEffects();
      const text = await textPromise;
      modalOpen = true;
      letter.style.pointerEvents = "none";

      if (floatAnim) {
        floatAnim.cancel();
        floatAnim = null;
      }

      await letter.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(0.08)", opacity: 0 },
        ],
        { duration: 500, easing: "ease-in", fill: "forwards" },
      ).finished;

      letter.remove();
      const lW = window.innerWidth,
        lH = window.innerHeight;
      flowerExplosion(() => openModal(text), lW / 2, lH / 2);
    });
  });
}


// ── Bắn ảnh từ dưới lên ──
function shootImagesFromBottomToRandomTarget(callback) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  let index = 0;

  const interval = setInterval(() => {
    if (index >= imageList.length) {
      clearInterval(interval);
      if (callback) callback();
      return;
    }

    const src = imageList[index];
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("lava");

    const isLocalImage = src.startsWith("./style/image/");
    if (isLocalImage) {
      const colors = [
        "#ff6b9d",
        "#c44dff",
        "#ffbe0b",
        "#fb5607",
        "#3a86ff",
        "#8338ec",
        "#06d6a0",
        "#ff006e",
        "#f72585",
        "#4cc9f0",
        "#43aa8b",
        "#f9844a",
      ];
      img.classList.add("lava-img");
      img.style.setProperty(
        "--border-color",
        colors[Math.floor(Math.random() * colors.length)],
      );
    } else {
      img.classList.add("lava-gif");
    }

    const baseSize = Math.min(screenWidth * 0.12, 160);
    img.style.width = `${baseSize}px`;
    img.style.height = `${baseSize}px`;

    const startX = screenWidth / 2;
    const startY = screenHeight;
    const targetX = Math.random() * screenWidth;
    const targetY = Math.random() * (screenHeight * 0.55);
    const dx = targetX - startX;
    const dy = targetY - startY;

    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;
    img.style.transform = "translate(-50%, -50%)";

    if (isLocalImage) {
      const finalAngle = Math.floor(Math.random() * 60 - 30); // góc dừng: -30° → +30°
      const spinDir = Math.random() > 0.5 ? 1 : -1; // chiều xoay ngẫu nhiên
      const spins = Math.floor(Math.random() * 2) + 1; // số vòng: 1 hoặc 2
      const totalRot = spinDir * (spins * 360) + finalAngle;
      const midRot = spinDir * (spins * 360 * 0.8); // 80% vòng xoay ở điểm giữa
      const duration = 3800 + Math.random() * 1800; // 3.8s → 5.6s

      img.animate(
        [
          {
            transform: `translate(-50%, -50%) translate(0, 0) scale(0.15) rotate(0deg)`,
            opacity: 0.6,
            offset: 0,
          },
          {
            transform: `translate(-50%, -50%) translate(${dx * 0.5}px, ${dy * 0.55}px) scale(1.05) rotate(${midRot}deg)`,
            opacity: 1,
            offset: 0.52,
          },
          {
            transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(1.25) rotate(${totalRot}deg)`,
            opacity: 0,
            offset: 1,
          },
        ],
        {
          duration,
          easing: "ease-out",
          fill: "forwards",
        },
      );
    } else {
      img.animate(
        [
          {
            transform: `translate(-50%, -50%) translate(0, 0) scale(0.15)`,
            opacity: 0.6,
          },
          {
            transform: `translate(-50%, -50%) translate(${dx * 0.5}px, ${dy * 0.55}px) scale(1.05)`,
            opacity: 1,
          },
          {
            transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(1.25)`,
            opacity: 0,
          },
        ],
        {
          duration: 3800,
          easing: "ease-out",
          fill: "forwards",
        },
      );
    }

    document.body.appendChild(img);
    setTimeout(() => img.remove(), 4000);
    index++;
  }, 700);
}

// ── Bong bóng ảnh (sau khi đọc thư) ──
function shootBalloons() {
  if (balloonsRunning) return;
  balloonsRunning = true;

  const W = window.innerWidth;
  const H = window.innerHeight;
  const images = imageList.filter((s) => s.startsWith("./style/image/"));
  const svgNS = "http://www.w3.org/2000/svg";

  const balloonColors = [
    "#ff6b9d",
    "#c44dff",
    "#ffbe0b",
    "#fb5607",
    "#3a86ff",
    "#8338ec",
    "#06d6a0",
    "#ff006e",
    "#f72585",
    "#4cc9f0",
    "#43aa8b",
    "#f9844a",
    "#ff9a3c",
    "#a0c4ff",
    "#bdb2ff",
    "#ffd6a5",
  ];

  const stringPalette = [
    "rgba(255,107,157,0.8)",
    "rgba(196,77,255,0.8)",
    "rgba(255,190,11,0.9)",
    "rgba(251,86,7,0.8)",
    "rgba(58,134,255,0.8)",
    "rgba(131,56,236,0.8)",
    "rgba(6,214,160,0.8)",
    "rgba(247,37,133,0.8)",
    "rgba(255,154,60,0.8)",
    "rgba(76,201,240,0.8)",
  ];

  const numCols = Math.max(4, Math.floor(W / 170));
  const colW = W / numCols;
  let colIdx = 0;
  let imgIdx = 0;

  setInterval(() => {
    // Kích thước đa dạng: nhỏ (55px) → lớn (155px)
    const size = 55 + Math.random() * 100;
    const aspectRatio = 1.05 + Math.random() * 0.25;
    const bodyH = size * aspectRatio;
    const borderColor =
      balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const borderW = 2 + Math.random() * 5;

    // Sợi dây: màu, độ dày, chiều dài ngẫu nhiên
    const strH = 35 + Math.random() * 75;
    const stringColor =
      stringPalette[Math.floor(Math.random() * stringPalette.length)];
    const stringW = (0.8 + Math.random() * 2.5).toFixed(1);

    const floatDur = 5500 + Math.random() * 6500;

    // Vị trí theo cột, jitter nhỏ
    const col = colIdx % numCols;
    const centX = colW * col + colW / 2;
    const jitter = (Math.random() - 0.5) * colW * 0.4;
    const leftX = Math.max(
      size / 2,
      Math.min(W - size * 1.5, centX + jitter - size / 2),
    );
    colIdx++;

    // Bay ngẫu nhiên: drift ngang + lắc lư hình sin
    const driftX = (Math.random() - 0.5) * 220;
    const swayAmp = 12 + Math.random() * 38;
    const swayFreq = 1.5 + Math.random() * 3;

    // ── Wrapper ──
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      position: fixed;
      left: ${leftX}px;
      top: ${H + 10}px;
      pointer-events: auto;
      cursor: pointer;
      user-select: none;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    // ── Thân bong bóng ──
    const body = document.createElement("div");
    body.style.cssText = `
      width: ${size}px;
      height: ${bodyH}px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: ${borderW}px solid ${borderColor};
      box-shadow:
        inset -8px -8px 18px rgba(0,0,0,0.13),
        inset 7px 7px 16px rgba(255,255,255,0.28),
        0 8px 28px rgba(0,0,0,0.2),
        0 0 14px ${borderColor}99;
    `;
    const img = document.createElement("img");
    img.src = images[imgIdx % images.length];
    img.style.cssText =
      "width:100%;height:100%;object-fit:cover;display:block;";
    body.appendChild(img);
    imgIdx++;

    // ── Nút thắt (khớp màu viền) ──
    const knot = document.createElement("div");
    knot.style.cssText = `
      width: 0; height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 10px solid ${borderColor};
      margin: 2px auto 0;
      flex-shrink: 0;
      opacity: 0.8;
    `;

    // ── Sợi dây SVG ──
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 20 ${strH}`);
    svg.setAttribute("width", "20");
    svg.setAttribute("height", `${strH}`);
    svg.style.cssText = "display:block;margin:0 auto;overflow:visible;";

    const path = document.createElementNS(svgNS, "path");
    const q1x = (13 + Math.random() * 5).toFixed(1);
    const q2x = (7 - Math.random() * 5).toFixed(1);
    path.setAttribute(
      "d",
      `M10,0 Q${q1x},${(strH * 0.3).toFixed(1)} ${q2x},${(strH * 0.6).toFixed(1)} ` +
      `Q${q1x},${(strH * 0.85).toFixed(1)} 10,${strH.toFixed(1)}`,
    );
    path.setAttribute("stroke", stringColor);
    path.setAttribute("stroke-width", stringW);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);

    wrap.appendChild(body);
    wrap.appendChild(knot);
    wrap.appendChild(svg);
    document.body.appendChild(wrap);

    // ── Bay lên ngẫu nhiên: lắc lư hình sin + drift ngang ──
    const totalUp = H + bodyH + strH + 60;
    const steps = 24;
    const frames = [];
    for (let s = 0; s <= steps; s++) {
      const p = s / steps;
      const tY = -totalUp * p;
      const tX = Math.sin(p * Math.PI * swayFreq) * swayAmp + driftX * p;
      frames.push({
        transform: `translateX(${tX.toFixed(1)}px) translateY(${tY.toFixed(1)}px)`,
        offset: p,
      });
    }

    const floatAnim = wrap.animate(frames, {
      duration: floatDur,
      easing: "linear",
      fill: "forwards",
    });
    const autoRemove = setTimeout(() => wrap.remove(), floatDur + 200);

    // ── Click: vỡ bong bóng → hoa rơi ──
    const flowerSrcs = [];
    for (let i = 1; i <= numflower; i++) {
      flowerSrcs.push(`./style/flower/Anh (${i}).png`);
    }

    wrap.addEventListener("click", () => {
      // Vị trí hiện tại của tâm bong bóng
      const rect = body.getBoundingClientRect();
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;

      // Dừng bay, huỷ auto-remove
      floatAnim.cancel();
      clearTimeout(autoRemove);
      wrap.remove();

      // Bong bóng phồng to rồi tan
      const ghost = document.createElement("div");
      ghost.style.cssText = `
        position:fixed; left:${bx}px; top:${by}px;
        width:${size}px; height:${bodyH}px;
        border-radius:50%; pointer-events:none; z-index:900;
        border:${borderW}px solid ${borderColor};
        box-shadow:0 0 22px ${borderColor};
        transform:translate(-50%,-50%);
      `;
      document.body.appendChild(ghost);
      ghost
        .animate(
          [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 0.85 },
            { transform: "translate(-50%,-50%) scale(1.9)", opacity: 0 },
          ],
          { duration: 320, easing: "ease-out", fill: "forwards" },
        )
        .finished.then(() => ghost.remove());

      // Tia sáng bắn ra
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const dist = 45 + Math.random() * 55;
        const spark = document.createElement("div");
        spark.style.cssText = `
          position:fixed; left:${bx}px; top:${by}px;
          width:${6 + Math.random() * 5}px; height:${6 + Math.random() * 5}px;
          border-radius:50%; background:${borderColor};
          pointer-events:none; z-index:900;
          transform:translate(-50%,-50%);
        `;
        document.body.appendChild(spark);
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        spark
          .animate(
            [
              { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
              {
                transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`,
                opacity: 0,
              },
            ],
            {
              duration: 380 + Math.random() * 180,
              easing: "ease-out",
              fill: "forwards",
            },
          )
          .finished.then(() => spark.remove());
      }

      // Hoa xuất hiện rồi rơi xuống
      const flower = document.createElement("img");
      flower.src = flowerSrcs[Math.floor(Math.random() * flowerSrcs.length)];
      const fSize = 70 + Math.random() * 60;
      flower.style.cssText = `
        position:fixed; left:${bx}px; top:${by}px;
        width:${fSize}px; height:${fSize}px;
        object-fit:contain; pointer-events:none; z-index:899;
        transform:translate(-50%,-50%);
      `;
      document.body.appendChild(flower);

      const fRot = Math.random() * 360 - 180;
      const fDx = (Math.random() - 0.5) * 120;
      const fDy = window.innerHeight - by + 80;

      flower
        .animate(
          [
            {
              transform: `translate(-50%,-50%) scale(0.2) rotate(0deg)`,
              opacity: 0,
              offset: 0,
            },
            {
              transform: `translate(calc(-50% + ${fDx * 0.2}px),calc(-50% - 30px)) scale(1.1) rotate(${fRot * 0.2}deg)`,
              opacity: 1,
              offset: 0.18,
            },
            {
              transform: `translate(calc(-50% + ${fDx}px),calc(-50% + ${fDy}px)) scale(0.65) rotate(${fRot}deg)`,
              opacity: 0,
              offset: 1,
            },
          ],
          {
            duration: 1600 + Math.random() * 700,
            easing: "cubic-bezier(0.28, 0, 1, 0.85)",
            fill: "forwards",
          },
        )
        .finished.then(() => flower.remove());
    });
  }, 800);
}

function flowerExplosion(onCovered, originX, originY) {
  const srcs = [];
  for (let i = 1; i <= numflower; i++) {
    srcs.push(`./style/flower/Anh (${i}).png`);
  }

  const W = window.innerWidth;
  const H = window.innerHeight;
  let cx, cy;
  if (originX !== undefined) {
    cx = originX;
    cy = originY;
  } else {
    document.querySelector(".scene").style.zIndex = "9999";
    const boxRect = document.getElementById("boxBody").getBoundingClientRect();
    cx = boxRect.left + boxRect.width / 2;
    cy = boxRect.top + boxRect.height / 2;
  }

  const isLarge = W >= 1280;
  const COLS = Math.ceil(W / (isLarge ? 175 : 120));
  const ROWS = Math.ceil(H / (isLarge ? 155 : 105));
  const PER_CELL = isLarge ? 4 : 5;
  const cellW = W / COLS;
  const cellH = H / ROWS;

  const DRIFT_DUR = 750; // trồi chậm từ hộp (có delay ngẫu nhiên)
  const SHOOT_DUR = 800; // bắn nhanh ra màn hình (đồng loạt, không delay)
  const HOLD = 450; // giữ trên màn hình
  const FALL_DUR = 1600; // rơi xuống
  const MAX_DELAY = 380; // delay chỉ áp cho giai đoạn trồi chậm

  let idx = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      for (let k = 0; k < PER_CELL; k++) {
        const img = document.createElement("img");
        img.src = srcs[idx % srcs.length];
        idx++;

        const size =
          W >= 1280
            ? 160 + Math.random() * 140
            : 110 + Math.random() * 110;
        const delay = Math.random() * MAX_DELAY;
        const rot1 = Math.random() * 600 - 300;
        const rot2 = rot1 + (Math.random() * 360 - 180);
        const tx = col * cellW + Math.random() * cellW;
        const ty = row * cellH + Math.random() * cellH;
        const dx = tx - cx;
        const dy = ty - cy;
        const fallDx = dx + (Math.random() - 0.5) * 160;
        const fallDy = dy + H * (1.1 + Math.random() * 0.55);

        img.style.cssText = `
          position:fixed; left:${cx}px; top:${cy}px;
          width:${size}px; height:${size}px;
          object-fit:contain; pointer-events:none;
          user-select:none; z-index:500; opacity:0;
          transform:translate(-50%,-50%);
        `;
        document.body.appendChild(img);

        const drift = img.animate(
          [
            {
              transform: `translate(-50%,-50%) translate(0,0) scale(0.08) rotate(0deg)`,
              opacity: 0,
            },
            {
              transform: `translate(-50%,-50%) translate(${dx * 0.13}px,${dy * 0.13}px) scale(0.42) rotate(${rot1 * 0.08}deg)`,
              opacity: 1,
            },
          ],
          {
            duration: DRIFT_DUR,
            delay,
            easing: "cubic-bezier(0.6, 0, 0.9, 0.3)",
            fill: "forwards",
          },
        );

        const spray = drift.finished.then(() =>
          img.animate(
            [
              {
                transform: `translate(-50%,-50%) translate(${dx * 0.13}px,${dy * 0.13}px) scale(0.42) rotate(${rot1 * 0.08}deg)`,
                opacity: 1,
                offset: 0,
              },
              {
                transform: `translate(-50%,-50%) translate(${dx * 0.8}px,${dy * 0.8}px) scale(1.22) rotate(${rot1 * 0.7}deg)`,
                opacity: 1,
                offset: 0.72,
              },
              {
                transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(1) rotate(${rot1}deg)`,
                opacity: 1,
                offset: 1,
              },
            ],
            {
              duration: SHOOT_DUR,
              easing: "cubic-bezier(0.05, 0.95, 0.2, 1)",
              fill: "forwards",
            },
          ),
        );

        spray
          .then((a) => a.finished)
          .then(() => {
            img
              .animate(
                [
                  {
                    transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(1) rotate(${rot1}deg)`,
                    opacity: 1,
                    offset: 0,
                  },
                  {
                    transform: `translate(-50%,-50%) translate(${dx + (fallDx - dx) * 0.3}px,${dy + H * 0.1}px) scale(.88) rotate(${rot1 + (rot2 - rot1) * 0.25}deg)`,
                    opacity: 0.85,
                    offset: 0.3,
                  },
                  {
                    transform: `translate(-50%,-50%) translate(${fallDx}px,${fallDy}px) scale(.45) rotate(${rot2}deg)`,
                    opacity: 0,
                    offset: 1,
                  },
                ],
                {
                  duration: FALL_DUR,
                  delay: HOLD,
                  easing: "cubic-bezier(0.28, 0, 1, 0.85)",
                  fill: "forwards",
                },
              )
              .finished.then(() => img.remove());
          });
      }
    }
  }

  setTimeout(() => {
    document.querySelector(".scene").style.zIndex = "1";
  }, MAX_DELAY + DRIFT_DUR);

  setTimeout(onCovered, MAX_DELAY + DRIFT_DUR + SHOOT_DUR + HOLD);
}

giftBox.addEventListener("click", () => {
  giftContainer.classList.add("open");

  if (hintText) {
    hintText.style.animation =
      "hintDisappear 0.7s cubic-bezier(0.4, 0, 1, 1) forwards";
    setTimeout(() => hintText.remove(), 720);
  }

  const audio = document.getElementById("bg-music");
  audio.currentTime = 78;
  audio.play();

  setTimeout(() => giftContainer.classList.add("drop"), 1500);

  setTimeout(() => {
    flowerExplosion(() => {
      startFireworks();
      shootImagesFromBottomToRandomTarget(() => showLetter());
    });
  }, 3500);
});

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let cw, ch;

function resize() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = distance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) this.coordinates.push([this.x, this.y]);
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 5;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 8;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    if (this.targetRadius < 8) this.targetRadius += 0.3;
    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = distance(
      this.sx,
      this.sy,
      this.x + vx,
      this.y + vy,
    );
    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(
      this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1],
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) this.coordinates.push([this.x, this.y]);
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 0.7;
    this.hue = random(0, 360);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= 0) particles.splice(index, 1);
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(
      this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1],
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
  }
}

function createParticles(x, y) {
  let count = 35;
  while (count--) particles.push(new Particle(x, y));
}

function distance(aX, aY, bX, bY) {
  const dx = bX - aX,
    dy = bY - aY;
  return Math.sqrt(dx * dx + dy * dy);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

let fireworks = [];
let particles = [];
let animationFrameId;

function loop() {
  animationFrameId = requestAnimationFrame(loop);
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = "lighter";

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if (fireworks.length < 5) {
    fireworks.push(
      new Firework(cw / 2, ch, random(80, cw - 80), random(50, ch / 2)),
    );
  }
}

function startFireworks() {
  if (!animationFrameId) loop();
}

function stopFireworks() {
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  fireworks = [];
  particles = [];
  ctx.clearRect(0, 0, cw, ch);
}
