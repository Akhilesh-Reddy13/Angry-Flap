let canvas, cx, player, pipe1;
let pipes, pipeWidth, gap, minPipeHeight, pipeSpacing;
let score, maxScore, playerY, playerX, velocity, gravity;

function initGame() {
    pipes = [];
    pipeWidth = 60;
    gap = 120;
    minPipeHeight = 50;
    pipeSpacing = 250;
    score = 0;
    playerY = canvas.width / 2;
    playerX = 0;
    velocity = 0;
    gravity = 0.01;

    for (let i = 0; i < 3; i++) {
        let topPipeHeight = Math.floor(Math.random() * (canvas.height - gap - minPipeHeight * 2) + minPipeHeight);
        pipes.push({
            x: canvas.width + i * pipeSpacing,
            topHeight: topPipeHeight,
            bottomY: topPipeHeight + gap,
            bottomHeight: canvas.height - (topPipeHeight + gap)
        });
    }
}

async function main() {
    canvas = document.getElementById("canva");
    cx = canvas.getContext("2d");
    player = new Image();
    player.src = './images/b1.png';
    pipe1 = new Image();
    pipe1.src = './images/pipe1.png';
    maxScore = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        e.preventDefault();
        if (e.code === "ArrowUp") {
            velocity = -0.85;
        }
        if (e.code === "ArrowDown") {
            velocity = 0.85;
        }
    }
    });
    
    let imagesLoaded = 0;
    function tryStartGame() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            initGame();
            draw();
        }
    }

    player.onload = tryStartGame;
    pipe1.onload = tryStartGame;

    function draw() {
        document.getElementById("score1").innerHTML = score;
        document.getElementById("maxScore1").innerHTML = maxScore;
        cx.clearRect(0, 0, canvas.width, canvas.height);
        cx.drawImage(player, playerX, playerY, 40, 40);
        velocity += gravity;
        playerY += velocity;

        if (playerY < 0) {
            playerY = 0;
            velocity = 0;
        }
        if (playerY > canvas.height - 40) {
            playerY = canvas.height - 40;
            velocity = 0;
        }
        for (let pipe of pipes) {
            cx.drawImage(pipe1, pipe.x, 0, pipeWidth, pipe.topHeight);
            cx.drawImage(pipe1, pipe.x, pipe.bottomY, pipeWidth, pipe.bottomHeight);
            pipe.x -= 1;

            if (pipe.x + pipeWidth < 0) {
                // Find the rightmost pipe
                let rightmostX = Math.max(...pipes.map(p => p.x));
                pipe.x = rightmostX + pipeSpacing;
                pipe.topHeight = Math.floor(Math.random() * (canvas.height - gap - minPipeHeight * 2) + minPipeHeight);
                pipe.bottomY = pipe.topHeight + gap;
                pipe.bottomHeight = canvas.height - (pipe.topHeight + gap);
            }
            if (playerX == pipe.x && (playerY < pipe.topHeight || playerY > pipe.bottomY)) {
                alert("game over");
                if (score > maxScore) {
                    maxScore = score;
                    alert("New High Score: " + maxScore);
                }
                initGame();
                draw(); 
                return;
            }
            if (playerX == pipe.x && (playerY > pipe.topHeight && playerY < pipe.bottomY)) {
                score += 1;
            }
        }
        requestAnimationFrame(draw);
    }

    player.onload = () => {
        pipe1.onload = () => {
            initGame();
            draw();
        }
    }
}

window.onload = main;