const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreText = document.getElementById('scoreText');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10},
];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let gameRunning = false;

const MOVE_INTERVAL = 1000; // 控制蛇的移动速度（毫秒）
let lastMoveTime = 0;

let lastRenderTime = 0;
const FRAME_RATE = 165; // 设置目标帧率为120FPS
const FRAME_INTERVAL = 1000 / FRAME_RATE; // 计算每帧之间的时间间隔
let gameAnimationFrame;

// 控制蛇的移动
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

function drawGame() {
    // 清空画布
    ctx.fillStyle = '#fff0f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 画食物（也改成圆形）
    ctx.fillStyle = '#ff1493';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2, 
        food.y * gridSize + gridSize/2, 
        gridSize/2 - 1, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
    
    // 画蛇身
    snake.forEach((segment, index) => {
        ctx.fillStyle = '#ff69b4';
        ctx.beginPath();
        ctx.arc(
            segment.x * gridSize + gridSize/2, 
            segment.y * gridSize + gridSize/2, 
            gridSize/2 - 1, 
            0, 
            Math.PI * 2
        );
        ctx.fill();

        // 给蛇身添加更深色的边框，使圆形更加立体
        ctx.strokeStyle = '#ff1493';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreText.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
    
    // 检查游戏结束条件
    if (isGameOver()) {
        endGame();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function isGameOver() {
    const head = snake[0];
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || 
        head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // 检查是否撞到自己的身体
    // 从第1个身体部分开始检查（跳过头部的索引0）
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    
    return false;
}

function gameLoop(currentTime) {
    if (!gameRunning) return;

    gameAnimationFrame = requestAnimationFrame(gameLoop);

    // 计算距离上一帧的时间
    const timeSinceLastRender = currentTime - lastRenderTime;

    // 如果距离上一帧的时间小于帧间隔，则跳过这一帧
    if (timeSinceLastRender < FRAME_INTERVAL) return;

    // 更新上一帧的时间
    lastRenderTime = currentTime;

    // 更新游戏状态
    moveSnake();
    drawGame();
}

function startGame() {
    if (gameRunning) return;
    
    // 重置游戏状态
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreText.textContent = score;
    generateFood();
    
    gameRunning = true;
    startBtn.disabled = true;
    
    // 使用requestAnimationFrame启动游戏循环
    lastRenderTime = 0;
    gameAnimationFrame = requestAnimationFrame(gameLoop);
}

function endGame() {
    // 取消动画帧
    cancelAnimationFrame(gameAnimationFrame);
    gameRunning = false;
    const head = snake[0];
    let message = '';
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        message = '撞墙了！';
    } else {
        message = '撞到自己了！';
    }
    
    alert(`游戏结束！${message}\n最终得分：${score}`);
    startBtn.disabled = false;
}

startBtn.addEventListener('click', startGame);
