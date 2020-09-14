// TODO: Don't draw food under the snake
// TODO: Add start buttons

let width,
  height,
  tileSize,
  canvas,
  cts,
  food,
  snake,
  fps,
  interval,
  score = 0,
  isPaused = false;

const snakeColor = "#21bf73";
const foodColor = "#fd5e53";
const stroke = "#272121";

// Food Initialization
class Food {
  constructor(pos, color) {
    this.x = pos.x;
    this.y = pos.y;
    this.color = color;
  }

  // Drawing the food on the canvas
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, tileSize, tileSize);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }
}

// Snake Initilization
class Snake {
  constructor(pos, color) {
    this.x = pos.x;
    this.y = pos.y;
    this.color = color;
    this.velX = 1;
    this.velY = 0;
    this.tail = [
      { x: pos.x - tileSize, y: pos.y },
      { x: pos.x - tileSize * 2, y: pos.y },
    ];
  }

  // Draw snake on the canvas
  draw() {
    // Draw the head of the snake
    ctx.beginPath();
    ctx.rect(this.x, this.y, tileSize, tileSize);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    // Draw the body of the snake
    for (let i = 0; i < this.tail.length; i++) {
      ctx.beginPath();
      ctx.rect(this.tail[i].x, this.tail[i].y, tileSize, tileSize);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();
    }
  }

  // Move the snake
  move() {
    // Move the tail
    for (let i = this.tail.length - 1; i > 0; i--) {
      this.tail[i] = this.tail[i - 1];
    }

    if (this.tail.length != 0) {
      this.tail[0] = { x: this.x, y: this.y };
    }

    this.x += this.velX * tileSize;
    this.y += this.velY * tileSize;
  }

  // Change direction
  dir(dirX, dirY) {
    this.velX = dirX;
    this.velY = dirY;
  }

  // Eat the food
  eat() {
    if (
      Math.abs(this.x - food.x) < tileSize &&
      Math.abs(this.y - food.y) < tileSize
    ) {
      this.tail.push({});
      return true;
    }

    return false;
  }

  // Snake is dead
  die() {
    for (let i = 0; i < this.tail.length; i++) {
      if (
        Math.abs(this.x - this.tail[i].x) < tileSize &&
        Math.abs(this.y - this.tail[i].y) < tileSize
      ) {
        return true;
      }
    }
    return false;
  }

  // If the snake outside of canvas border
  border() {
    if (
      (this.x + tileSize > width && this.velX != -1) ||
      (this.x < 0 && this.velX != 1)
    ) {
      this.x = width - this.x;
    } else if (
      (this.y + tileSize > height && this.velY != -1) ||
      (this.velY != 1 && this.y < 0)
    ) {
      this.y = height - this.y;
    }
  }
}

function spawnLocation() {
  const rows = width / tileSize;
  const cols = height / tileSize;

  const xPos = Math.floor(Math.random() * rows) * tileSize;
  const yPos = Math.floor(Math.random() * cols) * tileSize;

  return {
    x: xPos,
    y: yPos,
  };
}

// Show score on canvas
function showScore() {
  ctx.textAlign = "center";
  ctx.font = "25px sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText("SCORE: " + score, width - 120, 30);
}

// Show text if game paused
function showPaused() {
  ctx.textAlign = "center";
  ctx.font = "35px sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText("PAUSED", width / 2, height / 2);
}

// Initialization of the game
function init() {
  tileSize = 20;
  width = tileSize * Math.floor(window.innerWidth / tileSize);
  height = tileSize * Math.floor(window.innerHeight / tileSize);
  canvas = document.querySelector("#game-wrap");
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");
  fps = 10;
  food = new Food(spawnLocation(), foodColor);
  snake = new Snake(
    {
      x: tileSize * Math.floor(width / (2 * tileSize)),
      y: tileSize * Math.floor(height / (2 * tileSize)),
    },
    snakeColor
  );
}

// Game
function game() {
  init();

  interval = setInterval(update, 1000 / fps);
}

// Updating game
function update() {
  if (isPaused) {
    return;
  }
  if (snake.die()) {
    alert("GAME OVER!");
    clearInterval(interval);
    window.location.reload();
  }

  snake.border();

  if (snake.eat()) {
    food = new Food(spawnLocation(), foodColor);
    score += 10;
  }

  ctx.clearRect(0, 0, width, height);
  food.draw();
  snake.draw();
  snake.move();
  showScore();
}

window.addEventListener("keydown", function (event) {
  // Handle press down on space bar
  if (event.key === " ") {
    event.preventDefault();
    isPaused = !isPaused;
    showPaused();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (
      snake.velY != 1 &&
      snake.x >= 0 &&
      snake.x <= width &&
      snake.y >= 0 &&
      snake.y <= height
    ) {
      snake.dir(0, -1);
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (
      snake.velY != -1 &&
      snake.x >= 0 &&
      snake.x <= width &&
      snake.y >= 0 &&
      snake.y <= height
    ) {
      snake.dir(0, 1);
    }
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (
      snake.velX != 1 &&
      snake.x >= 0 &&
      snake.x <= width &&
      snake.y >= 0 &&
      snake.y <= height
    ) {
      snake.dir(-1, 0);
    }
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    if (
      snake.velX != -1 &&
      snake.x >= 0 &&
      snake.x <= width &&
      snake.y >= 0 &&
      snake.y <= height
    ) {
      snake.dir(1, 0);
    }
  }
});

window.addEventListener("load", game);
