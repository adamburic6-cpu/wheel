const wheelsConfig = [
  {
    title: "Mácháč čeká BABE!",
    label: "Destinace",
    options: [
      "Itálie 🍕",
      "Island 🌋",
      "Japonsko 🍣",
      "Španělsko ☀️",
      "Norsko 🌲",
      "Mácháč 🏖️",
    ],
    background: "url('images/mapa.jpg')",
    bgType: "cover", // 🔥 První kolo: velká mapa přes celou obrazovku
  },
  {
    title: "Jak se tam dopravím? ✈️",
    label: "Doprava",
    options: [
      "Letadlo ✈️",
      "Vlastní auto 🚗",
      "Vlak 🚂",
      "Stopem 👍",
      "Na kole 🚲",
      "Pěšky 🥾",
    ],
    background: "url('images/doprava.jpg')",
    bgType: "repeat", // 🐾 Ostatní kola: opakující se tapeta
  },
  {
    title: "Kde budu spát? 🏨",
    label: "Ubytování",
    options: [
      "5* Hotel 🌟",
      "Stan v lese ⛺",
      "AirBnB byt 🏢",
      "Couchsurfing 🛋️",
      "Pod širákem 🌌",
      "Karavan 🚐",
    ],
    background: "url('images/spanek.jpg')",
    bgType: "repeat",
  },
  {
    title: "Co tam budu dělat? 🎲",
    label: "Aktivita",
    options: [
      "Ležet na pláži 🏖️",
      "Túry po horách 🥾",
      "Gastro zážitky 🍔",
      "Ztratit se v městě 🏙️",
      "Chytat bronz ☀️",
      "Fotit památky 📸",
    ],
    background: "url('images/aktivity.jpg')",
    bgType: "repeat",
  },
];

// Závěrečná tabulka (zde si zvol podle sebe buď "repeat" nebo "cover")
const finalBackground =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Ccircle cx='40' cy='40' r='10'/%3E%3Ccircle cx='0' cy='0' r='10'/%3E%3Ccircle cx='80' cy='0' r='10'/%3E%3Ccircle cx='0' cy='80' r='10'/%3E%3Ccircle cx='80' cy='80' r='10'/%3E%3C/g%3E%3C/svg%3E\"), linear-gradient(135deg, #1e1b4b 0%, #311042 100%)";
const finalBgType = "repeat";

const funPhrases = [
  "Nezapomeň SPF!",
  "Doporučuji si vzít bodyspray.",
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
const gameZone = document.getElementById("game-zone");
const finalZone = document.getElementById("final-zone");
const resultsBody = document.getElementById("results-body");
const restartBtn = document.getElementById("restart-btn");
const arrowPointer = document.getElementById("wheel-pointer");

function loadWheel(step) {
  const config = wheelsConfig[step];

  // Nastavení obrázku
  document.body.style.backgroundImage = config.background;

  // 🔥 CHYTRÉ PŘEPÍNÁNÍ PODLE BG-TYPE
  if (config.bgType === "cover") {
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else {
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "300px"; // Velikost pro opakující se vzory
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
    ctx.font = "bold 18px 'Segoe UI', sans-serif";
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 4;
    ctx.textAlign = "right";
    ctx.translate(center, center);
    ctx.rotate(angle + arc / 2);
    ctx.fillText(option, radius - 30, 6);
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
    const index =
      Math.floor((adjustedDegrees / 360) * optionsCount) % optionsCount;

    const winner = currentConfig.options[index];
    selections[currentConfig.label] = winner;

    resultDiv.innerText = `🎉 Vylosováno: ${winner}`;
    if (nextBtn) nextBtn.hidden = false;
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
  if (gameZone) gameZone.hidden = true;
  if (progressIndicator) progressIndicator.hidden = true;
  if (wheelTitle) wheelTitle.hidden = true;
  if (finalZone) finalZone.hidden = false;

  document.body.style.backgroundImage = finalBackground;

  // Nastavení typu pro finální scénu
  if (finalBgType === "cover") {
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else {
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "300px";
    document.body.style.backgroundPosition = "top left";
  }

  resultsBody.innerHTML = "";
  for (const [category, value] of Object.entries(selections)) {
    const row = document.createElement("tr");
    row.innerHTML = `<td><strong>${category}</strong></td><td>${value}</td>`;
    resultsBody.appendChild(row);
  }
}

function restart() {
  currentStep = 0;
  selections = {};
  if (finalZone) finalZone.hidden = true;
  if (gameZone) gameZone.hidden = false;
  if (progressIndicator) progressIndicator.hidden = false;
  if (wheelTitle) wheelTitle.hidden = false;
  loadWheel(currentStep);
}

if (spinBtn) spinBtn.addEventListener("click", spin);
if (nextBtn) nextBtn.addEventListener("click", handleNext);
if (restartBtn) restartBtn.addEventListener("click", restart);

loadWheel(currentStep);
