function initStartScreen() {
  State.reset();
  Screen.displayScreen(screens.start);
  const screen = Screen.getScreen(screens.start);
  const input = screen.querySelector("input[name='wordOption']");
  input.value = randomWord();
}
