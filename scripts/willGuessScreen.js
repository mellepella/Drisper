function initWillGuessScreen() {
  Screen.displayScreen(screens.willGuess);
  const screen = Screen.getScreen(screens.draw);
  const canvas = screen.querySelector("canvas");
  State.addRound({ type: "draw", canvas: cloneCanvas(canvas) });
  detach();
}
