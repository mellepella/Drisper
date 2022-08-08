const INITIAL_STATE = {
  numberOfRounds: 5,
  secondsPerRound: 60,
  word: "",
  rounds: [],
};

const State = {
  ...INITIAL_STATE,
  lastRoundPlayed() {
    return this.rounds.length >= this.numberOfRounds;
  },
  saveSettings(form) {
    const formData = new FormData(form);
    const numberOfPlayers = parseInt(formData.get("playersOption"));
    this.numberOfRounds = numberOfPlayers - 1;
    this.secondsPerRound = parseInt(formData.get("roundLengthOption"));
    this.word = formData.get("wordOption");
  },
  addRound(roundObject) {
    this.rounds = [...this.rounds, roundObject];
    return this.rounds;
  },
  reset() {
    this.numberOfRounds = INITIAL_STATE.numberOfRounds;
    this.secondsPerRound = INITIAL_STATE.secondsPerRound;
    this.word = INITIAL_STATE.word;
    this.rounds = INITIAL_STATE.rounds;
  },
};
