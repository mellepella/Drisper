const State = {
  numberOfPlayers: 5,
  secondsPerRound: 60,
  word: "",
  saveSettings(form) {
    const formData = new FormData(form);
    this.numberOfPlayers = parseInt(formData.get("playersOption"));
    this.secondsPerRound = parseInt(formData.get("roundLengthOption"));
    this.word = formData.get("wordOption");
  },
  rounds: [],
  addRound(roundObject) {
    this.rounds.push(roundObject);
    return this.rounds;
  },
};
