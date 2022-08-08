let detachers = [];

function setText(selector, text) {
  document.querySelector(selector).innerText = text;
}

function listener(element, type, callback) {
  element.addEventListener(type, callback);
  const detach = () => element.removeEventListener(type, callback);
  detachers.push(detach);
}

function interval(callback, interval) {
  const intervalId = setInterval(callback, interval);
  const detach = () => clearInterval(intervalId);
  detachers.push(detach);
}

function detach() {
  detachers.forEach((d) => d());
  detachers = [];
}

function clearContext(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // On chrome android the canvas won't clear
  // unless also performing a stroke operation.
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 0);
  ctx.stroke();
}
