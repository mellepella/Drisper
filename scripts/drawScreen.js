function machine(initState, definition) {
  return {
    state: initState,
    send(event, payload) {
      const nextState = definition?.[this.state]?.on?.[event];
      const didChange = nextState && nextState !== this.state;

      if (didChange) {
        definition?.[this.state]?.onExit?.({ event, payload });
      }

      if (nextState) {
        this.state = nextState;

        definition?.[this.state]?.onTouch?.({ event, payload });
      }
    },
  };
}

function registerListeners(canvas, penMachine) {
  listener(canvas, "mousedown", (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    return penMachine.send("DOWN", {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    });
  });
  listener(canvas, "mouseup", (ev) => penMachine.send("UP", ev));
  listener(canvas, "mousemove", (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    return penMachine.send("MOVE", {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    });
  });
  listener(canvas, "mouseleave", (ev) => penMachine.send("EXIT", ev));
  listener(canvas, "touchstart", (ev) => penMachine.send("DOWN", ev));
  listener(canvas, "touchmove", (ev) => {
    ev.preventDefault();
    const touch = ev.touches[0];
    const rect = ev.currentTarget.getBoundingClientRect();
    penMachine.send("MOVE", {
      x:
        ((touch.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y:
        ((touch.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    });
  });
  listener(canvas, "touchend", (ev) => penMachine.send("UP", ev));
}

function getPenMachine(ctx, penSize) {
  let lastPosition;

  return machine("IDLE", {
    DRAW: {
      onExit: () => {
        lastPosition = undefined;
      },
      onTouch: ({ payload }) => {
        const startPosition = lastPosition ?? payload;
        const endPosition = payload;

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = penSize;
        ctx.strokeStyle = document.querySelector(
          'input[name="color"]:checked'
        ).value;
        ctx.moveTo(startPosition.x, startPosition.y);
        ctx.lineTo(endPosition.x, endPosition.y);
        ctx.stroke();
        lastPosition = payload;
      },
      on: {
        UP: "IDLE",
        DOWN: "DRAW",
        MOVE: "DRAW",
        EXIT: "IDLE",
        TIMES_UP: "DISABLED",
      },
    },
    DISABLED: {},
    IDLE: {
      on: {
        UP: "IDLE",
        DOWN: "DRAW",
        MOVE: "IDLE",
        EXIT: "IDLE",
        TIMES_UP: "DISABLED",
      },
    },
  });
}

function initDrawScreen() {
  const startedAt = new Date();
  const guesses = State.rounds.filter((r) => r.type === "guess");
  const lastGuess = guesses[guesses.length - 1]?.guess;
  setText("#draw-heading", `Draw "${lastGuess ?? State.word}"`);
  Screen.displayScreen(screens.draw);
  const screen = Screen.getScreen(screens.draw);
  screen.querySelector(`input[name='color'][value='black']`).checked = true;
  const canvas = screen.querySelector("canvas");
  canvas.style.height = canvas.clientWidth + "px";
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const penSize = canvas.clientWidth / 100;
  const penMachine = getPenMachine(ctx, penSize);
  registerListeners(canvas, penMachine);

  interval(() => {
    const elapsedMs = new Date().getTime() - startedAt.getTime();
    const elapsedS = Math.round(elapsedMs / 1000);
    const secondsLeft = Math.max(State.secondsPerRound - elapsedS, 0);

    if (secondsLeft > 0) {
      setText("#draw-time-left", `🕙 ${secondsLeft}s`);
    } else {
      setText("#draw-time-left", `🕙 Times up!`);
      penMachine.send("TIMES_UP");
    }
  }, 250);
}

function onSubmitDrawing() {
  const screen = Screen.getScreen(screens.draw);
  const canvas = screen.querySelector("canvas");
  State.addRound({ type: "draw", canvas: cloneCanvas(canvas) });
  detach();

  if (State.lastRoundPlayed()) {
    initResultsScreen();
  } else {
    initWillGuessScreen();
  }
}
