const cardList = [
  "2C",
  "2D",
  "2H",
  "2S",
  "3C",
  "3D",
  "3H",
  "3S",
  "4C",
  "4D",
  "4H",
  "4S",
  "5C",
  "5D",
  "5H",
  "5S",
  "6C",
  "6D",
  "6H",
  "6S",
  "7C",
  "7D",
  "7H",
  "7S",
  "8C",
  "8D",
  "8H",
  "8S",
  "9C",
  "9D",
  "9H",
  "9S",
  "TC",
  "TD",
  "TH",
  "TS",
  "JC",
  "JD",
  "JH",
  "JS",
  "QC",
  "QD",
  "QH",
  "QS",
  "KC",
  "KD",
  "KH",
  "KS",
  "AC",
  "AD",
  "AH",
  "AS",
];

const glowPresets = {
  white: [
    "rgba(255, 255, 255, 0.75)",
    "rgba(245, 245, 245, 0.5)",
    "rgba(230, 230, 230, 0.35)",
    "rgba(210, 210, 210, 0.25)",
  ],
  blue: [
    "rgba(100, 200, 255, 0.6)",
    "rgba(80, 180, 255, 0.5)",
    "rgba(60, 160, 255, 0.4)",
    "rgba(40, 140, 255, 0.3)",
  ],
  violet: [
    "rgba(190, 80, 255, 0.7)",
    "rgba(170, 60, 255, 0.5)",
    "rgba(150, 40, 240, 0.4)",
    "rgba(130, 20, 230, 0.3)",
  ],
  gold: [
    "rgba(255, 215, 0, 0.7)",
    "rgba(255, 200, 0, 0.5)",
    "rgba(240, 180, 0, 0.4)",
    "rgba(220, 160, 0, 0.3)",
  ],
  red: [
    "rgba(255, 60, 60, 0.7)",
    "rgba(235, 40, 40, 0.5)",
    "rgba(215, 20, 20, 0.4)",
    "rgba(195, 0, 0, 0.3)",
  ],
  green: [
    "rgba(80, 255, 100, 0.7)",
    "rgba(60, 235, 80, 0.5)",
    "rgba(40, 215, 60, 0.4)",
    "rgba(20, 195, 40, 0.3)",
  ],
};

const backgrounds = {
  default: {
    value: `linear-gradient(rgba(53, 101, 77, 0.9), rgba(53, 101, 77, 0.9)),
            url("./images/default.jpg")`,
  },
  green_1: {
    value: 'url("./images/background_green_1.jpg")',
  },
  green_2: {
    value: 'url("./images/background_green_2.jpg")',
  },
  green_3: {
    value: 'url("./images/background_green_3.jpg")',
  },
  blue_1: {
    value: 'url("./images/background_blue_1.jpg")',
  },
  blue_2: {
    value: 'url("./images/background_blue_2.jpg")',
  },
  purple_1: {
    value: 'url("./images/background_purple_1.jpg")',
  },
  red_1: {
    value: 'url("./images/background_red_1.jpg")',
  },
  red_2: {
    value: 'url("./images/background_red_2.jpg")',
  },
};

const cardBackDesigns = {
  design_1: {
    value: 'url("./svg/1B.svg")',
  },
  design_2: {
    value: 'url("./svg/2B.svg")',
  },
};

const deckTemplate = {
  2: 4,
  3: 4,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
  T: 4,
  J: 4,
  Q: 4,
  K: 4,
  A: 4,
  red: 26,
  black: 26,
  H: 13,
  D: 13,
  S: 13,
  C: 13,
  joker: 0,
  total: 52,
};

let jokerEnabled = false;
let deckNumberCount = {};

// Variables for card dragging
let isDragging = false;
let startX = 0,
  startY = 0;
let currentX = 0,
  currentY = 0;
let activeCard = null;
let topzIndex = 1;

// Sound effect variables
let shuffleSound = null;
let cardUpSound = null;
let cardDownSound = null;
let cardDrawSound = null;