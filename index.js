class Character {
    constructor(x, y, color, radius, speed) {
        Object.assign(this, {x, y, color, radius, speed});
    }

    draw() {
        fill(this.color);
        ellipse(this.x, this.y, this.radius * 2);
    }

    move(target) {
        this.x += (target.x - this.x) * this.speed;
        this.y += (target.y - this.y) * this.speed;
    }
}

const player = new Character(30, 30, "blue", 10, 0.05);
const enemies = [
    new Character(300, 0, "rgb(200,190,80)", 15, 0.01),
    new Character(300, 300, "rgb(240,100,250)", 17, 0.03),
    new Character(0, 300, "rgb(80,200,235)", 20, 0.003),
    new Character(20, 400, "rgb(100,170,190)", 12, 0.02),
];
const scarecrow = [];
let startingFrameCount;

function setup() {
    const canvas = createCanvas(1200, 600);
    canvas.parent('sketch');
    noStroke();
    document.body.onkeyup = function (e) {
        if (e.keyCode === 32) {
            createScarecrow();
        }
    }
}

function draw() {
    background("lightgreen");
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    scarecrow.forEach(scarecrow => scarecrow.draw());
    player.move({x: mouseX, y: mouseY});
    enemies.forEach(enemy => enemy.move(scarecrow[0] || player));
    adjust();
    if ((scarecrow[0] != null) && (frameCount - startingFrameCount >= 300)){
        scarecrow.pop();
    }
}

function adjust() {
    const characters = [player, ...enemies];
    for (let i = 0; i < characters.length; i++) {
        for (let j = i + 1; j < characters.length; j++) {
            pushOff(characters[i], characters[j]);
        }
    }
}

function pushOff(c1, c2) {
    let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
    const distance = Math.hypot(dx, dy);
    let overlap = c1.radius + c2.radius - distance;
    if (overlap > 0) {
        const adjustX = (overlap / 2) * (dx / distance);
        const adjustY = (overlap / 2) * (dy / distance);
        c1.x -= adjustX;
        c1.y -= adjustY;
        c2.x += adjustX;
        c2.y += adjustY;
    }
}

function createScarecrow() {
    if (scarecrow[0] == null) {
        startingFrameCount = frameCount;
        scarecrow[0] = new Character(player.x, player.y, 'rgba(255,255,255,0.5)', 30, 0);
    }
}
