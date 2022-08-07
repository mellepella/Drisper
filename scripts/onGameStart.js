function onGameStart(event) {
  event.preventDefault();
  State.saveSettings(event.target);
  initWillDrawScreen();
}
