document.body.addEventListener("keypress", startGame);
let popupBackground = document.getElementById("popup-background");
let popupEnd = document.getElementById("popup-end");
let popupStart = document.getElementById("popup-start");
let gameRun = 0;
let pause = 0;

function startGame() {
    if (gameRun < 1) {
        popupBackground.style.display = "none";
        popupStart.style.display = "none";
        gameRun++;
    }
}


class Character {
    constructor(x, y, color, radius, speed, health, name, lastDecrement) {
        Object.assign(this, {x, y, color, radius, speed, health, name, lastDecrement});
    }

    draw() {
        fill(this.color);
        ellipse(this.x, this.y, this.radius * 2);
    }

    move(target) {
        this.x += (target.x - this.x) * this.speed;
        this.y += (target.y - this.y) * this.speed;
    }

    decrementHealth(attacker) {
        if (frameCount - this.lastDecrement >= 30) {
            this.health -= attacker.radius;
            if (this.health < 0) this.health = 0;
            bar.animate(this.health / 100);
            this.lastDecrement = frameCount;
            if (this.health <= 0) {
                gameOver();
            }
        }
    }
}

let YouDiedChime;
const canvasHeight = document.getElementById('bigContainer').offsetHeight;
const canvasWidth = document.getElementById('bigContainer').offsetWidth - 210;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch');
    noStroke();
    YouDiedChime = loadSound('assets/YouDiedChime.mp3');
    bar.animate(1.0);
}

const player = new Character(canvasWidth / 2, canvasHeight / 2, "rgb(0,100,0)", 15, 0.05, 100, "Player", 0);
const enemies = [
    new Character(0, 0, "rgb(126,64,2)", 15, 0.05),
    new Character(canvasWidth, 0, "rgb(126,64,2)", 15, 0.02),
    new Character(canvasWidth, canvasHeight, "rgb(126,64,2)", 15, 0.07)
];
const scarecrow = [];
let startingFrameCount;
const FPS = document.getElementById("FPSDisplay");
let lastFPS = 0;
const radioMouse = document.getElementById("mouse");
const radioArrows = document.getElementById("arrows");
const radioWASD = document.getElementById("WASD");

function draw() {
    if(gameRun > 0 && pause === 0) {
    background("lightgreen");
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    scarecrow.forEach(scarecrow => scarecrow.draw());
    if (radioMouse.checked) player.move({x: mouseX, y: mouseY});
    enemies.forEach(enemy => enemy.move(scarecrow[0] || player));
    adjust();
    if ((scarecrow[0] != null) && (frameCount - startingFrameCount >= 300)) {
        scarecrow.pop();
    }
    if (frameCount - lastFPS >= 30) {
        FPS.textContent = Math.floor(frameRate());
        lastFPS = frameCount;
    }
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
        if (c1.name === "Player") {
            c1.decrementHealth(c2);
        } else if (c2.name === "Player") {
            c2.decrementHealth(c1);
        }
    }
}

function createScarecrow() {
    if (scarecrow[0] == null) {
        startingFrameCount = frameCount;
        scarecrow[0] = new Character(player.x, player.y, 'rgba(255,255,255,0.5)', 30, 0);
    }
}

var bar = new ProgressBar.Circle(container, {
    color: '#aaa',
    strokeWidth: 5,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 500,
    text: {
        autoStyleContainer: false
    },
    from: {color: '#faa', width: 1},
    to: {color: '#afa', width: 5},
    step: function (state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
        var value = Math.round(circle.value() * 100);
        if (value === 0) {
            circle.setText('Player Health');
        } else {
            circle.setText(value);
        }
    }
});
bar.text.style.fontFamily = 'Century Gothic, Helvetica, sans-serif';
bar.text.style.fontSize = '2rem';

function gameOver() {
        popupBackground.style.display = "block";
        popupEnd.style.display = "block";
        YouDiedChime.play();
        noLoop();
}

function keyPressed() {
    switch (keyCode) {
        case 32:
            createScarecrow();
            break;
        case 82:
            location.reload();
            break;
        case 80:
            togglePause();
            break;
    }

    if (radioArrows.checked) {
        console.log("arrows!");
        switch (keyCode) {
            case UP_ARROW:
                player.move({x: player.x, y: player.y + 30});
                break;
            case DOWN_ARROW:
                player.move({x: player.x, y: player.y - 30});
                break;
            case LEFT_ARROW:
                player.move({x: player.x - 30, y: player.y});
                break;
            case RIGHT_ARROW:
                player.move({x: player.x + 30, y: player.y});
                break;
        }
    }
        if (radioWASD.checked) {

        }
}

function togglePause(){
    pause===0 ? pause = 1 : pause = 0;
}
