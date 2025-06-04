// ============================================================================
// 🎨 DESIGN / UI FUNCTIONS
// ============================================================================

// Function to change highlight/glow color
function setCardGlow(colorName) {
  const colors = glowPresets[colorName];
  if (!colors) return;
  document.body.style.setProperty("--glow-color-1", colors[0]);
  document.body.style.setProperty("--glow-color-2", colors[1]);
  document.body.style.setProperty("--glow-color-3", colors[2]);
  document.body.style.setProperty("--glow-color-4", colors[3]);
}

// Function to change the background image
function setBackground(name) {
  const bg = backgrounds[name];
  if (!bg) return;

  document.body.style.setProperty("--bg-image", bg.value);
}

// Function to change the card back design
function setBackDesign(name) {
  const backDesign = cardBackDesigns[name];
  if (!backDesign) return;

  document.body.style.setProperty("--back-design", backDesign.value);
}

// Function to create card elements for the whole deck
function createCardElements(deck = cardList) {
  const deckContainer = document.querySelector(".deck-container");
  let index = 0;

  // Animate cards moving back to the deck, then remove card elements
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.style.transition = "transform 0.3s linear";
    card.style.transform = "translate(0, 0) rotateY(180deg)";
    card.addEventListener("transitionend", () => {
      deckContainer.removeChild(card);
    });
  });

  // Randomly select card, create card element, and add card to the deck
  for (let i = 0; deck.length > 0; ) {
    // Use random function to select from card list
    index = Math.floor(Math.random() * deck.length);

    // Create card element and add css properties
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    cardContainer.style.zIndex = `${deck.length + 1000}`;
    cardContainer.style.transform = "rotateY(180deg)";

    // Add card name/suit data (first character is name, second character is suit)
    cardContainer.dataset.card = deck[index][0];
    cardContainer.dataset.suit = deck[index][1];

    // Create card img element
    const cardImg = document.createElement("img");
    cardImg.src = `svg/${deck[index]}.svg`;

    // Event listener when card in the deck is clicked. Occurs when the card is at the top of the deck
    cardContainer.addEventListener("click", e => drawCard(e, cardContainer), { once: true });

    // Event listener when mouse is clicked down on an active card
    cardContainer.addEventListener("pointerdown", e => onDown(e, cardContainer));

    cardContainer.appendChild(cardImg);
    deckContainer.appendChild(cardContainer);
    deck.splice(index, 1);
  }
}

// Function to create color options elements in settings
function createColorPicker() {
  const glowContainer = document.querySelector(".color-picker");
  if (!glowContainer) return;

  Object.entries(glowPresets).forEach(([colorName, colorShades]) => {
    const option = document.createElement("div");
    option.classList.add("color-option");
    option.dataset.color = colorName;
    option.style.setProperty("--color", colorShades[0]);
    option.title = colorName;

    option.addEventListener("click", () => {
      document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
      setCardGlow(colorName);
    });

    glowContainer.appendChild(option);
  });
}

// Function to create background option elements in settings
function createBackgroundPicker() {
  const bgContainer = document.querySelector(".background-picker");
  if (!bgContainer) return;

  // Create div elements for the background picker in settings
  Object.entries(backgrounds).forEach(([key, bg]) => {
    const option = document.createElement("div");
    option.classList.add("bg-option");
    option.dataset.bg = key;
    option.title = key;

    // Set background image url
    option.style.backgroundImage = bg.value;

    // Event listener to highlight the background option clicked and change background
    option.addEventListener("click", () => {
      document.querySelectorAll(".bg-option").forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
      setBackground(key);
    });

    bgContainer.appendChild(option);
  });
}

// Function to create back design option elements in settings
function createBackDesignPicker() {
  const backContainer = document.querySelector(".back-picker");
  if (!backContainer) return;

  // Create div elements for the back picker in settings
  Object.entries(cardBackDesigns).forEach(([key, design]) => {
    const option = document.createElement("div");
    option.classList.add("back-option");
    option.dataset.back = key;
    option.title = key;

    // Set back design image url
    option.style.backgroundImage = design.value;

    // Event listener to highlight the back design option clicked and change the back design
    option.addEventListener("click", () => {
      document.querySelectorAll(".back-option").forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
      setBackDesign(key);
    });

    backContainer.appendChild(option);
  });
}

// ============================================================================
// 🎴 CARD DRAGGING FUNCTIONS
// ============================================================================

// Function that controls what happens when user's pointer/finger lands on an active card
// Start of dragging motion
function onDown(e, cardContainer) {
  // Only works for active cards, not cards that haven't been drawn
  if (!cardContainer.classList.contains("active")) return;
  e.preventDefault();

  isDragging = true;
  activeCard = cardContainer;
  ++topzIndex;

  // Compute offset relative to current transform
  const transform = window.getComputedStyle(cardContainer).transform;
  if (transform !== "none") {
    const match = transform.match(/matrix\((.+)\)/);
    if (match) {
      const values = match[1].split(", ");
      currentX = parseFloat(values[4]);
      currentY = parseFloat(values[5]);
    }
  } else {
    currentX = currentY = 0;
  }

  startX = e.clientX - currentX;
  startY = e.clientY - currentY;

  // Play card pick up sound effect
  cardUpSound.currentTime = 0;
  cardUpSound.play();

  cardContainer.style.cursor = "grabbing";
  cardContainer.style.zIndex = `${topzIndex}`;
}

// Function that moves the card while the user's pointer/finger moves across the screen
function onMove(e) {
  e.preventDefault();

  if (!isDragging || !activeCard) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  activeCard.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

// Function that puts down the card when the user's pointer/finger lifts off the card
function onUp(e) {
  if (activeCard) {
    // Play card down sound effect
    cardDownSound.currentTime = 0;
    cardDownSound.play();

    activeCard.style.cursor = "pointer";
    isDragging = false;
    activeCard = null;
  }
}

// ============================================================================
// 📦 UTILITY FUNCTIONS
// ============================================================================

// Function to shuffle/reset the card deck
function shuffleDeck() {
  const deck = [...cardList];
  deckNumberCount = { ...deckTemplate };
  topzIndex = 1;

  // Check if jokers enabled. If so, add to the deck
  if (jokerEnabled) {
    deck.push("ja", "jb");
    deckNumberCount["red"]++;
    deckNumberCount["black"]++;
    deckNumberCount["joker"] += 2;
    deckNumberCount["total"] += 2;
  }

  // Call function to recalculate probabilities
  calculateStats();

  // Call function to create card elements
  createCardElements(deck);
}

function drawCard(e, cardContainer) {
  e.preventDefault();

  // Retrieve the current height of a card
  const defaultCard = document.querySelector(".landing-zone");
  const cardHeight = parseInt(window.getComputedStyle(defaultCard).height);

  // Play card draw sound effect
  cardDrawSound.currentTime = 0;
  cardDrawSound.play();

  // Add the flipped class which has the draw animation
  cardContainer.classList.add("flipped");

  // Adjust deck numbers and recalculate probabilities
  adjustDeckNumbers(cardContainer);
  calculateStats();

  // Add eventlistener to change z index of card once animation ends
  cardContainer.addEventListener("animationend", () => {
    cardContainer.style.zIndex = `${topzIndex}`;

    // Add card translation to the transform property so position stays after animation
    cardContainer.style.transform = `translateY(-${cardHeight + 30}px)`;
    cardContainer.classList.remove("flipped");
    cardContainer.classList.add("active");
  });
}

// Function to calculate the probabilities of the next card.
function calculateStats() {
  const probElements = document.querySelectorAll(".probability-item");

  probElements.forEach(element => {
    const span = element.querySelector("span");
    const type = element.dataset.type;

    // Calculate percentage
    let probability = (deckNumberCount[type] / deckNumberCount["total"]) * 100;

    // Check if number of cards in the deck is 0. If so set probability to 0 to prevent NaN.
    if (deckNumberCount["total"] === 0) {
      probability = 0;
    }

    // Set span element text to the percentage. Limit to one decimal place. Remove decimal if 0.
    span.textContent = `${
      probability % 1 === 0 ? probability.toFixed(0) : probability.toFixed(1)
    }%`;
  });
}

// Function to adjust the number of card types available. (Helps with probability)
function adjustDeckNumbers(card) {
  const cardType = card.dataset.card;
  const cardSuit = card.dataset.suit;

  // Subtract 1 from the card types (2-10, jack, queen, etc)
  // Check for joker cards
  if (cardType === "j") {
    deckNumberCount["joker"]--;
  } else {
    deckNumberCount[cardType]--;
  }

  // Subtract 1 from the card suits (diamond, heart, spade, club)
  // Check for joker cards
  if (cardSuit !== "a" && cardSuit !== "b") {
    deckNumberCount[cardSuit]--;
  }

  // Subtract 1 from card colors (red, black)
  if (cardSuit === "D" || cardSuit === "H" || cardSuit === "a") {
    deckNumberCount["red"]--;
  } else {
    deckNumberCount["black"]--;
  }

  // Subtract 1 from the total
  deckNumberCount["total"]--;
}

function audioSetup() {
  shuffleSound = new Audio("./sounds/card_shuffle.m4a");
  cardUpSound = new Audio("./sounds/card_up.mp3");
  cardDownSound = new Audio("./sounds/card_down.mp3");
  cardDrawSound = new Audio("./sounds/card_draw.mp3");

  shuffleSound.volume = 0.5;
  cardUpSound.volume = 0.5;
  cardDownSound.volume = 0.4;
  cardDrawSound.volume = 1;
  shuffleSound.load();
  cardUpSound.load();
  cardDownSound.load();
  cardDrawSound.load();
}

// ============================================================================
// 🛠️ SETUP FUNCTION
// ============================================================================

// Function to create elements and set user/default options
function setup() {
  audioSetup();
  createBackDesignPicker();
  createColorPicker();
  createBackgroundPicker();
  shuffleDeck();
  setCardGlow("white");
  const colorOption = document.querySelector('[data-color="white"]');
  colorOption.classList.add("selected");
  setBackground("default");
  const bgOption = document.querySelector('[data-bg="default"]');
  bgOption.classList.add("selected");
  setBackDesign("design_1");
  const backOption = document.querySelector('[data-back="design_1"]');
  backOption.classList.add("selected");
}

// ============================================================================
// 🎯 EVENT LISTENERS
// ============================================================================

// Event listener for shuffle button click
const shuffleButton = document.querySelector(".shuffle-button");
shuffleButton.addEventListener("click", () => {
  shuffleSound.currentTime = 0;
  shuffleSound.play();
  shuffleDeck();
});

// Event listener for settings button click
const settingsButton = document.querySelector(".settings-button");
const settingsPanel = document.querySelector(".settings-panel");
settingsButton.addEventListener("click", () => {
  settingsButton.classList.toggle("active");
  settingsPanel.classList.toggle("show");
});

// Event listener for joker toggle in settings
const jokerToggle = document.querySelector(".toggle-joker");
jokerToggle.addEventListener("change", () => {
  if (jokerToggle.checked) {
    jokerEnabled = true;
  } else {
    jokerEnabled = false;
  }
  shuffleDeck();
});

const statsToggle = document.querySelector(".toggle-stats");
const statsContainer = document.querySelector(".stats-container");
statsToggle.addEventListener("change", () => {
  statsContainer.classList.toggle("hidden");
});

// Event listener when the mouse moves. Works only when an active card is clicked
document.addEventListener("pointermove", onMove);
document.addEventListener("touchmove", onMove, { passive: false });

// Event listener when the mouse click ends
document.addEventListener("pointerup", onUp);

// Event listener to wait for dom to load to start setup
document.addEventListener("DOMContentLoaded", () => {
  setup();
});
