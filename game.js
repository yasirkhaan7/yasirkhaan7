const score = document.querySelector('.score');
const highScore = document.querySelector('.highScore');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const pauseBtn = document.getElementById('pauseBtn');
const musicBtn = document.getElementById('musicBtn');

let player = { speed: 5, score: 0, isPaused: false, musicOn: true };
let gameMusic = new Audio('background-music.mp3');

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

startScreen.addEventListener('click', start);
pauseBtn.addEventListener('click', togglePause);
musicBtn.addEventListener('click', toggleMusic);

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach(function (item) {
        if (item.y >= 700) {
            item.y -= 750;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function (item) {
        if (isCollide(car, item)) {
            endGame();
        }
        if (item.y >= 700) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + 'px';
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function playGame() {
    if (!player.isPaused) {
        let car = document.querySelector('.car');
        let road = gameArea.getBoundingClientRect();

        if (player.start) {
            moveLines();
            moveEnemy(car);

            if (keys.ArrowUp && player.y > road.top + 70) {
                player.y -= player.speed;
            }
            if (keys.ArrowDown && player.y < road.bottom - 70) {
                player.y += player.speed;
            }
            if (keys.ArrowLeft && player.x > 0) {
                player.x -= player.speed;
            }
            if (keys.ArrowRight && player.x < road.width - 50) {
                player.x += player.speed;
            }

            car.style.top = player.y + 'px';
            car.style.left = player.x + 'px';

            window.requestAnimationFrame(playGame);

            player.score++;
            score.innerText = 'Score: ' + player.score;
        }
    }
}

function start() {
    startScreen.classList.add('hide');
    gameArea.innerHTML = '';
    player.start = true;
    player.score = 0;
    player.isPaused = false;
    window.requestAnimationFrame(playGame);

    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'lines');
        roadLine.y = x * 150;
        roadLine.style.top = roadLine.y + 'px';
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemy');
        enemyCar.y = ((x + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + 'px';
        enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
        gameArea.appendChild(enemyCar);
    }

    if (player.musicOn) {
        gameMusic.loop = true;
        gameMusic.play();
    }
}

function endGame() {
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = 'Game Over <br> Your final score is ' + player.score + '<br> Click here to restart the game.';
    gameMusic.pause();
}

function togglePause() {
    player.isPaused = !player.isPaused;
    if (!player.isPaused) {
        window.requestAnimationFrame(playGame);
    }
}

function toggleMusic() {
    player.musicOn = !player.musicOn;
    if (player.musicOn) {
        gameMusic.play();
    } else {
        gameMusic.pause();
    }
}
