const Screen = {
  getScreen(id) {
    return document.querySelector(`#${id}`);
  },
  displayScreen: (id) => {
    const previousScreen = document.querySelector(".current-screen");
    const nextScreen = Screen.getScreen(id);

    if (previousScreen === nextScreen) {
      return;
    }

    window.scrollTo(0, 0);
    nextScreen.classList.add("next-screen");
    requestAnimationFrame(() => {
      nextScreen.classList.remove("next-screen");
      nextScreen.classList.add("current-screen");
      previousScreen.classList.remove("current-screen");
      previousScreen.classList.add("previous-screen");

      setTimeout(() => {
        previousScreen.classList.remove("previous-screen");
      }, 200);
    });
  },
};

const screens = {
  willDraw: "will-draw-screen",
  willGuess: "will-guess-screen",
  draw: "draw-screen",
  start: "start-screen",
  guess: "guess-screen",
  result: "result-screen",
};
