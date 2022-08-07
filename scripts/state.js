const INITIAL_STATE = {
  numberOfPlayers: 5,
  secondsPerRound: 60,
  word: "",
  rounds: [],
};

const State = {
  ...INITIAL_STATE,
  saveSettings(form) {
    const formData = new FormData(form);
    this.numberOfPlayers = parseInt(formData.get("playersOption"));
    this.secondsPerRound = parseInt(formData.get("roundLengthOption"));
    this.word = formData.get("wordOption");
  },
  addRound(roundObject) {
    this.rounds = [...this.rounds, roundObject];
    return this.rounds;
  },
  reset() {
    this.numberOfPlayers = INITIAL_STATE.numberOfPlayers;
    this.secondsPerRound = INITIAL_STATE.secondsPerRound;
    this.word = INITIAL_STATE.word;
    this.rounds = INITIAL_STATE.rounds;
  },
};
