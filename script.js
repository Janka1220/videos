let canvas, ctx;
let cat, foods, score, lives, gameOver;
let foodImages = [];
let catImage;

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "flex";
    document.getElementById("game-container").style.background = "url('background.jpeg') no-repeat center center/cover";
    document.getElementById("game-over-screen").style.display = "none";
    
   
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    
    catImage = new Image();
    catImage.src = "cat.png";
    
    foodImages = [new Image(), new Image(), new Image()];
    foodImages[0].src = "food1.png";
    foodImages[1].src = "food2.png";
    foodImages[2].src = "food3.png";

    badImages = [new Image(), new Image(), new Image()];
    badImages[0].src = "trash1.png";
    badImages[1].src = "trash2.png";
    badImages[2].src = "trash3.png";

   
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
    lives = 3;
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
        document.getElementById("game-over-screen").style.display = "none";
        document.getElementById("game-container").style.background = "url('menu-background.jpeg') no-repeat center center/cover";


    foods = [];
    score = 0;
    lives = 3;
    gameOver = false;


}


function extraFunction() {
    document.getElementById('login-modal').style.display = 'flex';
}


window.addEventListener('DOMContentLoaded', function() {
document.getElementById('close-login').addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex'; 
});
});


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
    const isBad = Math.random() < 0.5;
    const imgArray = isBad ? badImages : foodImages;
    const imageIndex = Math.floor(Math.random() * imgArray.length);
    foods.push({ x: x, y: -40, img: imgArray[imageIndex], isBad: isBad });
}

function moveCat() {
    if (cat.moveLeft && cat.x > 0) cat.x -= cat.speed;
    if (cat.moveRight && cat.x + cat.width < canvas.width) cat.x += cat.speed;
}

function moveFoods() {
    for (let i = foods.length - 1; i >= 0; i--) {
        foods[i].y += 3;

        if (
            foods[i].y + 40 > cat.y &&
            foods[i].x > cat.x &&
            foods[i].x < cat.x + cat.width
        ) {
            if (foods[i].isBad) {
                lives--;
                if (lives <= 0) {
                gameOver = true;
                startGameOver();
                }
            } 
            else {
                score++;
            }
            foods.splice(i, 1);
        } else if (foods[i].y > canvas.height) {
           foods.splice(i, 1);
        }
    }
}

function drawCat() {
    ctx.drawImage(catImage, cat.x, cat.y, cat.width, cat.height);
}

function drawFoods() {
    foods.forEach(food => {
        ctx.drawImage(food.img, food.x, food.y, 80, 80);
    });
}

function drawScoreAndLives() {
    ctx.fillStyle = "#072530";
    ctx.font = "20px 'Arial Rounded MT Bold', Arial, sans-serif";
    ctx.fillText("Score: " + score, 10, 30);
    
    
    const heartImage = new Image();
    heartImage.src = "heart.png"; 
    
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, canvas.width - 30 - (i * 30), 10, 25, 25);
    }
}


function startGameOver() {
    document.getElementById("final-score").textContent = "Your Score: " + score;
    document.getElementById("game-over-screen").style.display = "flex";
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
        startGameOver();
    }
    if (Math.random() < 0.02) createFood();
    if (!gameOver) requestAnimationFrame(gameLoop);
}