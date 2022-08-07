function initResultsScreen() {
  Screen.displayScreen(screens.result);
  const guessScreen = Screen.getScreen(screens.guess);
  const resultScreen = Screen.getScreen(screens.result);
  const input = guessScreen.querySelector("input");
  State.addRound({
    type: "guess",
    guess: input.value,
  });

  const wordP = document.createElement("p");
  wordP.innerText = `Word was "${State.word}"`;
  resultScreen.appendChild(wordP);

  State.rounds.forEach((round) => {
    if (round.type === "draw") {
      const descP = document.createElement("p");
      descP.innerText = "Drew";
      resultScreen.appendChild(descP);
      resultScreen.appendChild(cloneCanvas(round.canvas));
      return;
    }

    if (round.type == "guess") {
      const descP = document.createElement("p");
      descP.innerText = `Guessed ${round.guess}`;
      resultScreen.appendChild(descP);
    }
  });
}
