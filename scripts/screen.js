const Screen = {
  getScreen(id) {
    return document.querySelector(`#${id}`);
  },
  displayScreen: (id) => {
    document.querySelectorAll(".current-screen").forEach((el) => {
      el.classList.remove("current-screen");
    });
    const nextScreen = Screen.getScreen(id);
    nextScreen.classList.add("current-screen");
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
