function onLoad() {
  initStartScreen();
  validateSettings(Screen.getScreen(screens.start).querySelector("form"));
}
