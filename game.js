document.addEventListener("DOMContentLoaded", function () {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");

    const tileSize = 70;
    const numRows = 8;
    const numCols = 8;
    const color1 = "#dbcb48";
    const color2 = "#fff";
    const gameTime = 6000;

    let countdown = 5;
    let countdownInterval;
    let level = 1; 

    function startCountdown() {
        countdownInterval = setInterval(function () {
            if (countdown === 0) {
                clearInterval(countdownInterval);
                updateCountdownDisplay("Süreniz Doldu");
                setTimeout(startNewLevel, 1000); 
            } else {
                updateCountdownDisplay(countdown + " saniye");
                countdown--;
            }
        }, 1000);
    }

    function startNewLevel() {
        level++;
        countdown = 5;
        updateCountdownDisplay("Başlat");
        document.getElementById("level").textContent = `Level: ${level}`;
        drawTarget();
    }

    const countdownElement = document.getElementById("countdown");
    const codePanelCountdownElement = document.getElementById("codeGame-control-code-sequence");

    function updateCountdownDisplay(message) {
        countdownElement.textContent = message;
        codePanelCountdownElement.textContent = message;
    }

    startCountdown();

    const board = [];

    for (let row = 0; row < numRows; row++) {
        board[row] = [];
        for (let col = 0; col < numCols; col++) {
            if ((row + col) % 2 === 0) {
                board[row][col] = color1;
            } else {
                board[row][col] = color2;
            }
        }
    }

    //oyuncu
    const img = new Image();
    img.src = "/img/w3lynx_200.png";
    let imgX = 0;
    let imgY = 0;

    img.onload = function () {
        drawBoard();
        drawImage(imgX, imgY);
    };

    function drawBoard() {
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                ctx.fillStyle = board[row][col];
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }

    function drawImage(x, y) {
        ctx.drawImage(img, x, y, tileSize, tileSize);
    }

   
let shakeStartTime = 0;
let shakeIntensity = 10; 


function shakePlayer(duration) {
    if (shakeStartTime === 0) {
        shakeStartTime = Date.now();

        const originalX = imgX; 
        const originalY = imgY;

        function updateShake() {
            const currentTime = Date.now();
            const elapsedTime = currentTime - shakeStartTime;

            if (elapsedTime < duration) {
                const xOffset = (Math.random() - 0.5) * shakeIntensity;
                const yOffset = (Math.random() - 0.5) * shakeIntensity;
                imgX = originalX + xOffset;
                imgY = originalY + yOffset;

               
                ctx.clearRect(0, 0, c.width, c.height);
                drawBoard();
                drawImage(imgX, imgY);

                requestAnimationFrame(updateShake);
            } else {
                
                imgX = originalX;
                imgY = originalY;
                ctx.clearRect(0, 0, c.width, c.height);
                drawBoard();
                drawImage(imgX, imgY);

                shakeStartTime = 0; 
            }
        }

        requestAnimationFrame(updateShake);
    }
}


    //hedef
    const targetImg = new Image();
    targetImg.src = "/img/cones.jpeg";
    let targetX, targetY;

    function generateRandomPosition() {
        targetX = Math.floor(Math.random() * numCols) * tileSize;
        targetY = Math.floor(Math.random() * numRows) * tileSize;
    }

    function isColliding(x1, y1, x2, y2) {
        return x1 === x2 && y1 === y2;
    }

    function drawTarget() {
        generateRandomPosition();
        while (isColliding(targetX, targetY, imgX, imgY)) {
            generateRandomPosition();
        }
        targetImg.onload = function () {
            ctx.drawImage(targetImg, targetX, targetY, tileSize, tileSize);
        };
    }

    drawTarget();

    const playButton = document.getElementById("codeGame-button-play");
    playButton.addEventListener("click", function () {
        if (countdownInterval) {
            startCountdown();
        }
        imgX = 0;
        imgY = 0;
        drawBoard();
        drawImage(imgX, imgY);
        drawTarget();
        updateCountdownDisplay(countdown + " saniye");
        codePanelCountdownElement.textContent = countdown + " saniye";
    });


    const trashButton = document.getElementById("codeGame-button");
    trashButton.addEventListener("click", function () {
        level = 1; 
        document.getElementById("level").textContent = `Level: ${level}`; 
        countdown = 5; 
        updateCountdownDisplay("Başlat");
        codePanelCountdownElement.textContent = "Başlat"; 
        imgY = 0;
        drawBoard();
        drawImage(imgX, imgY);
        drawTarget();
    });

    let successMessageVisible = false;
    let successTimeout;
    let timeout;

    function showSuccessMessage() {
        if (successTimeout) {
            clearTimeout(successTimeout);
        }
        successMessageVisible = true;
        ctx.clearRect(0, 0, c.width, c.height);
        drawBoard();
        drawImage(imgX, imgY);
        ctx.fillStyle = "green";
        ctx.font = "30px Freckle Face";
        ctx.fillText("Başarılı!", 230, 250);
        codePanelCountdownElement.textContent = "Başarılı";

        clearInterval(countdownInterval);

        successTimeout = setTimeout(() => {
            successMessageVisible = false;
            // codePanelCountdownElement.textContent = ""; // Code paneldeki metni temizle
            drawTarget();
         
            ctx.clearRect(0, 0, c.width, c.height);
            drawBoard();
            drawImage(imgX, imgY);
            level++; // Seviyeyi artır
            document.getElementById("level").textContent = `Level: ${level}`;
        }, 1000);
    }

    function showTimeoutMessage() {
        if (successMessageVisible) {
            return;
        }
        if (successTimeout) {
            clearTimeout(successTimeout);
        }
        successMessageVisible = true;
    
        
        shakePlayer(1000);
    
        ctx.clearRect(0, 0, c.width, c.height);
        drawBoard();
        drawImage(imgX, imgY);
        ctx.fillStyle = "red";
        ctx.font = "30px Freckle Face";
        ctx.fillText("Süreniz Doldu!", 180, 250);
        codePanelCountdownElement.textContent = "Süre Doldu";
        updateCountdownDisplay("Süre Doldu");
    
        timeout = setTimeout(() => {
            successMessageVisible = false;
            drawTarget();
            ctx.clearRect(0, 0, c.width, c.height);
            drawBoard();
            drawImage(imgX, imgY);
            document.getElementById("level").textContent = `Level: 1`;
            level = 1;
        }, 3000);
    }
    
    
    
    function startGameTimer() {
        timeout = setTimeout(() => {
            if (successMessageVisible) {
                return;
            }
            showTimeoutMessage();
        }, gameTime);
    }

    startGameTimer();

    document.addEventListener("keydown", function (event) {
        if (successMessageVisible) {
            return;
        }

        if (event.key === "ArrowUp" && imgY > 0) {
            imgY -= tileSize;
        } else if (event.key === "ArrowDown" && imgY < (numRows - 1) * tileSize) {
            imgY += tileSize;
        } else if (event.key === "ArrowLeft" && imgX > 0) {
            imgX -= tileSize;
        } else if (event.key === "ArrowRight" && imgX < (numCols - 1) * tileSize) {
            imgX += tileSize;
        }

        if (isColliding(targetX, targetY, imgX, imgY)) {
            showSuccessMessage();
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
            drawBoard();
            drawImage(imgX, imgY);
        }
    });

    const leftButton = document.getElementById("codeGame-button-left");
    const rightButton = document.getElementById("codeGame-button-right");
    const upButton = document.getElementById("codeGame-button-up");
    const downButton = document.getElementById("codeGame-button-down");

    leftButton.addEventListener("click", () => {
        if (successMessageVisible) {
            return;
        }

        if (imgX > 0) {
            imgX -= tileSize;
        }

        if (isColliding(targetX, targetY, imgX, imgY)) {
            showSuccessMessage();
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
            drawBoard();
            drawImage(imgX, imgY);
        }
    });

    rightButton.addEventListener("click", () => {
        if (successMessageVisible) {
            return;
        }

        if (imgX < (numCols - 1) * tileSize) {
            imgX += tileSize;
        }

        if (isColliding(targetX, targetY, imgX, imgY)) {
            showSuccessMessage();
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
            drawBoard();
            drawImage(imgX, imgY);
        }
    });

    upButton.addEventListener("click", () => {
        if (successMessageVisible) {
            return;
        }

        if (imgY > 0) {
            imgY -= tileSize;
        }

        if (isColliding(targetX, targetY, imgX, imgY)) {
            showSuccessMessage();
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
            drawBoard();
            drawImage(imgX, imgY);
        }
    });

    downButton.addEventListener("click", () => {
        if (successMessageVisible) {
            return;
        }

        if (imgY < (numRows - 1) * tileSize) {
            imgY += tileSize;
        }

        if (isColliding(targetX, targetY, imgX, imgY)) {
            showSuccessMessage();
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
            drawBoard();
            drawImage(imgX, imgY);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    });
});
