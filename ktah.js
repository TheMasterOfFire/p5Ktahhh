class Character {
    constructor(x, y, color, radius, speed, health, name, lastDecrement) {
        Object.assign(this, {x, y, color, radius, speed, health, name,lastDecrement});
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
        if (endGame !== 1) {
            if (frameCount - this.lastDecrement >= 30) {
                this.health -= attacker.radius;
                if (this.health < 0) this.health = 0;
                bar.animate(this.health / 100);
                this.lastDecrement = frameCount;
                if (this.health <= 0) {
                    endGame = 1;
                }
            }
        }
    }
}

const player = new Character(30, 30, "blue", 10, 0.05, 100, "Player", 0);
const enemies = [
    new Character(300, 0, "rgb(200,190,80)", 15, 0.01),
    new Character(300, 300, "rgb(240,100,250)", 17, 0.03),
    new Character(0, 300, "rgb(80,200,235)", 20, 0.003),
    new Character(20, 400, "rgb(100,170,190)", 12, 0.02),
];
const scarecrow = [];
let startingFrameCount;
const FPS = document.getElementById("FPSDisplay");
let lastFPS = 0;
let endGame = 0;
let runGameOverCounter = 0;
let canvasHeight = document.getElementById('bigContainer').offsetHeight;
let canvasWidth = document.getElementById('bigContainer').offsetWidth - 210;
let YouDiedChime;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch');
    noStroke();
    document.body.onkeyup = function (e) {
        if (e.keyCode === 32) {
            createScarecrow();
        }
    };
    YouDiedChime = loadSound('assets/YouDiedChime.mp3');
    bar.animate(1.0);
}

function draw() {
    background("lightgreen");
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    scarecrow.forEach(scarecrow => scarecrow.draw());
    player.move({x: mouseX, y: mouseY});
    enemies.forEach(enemy => enemy.move(scarecrow[0] || player));
    adjust();
    if ((scarecrow[0] != null) && (frameCount - startingFrameCount >= 300)) {
        scarecrow.pop();
    }
    if (frameCount - lastFPS >= 30) {
        FPS.textContent = Math.floor(frameRate());
        lastFPS = frameCount;
    }
    if (endGame === 1) gameOver();
    //if (startGame ===1) startGame();
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

// progressbar.js@1.0.0 version is used
var bar = new ProgressBar.Circle(container, {
    color: '#aaa',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 5,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: {color: '#faa', width: 1},
    to: {color: '#afa', width: 5},
    // Set default step function for all animate calls
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
    if(runGameOverCounter<1) {
        document.getElementById("popup-background").style.display = "block";
        YouDiedChime.play();
        runGameOverCounter++;
    }
}
