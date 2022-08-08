function machine(initState, definition) {
  return {
    state: initState,
    send(event, payload) {
      const nextState = definition?.[this.state]?.on?.[event];
      const didChange = nextState && nextState !== this.state;

      if (didChange) {
        definition?.[this.state]?.onExit?.({ event, payload });
        definition?.[nextState]?.onEnter?.({ event, payload });
      }

      if (nextState) {
        this.state = nextState;

        definition?.[this.state]?.onTouch?.({ event, payload });
      }
    },
  };
}

function mouseEventToCoord(evt) {
  const canvas = evt.currentTarget;
  const rect = evt.currentTarget.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}

function touchEventToCoord(ev) {
  const touch = ev.touches[0];
  const rect = ev.currentTarget.getBoundingClientRect();
  return {
    x: ((touch.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((touch.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}

function registerListeners(canvas, penMachine) {
  listener(canvas, "mousedown", (evt) => {
    return penMachine.send("DOWN", mouseEventToCoord(evt));
  });
  listener(canvas, "mouseup", (ev) =>
    penMachine.send("UP", mouseEventToCoord(ev))
  );
  listener(canvas, "mousemove", (evt) => {
    return penMachine.send("MOVE", mouseEventToCoord(evt));
  });
  listener(canvas, "mouseleave", (ev) =>
    penMachine.send("EXIT", mouseEventToCoord(ev))
  );
  listener(canvas, "touchstart", (ev) =>
    penMachine.send("DOWN", touchEventToCoord(ev))
  );
  listener(canvas, "touchmove", (ev) => {
    ev.preventDefault();
    penMachine.send("MOVE", touchEventToCoord(ev));
  });
  listener(canvas, "touchend", (ev) =>
    penMachine.send("UP", touchEventToCoord(ev))
  );
}

function getPenMachine(ctx, penSize) {
  let lastPosition;
  let sequenceStarts = [];
  let strokeStyle;
  let moves = [];

  window.penMachine = machine("IDLE", {
    UNDOING: {
      on: {
        EXIT: "IDLE",
      },
      onTouch: () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const sequenceStart = Math.max(sequenceStarts.pop(), 0);
        moves = moves.slice(0, sequenceStart);
        moves.forEach((move) => {
          const { startPosition, endPosition } = move;
          ctx.beginPath();
          ctx.lineCap = "round";
          ctx.lineWidth = penSize;
          ctx.strokeStyle = move.strokeStyle;
          ctx.moveTo(startPosition.x, startPosition.y);
          ctx.lineTo(endPosition.x, endPosition.y);
          ctx.stroke();
        });
        window.penMachine.send("EXIT");
      },
    },
    DRAW: {
      onExit: () => {
        lastPosition = undefined;
      },
      onEnter: () => {
        sequenceStarts.push(moves.length);
      },
      onTouch: ({ payload }) => {
        const startPosition = lastPosition ?? payload;
        const endPosition = payload;
        strokeStyle = document.querySelector(
          'input[name="color"]:checked'
        ).value;

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = penSize;
        ctx.strokeStyle = strokeStyle;
        ctx.moveTo(startPosition.x, startPosition.y);
        ctx.lineTo(endPosition.x, endPosition.y);
        ctx.stroke();
        lastPosition = payload;
        moves.push({
          startPosition,
          endPosition,
          strokeStyle,
        });
      },
      on: {
        UP: "IDLE",
        DOWN: "DRAW",
        MOVE: "DRAW",
        EXIT: "IDLE",
        TIMES_UP: "DISABLED",
        UNDO: "UNDOING",
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
        UNDO: "UNDOING",
      },
    },
  });
  return window.penMachine;
}

function undo() {
  window.penMachine.send("UNDO");
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
  penMachine = getPenMachine(ctx, penSize);
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
