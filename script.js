let jokerEnabled = false;

// Variables for card dragging
let isDragging = false;
let startX = 0,
  startY = 0;
let currentX = 0,
  currentY = 0;
let activeCard = null;
let topzIndex = 1;

// Sound effect variables
const shuffleSound = new Audio("./sounds/card_shuffle.m4a");
const cardUpSound = new Audio("./sounds/card_up.mp3");
const cardDownSound = new Audio("./sounds/card_down.mp3");
const cardDrawSound = new Audio("./sounds/card_draw.mp3");

shuffleSound.volume = 0.5;
cardUpSound.volume = 0.5;
cardDownSound.volume = 0.4;
cardDrawSound.volume = 1;
shuffleSound.load();
cardUpSound.load();
cardDownSound.load();
cardDrawSound.load();

// Function to shuffle/reset the card deck
function shuffleDeck() {
  const deck = [...cardList];

  // Check if jokers enabled. If so, add to the deck
  if (jokerEnabled) {
    deck.push("ja", "jb");
  }

  // Call function to create card elements
  createCardElements(deck);
}

// Function to create elements and set user/default options
function setup() {
  createColorPicker();
  createBackgroundPicker();
  shuffleDeck();
  setCardGlow("white");
  const colorOption = document.querySelector('[data-color="white"]');
  colorOption.classList.add("selected");
  setBackground("default");
  const bgOption = document.querySelector('[data-bg="default"]');
  bgOption.classList.add("selected");
}

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

    // Create card img element
    const cardImg = document.createElement("img");
    cardImg.src = `svg/${deck[index]}.svg`;

    // Event listener when card in the deck is clicked. Occurs when the card is at the top of the deck
    cardContainer.addEventListener(
      "click",
      e => {
        e.preventDefault();

        // Retrieve the current height of a card
        const defaultCard = document.querySelector(".landing-zone");
        const cardHeight = parseInt(window.getComputedStyle(defaultCard).height);

        // Play card draw sound effect
        cardDrawSound.currentTime = 0;
        cardDrawSound.play();

        // Add the flipped class which has the draw animation
        cardContainer.classList.add("flipped");

        // Add eventlistener to change z index of card once animation ends
        cardContainer.addEventListener("animationend", () => {
          cardContainer.style.zIndex = `${topzIndex}`;

          // Add card translation to the transform property so position stays after animation
          cardContainer.style.transform = `translateY(-${cardHeight + 30}px)`;
          cardContainer.classList.remove("flipped");
          cardContainer.classList.add("active");
        });
      },
      { once: true }
    );

    // Event listener when mouse is clicked down on an active card
    cardContainer.addEventListener("pointerdown", e => {
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
    });

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

  Object.entries(backgrounds).forEach(([key, bg]) => {
    const option = document.createElement("div");
    option.classList.add("bg-option");
    option.dataset.bg = key;
    option.title = key;

    option.style.backgroundImage = bg.value;

    option.addEventListener("click", () => {
      document.querySelectorAll(".bg-option").forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
      setBackground(key);
    });

    bgContainer.appendChild(option);
  });
}

// ==================================================
// 🎯 EVENT LISTENERS
// ==================================================

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
document.addEventListener("pointermove", e => {
  if (!isDragging || !activeCard) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  activeCard.style.transform = `translate(${currentX}px, ${currentY}px)`;
});

// Event listener when the mouse click ends
document.addEventListener("pointerup", () => {
  if (activeCard) {
    // Play card down sound effect
    cardDownSound.currentTime = 0;
    cardDownSound.play();

    activeCard.style.cursor = "pointer";
    isDragging = false;
    activeCard = null;
  }
});

// Event listener to wait for dom to load to start setup
document.addEventListener("DOMContentLoaded", () => {
  setup();
});
