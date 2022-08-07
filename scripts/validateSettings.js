function validateSettings(form) {
  const formData = new FormData(form);
  const numberOfPlayers = parseInt(formData.get("playersOption"));
  const secondsPerRound = parseInt(formData.get("roundLengthOption"));
  const word = formData.get("wordOption");

  const isValid = numberOfPlayers >= 3 && secondsPerRound >= 10 && word;
  form.querySelector("button").disabled = !isValid;
}
