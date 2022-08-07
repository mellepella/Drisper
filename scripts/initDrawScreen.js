function machine(initState, definition) {
  return {
    state: initState,
    send(event, payload) {
      const nextState = definition?.[this.state]?.on?.[event];

      if (nextState) {
        this.state = nextState;

        definition?.[this.state]?.onTouch?.({ event, payload });
      }
    },
  };
}

function initDrawScreen() {
  Screen.displayScreen(screens.draw);
  const screen = Screen.getScreen(screens.draw);
  screen.querySelector(`input[name='color'][value='black']`).checked = true;
  const canvas = screen.querySelector("canvas");
  canvas.style.height = canvas.clientWidth + "px";
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const ctx = canvas.getContext("2d");
  const penSize = canvas.clientWidth / 100;
  console.log(penSize);
  const penMachine = machine("IDLE", {
    DRAW: {
      onTouch: ({ payload }) => {
        ctx.beginPath();
        ctx.fillStyle = document.querySelector(
          'input[name="color"]:checked'
        ).value;
        ctx.arc(payload.x, payload.y, penSize, 0, 2 * Math.PI);
        ctx.fill();
      },
      on: {
        UP: "IDLE",
        DOWN: "DRAW",
        MOVE: "DRAW",
        EXIT: "IDLE",
      },
    },
    IDLE: {
      on: {
        UP: "IDLE",
        DOWN: "DRAW",
        MOVE: "IDLE",
        EXIT: "IDLE",
      },
    },
  });

  canvas.addEventListener("mousedown", (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    return penMachine.send("DOWN", {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    });
  });
  canvas.addEventListener("mouseup", (ev) => penMachine.send("UP", ev));
  canvas.addEventListener("mousemove", (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    return penMachine.send("MOVE", {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    });
  });
  canvas.addEventListener("mouseleave", (ev) => penMachine.send("EXIT", ev));
  canvas.addEventListener("touchstart", (ev) => penMachine.send("DOWN", ev));
  canvas.addEventListener("touchmove", (ev) => {
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
  canvas.addEventListener("touchend", (ev) => penMachine.send("UP", ev));
}
