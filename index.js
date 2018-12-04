let backgroundImage;

const mouseSpan = document.querySelector("#mouse");

function setup()  {
  backgroundImage = loadImage("grass.png");
  const canvas = createCanvas(600, 600);
  canvas.parent('sketch');
  noStroke();
}

function draw() {
  background(backgroundImage);
  fill("black");
  ellipse(mouseX, mouseY, 20);
  mouseSpan.textContent = `(${mouseX},${mouseY})`;
}
