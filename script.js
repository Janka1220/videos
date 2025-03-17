let canvas, ctx;
let cat, foods, score, lives, gameOver;
let foodImages = [];
let catImage;

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "flex";
    document.getElementById("game-container").style.background = "url('background.jpeg') no-repeat center center/cover";
    
   
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    
    catImage = new Image();
    catImage.src = "cat.png";
    
    foodImages = [new Image(), new Image(), new Image()];
    foodImages[0].src = "food1.png";
    foodImages[1].src = "food2.png";
    foodImages[2].src = "food3.png";

   
    cat = {
        x: canvas.width / 2 - 50,
        y: canvas.height - 150,
        width: 150,
        height: 150,
        speed: 15,
        moveLeft: false,
        moveRight: false
    };

    foods = [];
    score = 0;
    lives = 5;
    gameOver = false;

    
    let imagesLoaded = 0;
    let totalImages = foodImages.length + 1;

    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            gameLoop(); 
        }
    }

    catImage.onload = imageLoaded;
    foodImages.forEach(img => img.onload = imageLoaded);
}

function quitGame() {
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "flex";
    document.getElementById("game-container").style.background = "url('menu-background.jpeg') no-repeat center center/cover";
}

function extraFunction() {
    alert("Bottom left button clicked!");
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") cat.moveLeft = true;
    if (event.key === "ArrowRight") cat.moveRight = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") cat.moveLeft = false;
    if (event.key === "ArrowRight") cat.moveRight = false;
});

function createFood() {
    const x = Math.random() * (canvas.width - 40) + 20;
    const imageIndex = Math.floor(Math.random() * foodImages.length);
    foods.push({ x: x, y: -40, img: foodImages[imageIndex] });
}

function moveCat() {
    if (cat.moveLeft && cat.x > 0) cat.x -= cat.speed;
    if (cat.moveRight && cat.x + cat.width < canvas.width) cat.x += cat.speed;
}

function moveFoods() {
    for (let i = foods.length - 1; i >= 0; i--) {
        foods[i].y += 2; 
        if (foods[i].y > canvas.height) {
            foods.splice(i, 1);
            lives--;
            if (lives <= 0) gameOver = true;
        } else if (
            foods[i].y + 40 > cat.y &&
            foods[i].x > cat.x &&
            foods[i].x < cat.x + cat.width
        ) {
            foods.splice(i, 1);
            score++;
        }
    }
}

function drawCat() {
    ctx.drawImage(catImage, cat.x, cat.y, cat.width, cat.height);
}

function drawFoods() {
    foods.forEach(food => {
        ctx.drawImage(food.img, food.x, food.y, 60, 60);
    });
}

function drawScoreAndLives() {
    ctx.fillStyle = "#072530";
    ctx.font = "20px 'Arial Rounded MT Bold', Arial, sans-serif";
    ctx.fillText("Score: " + score, 10, 30);
    
    
    const heartImage = new Image();
    heartImage.src = "heart.png"; 
    
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, canvas.width - 30 - (i * 30), 10, 25, 25); // Right to left
    }
}


function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2 - 50);
    ctx.font = "30px Arial";
    ctx.fillText("Final Score: " + score, canvas.width / 2 - 100, canvas.height / 2);
    document.getElementById("quit-button").style.display = "block";
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameOver) {
        moveCat();
        moveFoods();
        drawCat();
        drawFoods();
        drawScoreAndLives();
    } else {
        drawGameOver();
    }
    if (Math.random() < 0.02) createFood();
    if (!gameOver) requestAnimationFrame(gameLoop);
}