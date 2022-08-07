function onGameStart(event) {
  event.preventDefault();
  State.saveSettings(event.target);
  Screen.displayScreen(screens.willDraw);
}
