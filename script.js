const wheelsConfig = [
  {
    title: "Mácháč čeká BABE!",
    label: "Destinace",
    options: [], // Naplní se dynamicky z inputu
    background: "url('./images/mapa.jpg')",
    bgType: "cover",
  },
  {
    title: "Jak se tam dostaneme? ✈️",
    label: "Doprava",
    options: [],
    background: "url('./images/doprava.jpg')",
    bgType: "repeat",
  },
  {
    title: "Kde budeme spát? 🏨",
    label: "Ubytování",
    options: [],
    background: "url('./images/spanek.jpg')",
    bgType: "repeat",
  },
  {
    title: "Co tam budeme dělat? 🎲",
    label: "Aktivita",
    options: [],
    background: "url('./images/aktivity.jpg')",
    bgType: "repeat",
  },
];

const finalBackground = "url('./images/mapa.jpg')";
const finalBgType = "cover";

const funPhrases = [
  "Nezapomeň SPF!",
  "Doporučuji vzít si bodyspray.",
  "Máš ráda koně?",
  "Radši se před odjezdem vysprchuj.",
  "Nezapomeň se vykadit.",
];
const colors = [
  "#f43f5e",
  "#3b82f6",
  "#10b981",
  "#eab308",
  "#a855f7",
  "#f97316",
  "#06b6d4",
  "#ec4899",
];

let currentStep = 0;
let currentRotation = 0;
let selections = {};

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const nextBtn = document.getElementById("next-btn");
const resultDiv = document.getElementById("result");
const progressIndicator = document.getElementById("progress-indicator");
const wheelTitle = document.getElementById("wheel-title");

// Nové elementy pro nastavení hry
const setupZone = document.getElementById("setup-zone");
const gameZone = document.getElementById("game-zone");
const finalZone = document.getElementById("final-zone");
const startGameBtn = document.getElementById("start-game-btn");
const resultsBody = document.getElementById("results-body");
const restartBtn = document.getElementById("restart-btn");
const arrowPointer = document.getElementById("wheel-pointer");

// FUNKCE PRO SPRACOVÁNÍ INPUTŮ A START HRY
function startGame() {
  // Vezmeme texty z inputů, rozdělíme čárkou a pročistíme mezery
  wheelsConfig[0].options = document
    .getElementById("input-destinace")
    .value.split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
  wheelsConfig[1].options = document
    .getElementById("input-doprava")
    .value.split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
  wheelsConfig[2].options = document
    .getElementById("input-ubytovani")
    .value.split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
  wheelsConfig[3].options = document
    .getElementById("input-aktivita")
    .value.split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  // Kontrola, aby žádné kolo nezůstalo prázdné
  for (let config of wheelsConfig) {
    if (config.options.length === 0) {
      alert(`Nezadal jsi žádné možnosti pro sekci: ${config.label}!`);
      return;
    }
  }

  // Schováme nastavení, ukážeme hru
  setupZone.hidden = true;
  gameZone.hidden = false;

  // Načteme první kolo
  currentStep = 0;
  selections = {};
  loadWheel(currentStep);
}

function loadWheel(step) {
  const config = wheelsConfig[step];
  document.body.style.backgroundImage = config.background;

  if (config.bgType === "cover") {
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else {
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "300px";
    document.body.style.backgroundPosition = "top left";
  }

  progressIndicator.innerText = `Krok ${step + 1} z ${wheelsConfig.length}`;
  wheelTitle.innerText = config.title;
  resultDiv.innerText = "";

  if (nextBtn) nextBtn.hidden = true;
  if (spinBtn) spinBtn.disabled = false;

  canvas.style.transition = "none";
  currentRotation = 0;
  canvas.style.transform = "rotate(0deg)";
  canvas.offsetHeight;
  canvas.style.transition = "transform 4s cubic-bezier(0.15, 0.85, 0.1, 1)";

  drawWheel(config);
}

function drawWheel(config) {
  const size = canvas.width;
  const center = size / 2;
  const radius = size / 2;
  const arc = (2 * Math.PI) / config.options.length;

  ctx.clearRect(0, 0, size, size);

  config.options.forEach((option, i) => {
    const angle = i * arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, angle, angle + arc);
    ctx.lineTo(center, center);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = "white";
    // Dynamické zmenšení písma, pokud je možností hodně
    const fontSize = config.options.length > 8 ? "13px" : "17px";
    ctx.font = `bold ${fontSize} 'Segoe UI', sans-serif`;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 4;
    ctx.textAlign = "right";
    ctx.translate(center, center);
    ctx.rotate(angle + arc / 2);
    ctx.fillText(option, radius - 25, 6);
    ctx.restore();
  });
}

function spin() {
  if (spinBtn) spinBtn.disabled = true;
  const randomPhrase =
    funPhrases[Math.floor(Math.random() * funPhrases.length)];
  resultDiv.innerText = randomPhrase;
  if (arrowPointer) arrowPointer.classList.add("spinning");

  const currentConfig = wheelsConfig[currentStep];
  const optionsCount = currentConfig.options.length;
  const extraDegrees = Math.floor(Math.random() * 360);
  const finalRotation = 1800 + extraDegrees;

  currentRotation = finalRotation;
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
        if (arrowPointer) arrowPointer.classList.remove("spinning");
        const actualDegrees = currentRotation % 360;
        const adjustedDegrees = (360 - actualDegrees + 270) % 360;
        const index = Math.floor((adjustedDegrees / 360) * optionsCount) % optionsCount;
        
        const winner = currentConfig.options[index];
        selections[currentConfig.label] = winner;
        
        resultDiv.innerText = `🎉 Vylosováno: ${winner}`;
        
        // 🔥 ÚPRAVA TADY: Pokud je to poslední kolo, změníme text tlačítka
        if (nextBtn) {
            if (currentStep === wheelsConfig.length - 1) {
                nextBtn.innerText = "ZOBRAZIT VÝSLEDKY ➔";
            } else {
                nextBtn.innerText = "DALŠÍ LOSOVÁNÍ ➔"; // Vrátíme původní text, pokud by se hra restartovala
            }
            nextBtn.hidden = false;
        }
    }, 4000);
}

function handleNext() {
  currentStep++;
  if (currentStep < wheelsConfig.length) {
    loadWheel(currentStep);
  } else {
    showFinalResults();
  }
}

function showFinalResults() {
  gameZone.hidden = true;
  finalZone.hidden = false;
  document.body.style.backgroundImage = finalBackground;

  if (finalBgType === "cover") {
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
  } else {
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "300px";
  }

  resultsBody.innerHTML = "";
  for (const [category, value] of Object.entries(selections)) {
    const row = document.createElement("tr");
    row.innerHTML = `<td><strong>${category}</strong></td><td>${value}</td>`;
    resultsBody.appendChild(row);
  }
}

function restart() {
    finalZone.hidden = true;
    setupZone.hidden = false; 
    if (nextBtn) nextBtn.innerText = "DALŠÍ LOSOVÁNÍ ➔"; // 🔥 Vrátí výchozí text pro novou hru
}

if (startGameBtn) startGameBtn.addEventListener("click", startGame);
if (spinBtn) spinBtn.addEventListener("click", spin);
if (nextBtn) nextBtn.addEventListener("click", handleNext);
if (restartBtn) restartBtn.addEventListener("click", restart);
