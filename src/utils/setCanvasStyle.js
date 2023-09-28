export function setCanvasStyle(map, size) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  /* 设置半径 */
  let radius = size / 4;
  /* 绘制 */
  let increase = true;
  /* 25~35 */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#ff2d51";
    ctx.fill();
    if (radius > 35) {
      increase = false;
    } else if (radius < 25) {
      increase = true;
    }
    if (increase) {
      radius++;
    } else {
      radius--;
    }
    setTimeout(draw, 50);
    /* render 走完一次 地图重新渲染 */
    map.render();
  }
  draw();
  /* 设置canvas元素为openlayers的样式 */
  let style = new ol.style.Style({
    image: new ol.style.Icon({
      img: canvas,
      imgSize: [canvas.width, canvas.height],
    }),
  });
  return style;
}
