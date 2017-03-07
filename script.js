// FOLLOWING THIS TUTORIAL:
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;

var dx = 2;
var dy = -2;

var ballRadius = 10;

var color = "#0095DD";

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 7;
var brickHeight = 20;
var brickPadding = 1;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickWidth = (canvas.width/brickColumnCount) - brickPadding - (brickOffsetLeft/brickColumnCount)*2;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

var score = 0;

var lives = 3;

function drawBall(color) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ff3399";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c = 0; c < brickColumnCount; c++) {
        for(r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                var randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
                ctx.fillStyle = randomColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x += dx;
    y += dy;
    drawBall(color);
    drawPaddle();
    collisionDetection();
    drawBricks();
    drawScore();
    drawLives();
    if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        color = "#"+Math.floor(Math.random()*16777215).toString(16);
    }
    if (y + dy < ballRadius) {
        dy = -dy;
        color = "#"+Math.floor(Math.random()*16777215).toString(16);
    }
    else if (y + dy > canvas.height-ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            color = "#"+Math.floor(Math.random()*16777215).toString(16);
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 5;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 5;
    }
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    color = "#"+Math.floor(Math.random()*16777215).toString(16);
                    drawBall(color);
                    score++;
                    if(score === brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }

            }
        }
    }
}

function drawScore() {
    ctx.font = "24px Amatic SC";
    ctx.fillStyle = "#ff3399";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "24px Amatic SC";
    ctx.fillStyle = "#ff3399";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

draw();
