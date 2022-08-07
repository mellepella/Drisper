function cloneCanvas(oldCanvas) {
  var newCanvas = document.createElement("canvas");
  var context = newCanvas.getContext("2d");
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  context.drawImage(oldCanvas, 0, 0);
  return newCanvas;
}
