function initGuessScreen() {
  Screen.displayScreen(screens.guess);
  const screen = Screen.getScreen(screens.guess);
  const input = screen.querySelector("input");
  input.value = "";
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

  const button = screen.querySelector("button");
  button.disabled = input.value < 1;
  listener(input, "input", (ev) => {
    button.disabled = ev.target.value < 1;
  });
}

function onGuess() {
  const guessScreen = Screen.getScreen(screens.guess);
  const input = guessScreen.querySelector("input");
  State.addRound({
    type: "guess",
    guess: input.value,
  });

  if (State.lastRoundPlayed()) {
    initResultsScreen();
  } else {
    initWillDrawScreen();
  }
}
