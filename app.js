var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d'),
  requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

var WIDTH = document.documentElement.clientWidth,
  HEIGHT = document.documentElement.clientHeight;

var circles = [],
  c1 = 43,
  c1S = 1,
  c2 = 205,
  c2S = 1,
  c3 = 255,
  c3S = 1,
  yS = 1,
  it = 0,
  totIt = 0,
  changeFreq = 100,
  popInterval = 75,
  gCO1 = "lighter",
  gCO2 = "lighter",
  gCOchangeFreq = 1000,
  maxPopulation = 300;

canvas.setAttribute("width", WIDTH);
canvas.setAttribute("height", HEIGHT);

function Circle(id) {
  this.id = id;
  this.r = 4;//Math.floor(Math.random()*2)+3;
  this.a = 1;
  this.x = Math.floor(Math.random() * WIDTH); //Math.floor(WIDTH/2);
  this.y = Math.floor(Math.random() * HEIGHT); //Math.floor(HEIGHT/2);
  this.color = "rgba(" + c1 + "," + c2 + "," + c3 + "," + this.a + ")";
  this.dir = Math.floor(Math.random() * 4);
  this.speed = 1;
  this.type = Math.floor(Math.random() * 2) == 1 ? "line" : "spiral";
  this.type = "line";
  this.s = Math.floor(Math.random() * 2);
  this.aReduction = .002;
}

Circle.prototype.walkLine = function() {
  if (this.dir == 0) {
    this.x += this.speed;
    this.y += this.speed;
  }
  if (this.dir == 1) {
    this.x += this.speed;
    this.y -= this.speed;
  }
  if (this.dir == 2) {
    this.x -= this.speed;
    this.y += this.speed;
  }
  if (this.dir == 3) {
    this.x -= this.speed;
    this.y -= this.speed;
  }

  this.draw();
}

Circle.prototype.walkSpiral = function() {
  this.dir++;
  this.speed += .001;
  this.x = this.x + Math.cos(degToRad(this.dir)) * this.speed;
  this.y = this.y + Math.sin(degToRad(this.dir)) * this.speed;
  this.draw();
}

Circle.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillRect(this.x, this.y, this.r, this.r);
  //ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.closePath();
  if (this.a > 0) this.a -= this.aReduction;
  if (this.a <= 0) {
    this.a = 0;
    this.die();
  }
  this.color = "rgba(" + c1 + "," + c2 + "," + c3 + "," + this.a + ")";
}

Circle.prototype.changeDir = function() {
  var newDir = Math.floor(Math.random() * 4);
  if (this.dir == newDir ||
    (this.dir == 0 && newDir == 3) ||
    (this.dir == 1 && newDir == 2) ||
    (this.dir == 2 && newDir == 1) ||
    (this.dir == 3 && newDir == 0)) {
    this.changeDir();
    return;
  } else {
    this.dir = newDir;
  }

}

Circle.prototype.die = function() {
  circles[this.id] = null;
  delete circles[this.id];
}

function animate() {
  it++;
  totIt++;
  if (totIt % gCOchangeFreq == 0) {
    if (gCO1 == "lighter") {
      gCO1 = "source-over";
      gCOchangeFreq = 250;
    } else {
      gCO1 = "lighter";
      gCOchangeFreq = 1000;
    }
  }
  ctx.globalCompositeOperation = gCO1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0,0,0,.03)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.globalCompositeOperation = "lighter";

  ctx.shadowColor = "rgba(" + c1 + ", " + c2 + ", " + c3 + ", 1)";
  ctx.shadowBlur = 25;

  for (var i in circles) {
    if (it == changeFreq) {
      if (circles[i].type == "line") circles[i].changeDir();
      if (circles[i].type == "spiral") circles[i].s *= -1;
    }
    if (circles[i].type == "line") circles[i].walkLine();
    else circles[i].walkSpiral();
  }
  if (it == changeFreq) it = 0;

  changeColor();
  requestAnimationFrame(animate);
}

function changeColor() {
  if (c1 == 0 || c1 == 255) c1S *= -1;
  if (c2 == 0 || c2 == 255) c2S *= -1;
  if (c3 == 0 || c3 == 255) c3S *= -1;
  c1 += 1 * c1S;
  c2 += 1 * c2S;
  c3 += 1 * c3S;
}

init();

function init() {
  ctx.globalCompositeOperation = "lighter";
  for (var i = 0; i < 1; i++) {
    circles[i] = new Circle(i);
    if (i == 0) circles[i].dir = 0;
    if (i == 1) circles[i].dir = 1;
    if (i == 2) circles[i].dir = 2;
    if (i == 3) circles[i].dir = 3;

    animate();
  }
  setInterval(function() {
    circles[circles.length] = new Circle();
  }, popInterval);
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

window.onresize = function() {
  WIDTH = document.documentElement.clientWidth;
  HEIGHT = document.documentElement.clientHeight;
  
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
console.log(WIDTH*HEIGHT);  
}

console.log(WIDTH*HEIGHT);
