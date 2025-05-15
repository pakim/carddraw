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
  "1J",
  "2J",
];

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
  let index = 0;
  const deckContainer = document.querySelector(".deck-container");

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

shuffleDeck();

// Event listener for shuffle button click
const shuffleButton = document.querySelector(".shuffle");
shuffleButton.addEventListener("click", () => {
  shuffleSound.currentTime = 0;
  shuffleSound.play();
  shuffleDeck();
});

// Event listener for show stats button click
const statsButton = document.querySelector(".show");
statsButton.addEventListener("click", () => {
  const probability = document.querySelector(".probability");

  if (statsButton.textContent === "Show Stats") {
    probability.classList.remove("hidden");
    statsButton.textContent = "Hide Stats";
  } else {
    probability.classList.add("hidden");
    statsButton.textContent = "Show Stats";
  }
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
