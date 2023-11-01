function initializeGame() {
    // Oyunun başlangıcında canvas ve context alınıyor.
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");

    // Oyun alanı parametreleri ve diğer değişkenler tanımlanıyor.
    const tileSize = 70;
    const numRows = 8;
    const numCols = 8;
    const color1 = "#dbcb48";
    const color2 = "#fff";
    const gameTime = 6000;

    let countdown = 5;
    let countdownInterval = false;
    let level = 1;
    let successMessageVisible = false;

    // Geri sayım başlatma fonksiyonu
    function startCountdown() {
        countdownInterval = setInterval(function () {
            // Eğer başarı mesajı görünüyorsa, geri sayımı durdur
            if (successMessageVisible) {
                clearInterval(countdownInterval);
                return;
            }
            // Eğer successMessageVisible true ise
            if (successMessageVisible) {
                // successMessageVisible'ı false yap
                successMessageVisible = false;
            }

    
            // Eğer geri sayım sıfıra ulaştıysa
            if (countdown === 0) {
                clearInterval(countdownInterval);
                updateCountdownDisplay("Süreniz Doldu");
                setTimeout(startNewLevel, 1000);
                shakePlayer(1000);
            } else {
                // Geri sayımı güncelle ve bir saniye azalt
                updateCountdownDisplay(countdown + " saniye");
                countdown--;
            }
        }, 1000);
    }
    

    // Yeni seviye başlatma fonksiyonu
    function startNewLevel() {
        level++;
        countdown = 5;
        updateCountdownDisplay("Başlat");
        document.getElementById("level").textContent = `Level: ${level}`;
        drawBoard();
        drawTarget();
    }

    // Sayacı güncelleme fonksiyonu
    const countdownElement = document.getElementById("countdown");
    const codePanelCountdownElement = document.getElementById("codeGame-control-code-sequence");

    function updateCountdownDisplay(message) {
        countdownElement.textContent = message;
        codePanelCountdownElement.textContent = message;
    }

    // Oyun alanı oluşturma
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

    // Oyuncu resmi ve başlangıç konumu
    const img = new Image();
    img.src = "img/w3lynx_200.png";
    let imgX = 0;
    let imgY = 0;

    // Oyuncu resmi yüklendikten sonra oyun alanını ve oyuncuyu çizme
    img.onload = function () {
        drawBoard();
        drawImage(imgX, imgY);
    };

    // Oyun alanını çizme fonksiyonu
    function drawBoard() {
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                ctx.fillStyle = board[row][col];
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }

    // Oyuncu resmini çizme fonksiyonu
    function drawImage(x, y) {
        ctx.drawImage(img, x, y, tileSize, tileSize);
    }

    // Oyuncuyu titretme fonksiyonu
    let shakeStartTime = 0;
    let shakeIntensity = 10;

    function shakePlayer(duration) {
        if (shakeStartTime === 0) {
            shakeStartTime = Date.now();

            const originalX = imgX;
            const originalY = imgY;

            // Titreme animasyonunu güncelleme fonksiyonu
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
    targetImg.src = "img/cones.jpeg";
    let targetX, targetY;

    // Rastgele bir hedef pozisyonu oluşturan fonksiyon
    function generateRandomPosition() {
        targetX = Math.floor(Math.random() * numCols) * tileSize;
        targetY = Math.floor(Math.random() * numRows) * tileSize;
    }

    // İki nokta arasında çarpışma kontrolü yapan fonksiyon
    function isColliding(x1, y1, x2, y2) {
        return x1 === x2 && y1 === y2;
    }

    // Hedef resmi yüklendikten sonra hedefi çizme fonksiyonu
    targetImg.onload = function () {
        drawTarget();
    };

    // Hedefi çizme fonksiyonu
    function drawTarget() {
        // Hedefin pozisyonunu rastgele oluştur ve oyuncu ile çakışıyorsa tekrar oluştur
        generateRandomPosition();
        while (isColliding(targetX, targetY, imgX, imgY)) {
            generateRandomPosition();
        }
        // Hedef resmini çiz
        ctx.drawImage(targetImg, targetX, targetY, tileSize, tileSize);
    }

    // İlk hedefi çiz
    drawTarget();





    //play butonu
    const playButton = document.getElementById("codeGame-button-play");
    playButton.addEventListener("click", function () {
        if (true) {
            if (successMessageVisible) {
                // successMessageVisible'ı false yap
                successMessageVisible = false;
            }
            startCountdown();
            clearTimeout(timeout);
            startGameTimer();
        }
        countdown = 5;
        imgX = 0;
        imgY = 0;
        drawBoard();
        drawImage(imgX, imgY);
        drawTarget();
        updateCountdownDisplay(countdown + " saniye");
        codePanelCountdownElement.textContent = countdown + " saniye";
    });
    
    //temizle
    const trashButton = document.getElementById("codeGame-button");
    trashButton.addEventListener("click", function () {
        // Oyunu sıfırla: seviyeyi, sayacı, görsel elemanları vb. başlangıç değerlerine döndür
        level = 1;
        document.getElementById("level").textContent = `Level: ${level}`;
        countdown = 5;
        updateCountdownDisplay("Başlat");
        codePanelCountdownElement.textContent = "Başlat";
        imgY = 0;
        drawBoard();
        drawImage(imgX, imgY);
        drawTarget();
        clearInterval(countdownInterval); // Sayacın interval'ını temizle
        countdownInterval = false;
        clearTimeout(timeout); // Timeout'ları temizle
    });


    let successTimeout;
    let timeout;

    // Başarı mesajını gösteren fonksiyon
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
        
        clearInterval(countdownInterval); // Sayacın interval'ını temizle
        countdown = 5;
        // Belirli bir süre sonra başarı mesajını temizleyip oyunu devam ettir
        successTimeout = setTimeout(() => {
            successMessageVisible = false;
            ctx.clearRect(0, 0, c.width, c.height);
            drawTarget();
            drawBoard();
            drawImage(imgX, imgY);
            level++;
            document.getElementById("level").textContent = `Level: ${level}`;
        }, 1000);
    }

    function showTimeoutMessage() {
        // Eğer başarı mesajı gösteriliyorsa veya başarı mesajı timeout'ı varsa, işlemi sonlandır
        if (successMessageVisible || successTimeout) {
            return;
        }
    
        successMessageVisible = true;
    
        // Oyuncuyu titret ve görsel elemanları düzenle
        shakePlayer(1000);
    
        ctx.clearRect(0, 0, c.width, c.height);
        drawBoard();
        drawImage(imgX, imgY);
        codePanelCountdownElement.textContent = "Süre Doldu";
        updateCountdownDisplay("Süre Doldu");
        
        // Belirli bir süre sonra başarı mesajını temizleyip oyunu sıfırla
        timeout = setTimeout(() => {
            successMessageVisible = false;
            ctx.clearRect(0, 0, c.width, c.height);
            drawTarget();
            drawBoard();
            drawImage(imgX, imgY);
            
            ctx.fillStyle = "red";
            ctx.font = "30px Freckle Face";
            ctx.fillText("Süreniz Doldu!", 180, 250);
            
            level = 1;
            document.getElementById("level").textContent = `Level: 1 ${level}`;
        }, 1000);
    }
    

    // Oyun zamanlayıcını başlatan fonksiyon
    function startGameTimer() {
        // Belirli bir süre sonra oyun zaman aşımına uğrarsa showTimeoutMessage fonksiyonunu çağır
        timeout = setTimeout(() => {
            if (successMessageVisible) {
                return;
            }
            showTimeoutMessage();
        }, gameTime);
    }

    // Oyun zamanlayıcını başlat




    //hareketler butonlar
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




    //hareket ettikçe sayfa kaymasın
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    });
}


// Sayfa yüklendiğinde oyunu başlatmak için initializeGame
document.addEventListener("DOMContentLoaded", initializeGame);
