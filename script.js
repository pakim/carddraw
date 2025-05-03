const el = document.querySelector(".deck img");

let isDragging = false;
let startX = 0,
  startY = 0;
let currentX = 0,
  currentY = 0;

el.addEventListener("mousedown", e => {
  e.preventDefault();
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  el.style.cursor = "grabbing";
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  el.style.transform = `translate(${currentX}px, ${currentY}px)`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  el.style.cursor = "pointer";
});
