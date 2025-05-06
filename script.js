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

function shuffleDeck() {
  const deck = cardList;
  let index = 0;
  const deckContainer = document.querySelector(".deck-container");

  for (let i = 0; deck.length > 0; ) {
    index = Math.floor(Math.random() * deck.length);

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    cardContainer.style.zIndex = `${deck.length}`;
    cardContainer.style.transform = "rotateY(180deg)";

    const cardImg = document.createElement("img");
    cardImg.src = `svg/${deck[index]}.svg`;

    cardContainer.addEventListener("click", e => {
      e.preventDefault();

      // Retrieve the current height of a card
      const defaultCard = document.querySelector(".landing-zone");
      const cardHeight = parseInt(window.getComputedStyle(defaultCard).height);

      // Translate the card 
      // cardContainer.style.transform = `translateY(-${cardHeight + 30}px)`;
      cardContainer.classList.add("flipped");

      // Add eventlistener to change z index of card once transition ends
      cardContainer.addEventListener("animationend", function() {
        cardContainer.style.zIndex = "1";
      });
    }, { once: true });

    cardContainer.appendChild(cardImg);
    deckContainer.appendChild(cardContainer);
    deck.splice(index, 1);
  }
}

shuffleDeck();

// const el = document.querySelector(".deck img");

// let isDragging = false;
// let startX = 0,
//   startY = 0;
// let currentX = 0,
//   currentY = 0;

// el.addEventListener("mousedown", e => {
//   e.preventDefault();
//   isDragging = true;
//   startX = e.clientX - currentX;
//   startY = e.clientY - currentY;
//   el.style.cursor = "grabbing";
// });

// document.addEventListener("mousemove", e => {
//   if (!isDragging) return;
//   currentX = e.clientX - startX;
//   currentY = e.clientY - startY;
//   el.style.transform = `translate(${currentX}px, ${currentY}px)`;
// });

// document.addEventListener("mouseup", () => {
//   isDragging = false;
//   el.style.cursor = "pointer";
// });
