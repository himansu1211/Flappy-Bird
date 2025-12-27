const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawBirdSVG(x, y, color, rotation, wingFrame) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    if (wingFrame === 0) {
        ctx.ellipse(-5, -3, 8, 4, -0.4, 0, Math.PI * 2);
    } else {
        ctx.ellipse(-5, 3, 8, 4, 0.4, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.beginPath(); ctx.arc(7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(12, -2); ctx.lineTo(22, 1); ctx.lineTo(12, 4);
    ctx.fill(); ctx.stroke();
    ctx.restore();
}

function drawCloudSVG(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(20, -10, 25, 0, Math.PI * 2);
    ctx.arc(45, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

let gameState = 'MENU'; 
let selectedSkin = '#e74c3c';
const skinOptions = [
    { name: 'Phoenix', color: '#e74c3c' },
    { name: 'Blue Jay', color: '#3498db' },
    { name: 'Goldie', color: '#f1c40f' }
];
let skinIndex = 0;

let birdY, velocity, pipes, score, gameOver, frameCount, currentSpeed, currentGap;
let clouds = [], particles = [];
let highScore = localStorage.getItem('flappyHighScoreSVG') || 0;

let countdownTimer = 3;
let countdownFrame = 0;

const gravity = 0.22;
const jump = -4.2;
let wingFrame = 0;

function resetGame() {
    birdY = 200; velocity = 0; pipes = []; score = 0;
    gameOver = false; frameCount = 0; 
    currentSpeed = 1.8;
    currentGap = 140;
    particles = [];
    clouds = [
        {x: 50, y: 100, s: 0.8}, {x: 220, y: 160, s: 0.5}, {x: 380, y: 80, s: 0.7}
    ];

    countdownTimer = 3;
    countdownFrame = 0;
    gameState = 'COUNTDOWN';
}

function draw() {
    let skyColor = (score < 10) ? "#70c5ce" : (score < 20 ? "#ff7f50" : "#1a2a6c");
    ctx.fillStyle = (gameState === 'MENU') ? "#70c5ce" : skyColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.forEach(c => {
        drawCloudSVG(c.x, c.y, c.s);
        if (gameState !== 'GAMEOVER') {
            c.x -= 0.3;
            if (c.x < -120) c.x = canvas.width + 50;
        }
    });

    if (gameState === 'MENU') {
        renderMenu();
    } else if (gameState === 'COUNTDOWN') {
        updateCountdown();
    } else {
        renderGame();
    }

    frameCount++;
    requestAnimationFrame(draw);
}

function renderMenu() {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 24px Courier New";
    ctx.fillText("FLAPPY SVG", canvas.width / 2, 100);
    drawBirdSVG(canvas.width / 2, 220, selectedSkin, 0, Math.floor(frameCount / 10) % 2);
    ctx.font = "18px Courier New";
    ctx.fillText(`< ${skinOptions[skinIndex].name} >`, canvas.width / 2, 270);
    ctx.font = "14px Courier New";
    ctx.fillText("ARROWS to switch | SPACE to fly", canvas.width / 2, 340);
}

function updateCountdown() {

    drawBirdSVG(65, birdY, selectedSkin, 0, Math.floor(frameCount / 8) % 2);
    
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 60px Courier New";
    ctx.fillText(countdownTimer, canvas.width / 2, canvas.height / 2);
    
    ctx.font = "bold 20px Courier New";
    ctx.fillText("READY?", canvas.width / 2, canvas.height / 2 + 50);

    countdownFrame++;
    if (countdownFrame % 60 === 0) { 
        countdownTimer--;
        if (countdownTimer <= 0) {
            gameState = 'PLAYING';
        }
    }
}

function renderGame() {
    if (gameState === 'PLAYING') {
        velocity += gravity;
        birdY += velocity;
        currentSpeed = 1.8 + (score * 0.05); 
        currentGap = Math.max(95, 140 - (score * 1.0));

        if (frameCount % Math.floor(160 / currentSpeed * 1.5) === 0) {
            pipes.push({ x: canvas.width, y: Math.random() * (canvas.height - 250) + 50, passed: false });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= currentSpeed;
            ctx.fillStyle = "#2ecc71";
            ctx.fillRect(pipes[i].x, 0, 52, pipes[i].y);
            ctx.fillRect(pipes[i].x, pipes[i].y + currentGap, 52, canvas.height);

            if (65 + 12 > pipes[i].x && 65 - 12 < pipes[i].x + 52) {
                if (birdY - 10 < pipes[i].y || birdY + 10 > pipes[i].y + currentGap) endGame();
            }
            if (pipes[i].x + 52 < 65 && !pipes[i].passed) { score++; pipes[i].passed = true; }
            if (pipes[i].x < -52) pipes.splice(i, 1);
        }
        if (frameCount % 8 === 0) wingFrame = 1 - wingFrame;
    }

    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 4, 4);
        if(p.life <= 0) particles.splice(i, 1);
    });
    ctx.globalAlpha = 1.0;

    if (gameState !== 'GAMEOVER') {
        let rotation = Math.min(Math.PI/4, Math.max(-Math.PI/4, velocity * 0.1));
        drawBirdSVG(65, birdY, selectedSkin, rotation, wingFrame);
    }

    if (birdY > canvas.height || birdY < 0) endGame();

    ctx.fillStyle = "white";
    ctx.font = "bold 40px Courier New";
    ctx.fillText(score, canvas.width / 2, 60);

    if (gameState === 'GAMEOVER') {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Courier New";
        ctx.fillText("GAME OVER", canvas.width / 2, 200);
        ctx.font = "18px Courier New";
        ctx.fillText(`BEST: ${highScore}`, canvas.width / 2, 240);
        ctx.fillText("CLICK TO RESTART", canvas.width / 2, 320);
    }
}

function endGame() {
    if (gameState === 'PLAYING') {
        gameState = 'GAMEOVER';
        for(let i=0; i<15; i++) {
            particles.push({ x: 65, y: birdY, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: 1.0, color: selectedSkin });
        }
        if (score > highScore) { 
            highScore = score; 
            localStorage.setItem('flappyHighScoreSVG', highScore); 
        }
    }
}

const handleInput = () => {
    if (gameState === 'MENU') resetGame();
    else if (gameState === 'GAMEOVER') gameState = 'MENU';
    else if (gameState === 'PLAYING') velocity = jump;
};

window.addEventListener('keydown', (e) => {
    if (gameState === 'MENU') {
        if (e.code === 'ArrowRight') { skinIndex = (skinIndex + 1) % skinOptions.length; selectedSkin = skinOptions[skinIndex].color; }
        else if (e.code === 'ArrowLeft') { skinIndex = (skinIndex - 1 + skinOptions.length) % skinOptions.length; selectedSkin = skinOptions[skinIndex].color; }
    }
    if (e.code === 'Space' || e.code === 'ArrowUp') handleInput();
});
canvas.addEventListener('mousedown', handleInput);
draw();
