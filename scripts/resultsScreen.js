function initResultsScreen() {
  detach();
  Screen.displayScreen(screens.result);
  const guessScreen = Screen.getScreen(screens.guess);
  const resultScreen = Screen.getScreen(screens.result);
  const input = guessScreen.querySelector("input");
  State.addRound({
    type: "guess",
    guess: input.value,
  });

  const results = resultScreen.querySelector("#results");
  results.innerHTML = "";
  const wordP = document.createElement("p");
  wordP.innerText = `Word was "${State.word}"`;
  results.appendChild(wordP);

  State.rounds.forEach((round) => {
    if (round.type === "draw") {
      const descP = document.createElement("p");
      descP.innerText = "Drew";
      results.appendChild(descP);
      results.appendChild(cloneCanvas(round.canvas));
      return;
    }

    if (round.type == "guess") {
      const descP = document.createElement("p");
      descP.innerText = `Guessed "${round.guess}"`;
      results.appendChild(descP);
    }
  });
}
