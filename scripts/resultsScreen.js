function initResultsScreen() {
  detach();
  Screen.displayScreen(screens.result);
  const resultScreen = Screen.getScreen(screens.result);

  const results = resultScreen.querySelector("#results");
  results.innerHTML = "";
  const wordP = document.createElement("p");
  wordP.innerText = `Word was "${State.word}"`;
  results.appendChild(wordP);

  State.rounds.forEach((round) => {
    if (round.type === "draw") {
      const div = document.createElement("div");
      const descP = document.createElement("p");
      descP.innerText = "Drew";
      div.appendChild(descP);
      div.appendChild(cloneCanvas(round.canvas));
      results.appendChild(div);
      return;
    }

    if (round.type == "guess") {
      const descP = document.createElement("p");
      descP.innerText = `Guessed "${round.guess}"`;
      results.appendChild(descP);
    }
  });
}
