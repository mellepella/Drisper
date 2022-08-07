function initGuessScreen() {
  Screen.displayScreen(screens.guess);
  const screen = Screen.getScreen(screens.guess);
  const canvas = screen.querySelector("canvas");
  const lastRound = State.rounds[State.rounds.length - 1];

  if (lastRound?.type !== "draw") {
    alert("Something went wrong! Please restart.");
  }

  const lastCanvas = lastRound.canvas;
  canvas.style.height = lastCanvas.width + "px";
  canvas.width = lastCanvas.width;
  canvas.height = lastCanvas.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(lastCanvas, 0, 0);

  const input = screen.querySelector("input");
  const button = screen.querySelector("button");
  button.disabled = input.value < 1;
  input.addEventListener("input", (ev) => {
    button.disabled = ev.target.value < 1;
  });
}
