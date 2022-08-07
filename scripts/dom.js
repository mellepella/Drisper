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
