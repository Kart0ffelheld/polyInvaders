var enemiesPerRow = 5,
    startEnemyRows = 2,
    enemyWait = 10000, //Interval of new rows spawning
    enemyFirstWait = 5000, // 10 seconds
    enemyBeginWait = 1000,
    enemyBulletSpeed = 8; //   
var playerShootSpeed = 500;
var blockerCounter = 3,
    blockerSize = 160,
    blockerHitpoints = 5;
var bulletSize = 15; // Size of all bullets
var undeadPlayers = false; //You cant die
var numberOfPlayers = 2;
//
//
var canvasWidth = 600, 
    canvasHeight = 600
//
var keys;
var start = false;
var lost = false;
var textColor;
var players = [];
var timeouted = false;
var enemyMovingDir = 1;
var enemyCounter;
var enemyRows = [];
var blockers = [];
var enemyAnimations = [];
var playerAnimations = [];
var scoreCounter;
var alreadyOver = false;
var deviceIsOkay = false;
var lastEnemy;
var firstEnemy;
var animate;
var paused = false;
var playersAlive = 1;
//
function clog(msg) {
    console.log(msg);
}

function preload() {
    win = loadSound('static/sounds/win.mp4');
    enemyKill = loadSound('static/sounds/enemyKilled.mp4');
    enemyShoot = loadSound('static/sounds/enemyShoot.mp4');
    playerKill = loadSound('static/sounds/playerKilled.mp4');
    playerShoot = loadSound('static/sounds/playerShoot.mp4');
    win.setVolume(0.15);
    enemyKill.setVolume(0.5);
    playerKill.setVolume(0.3);
    enemyShoot.setVolume(0.15);
    playerShoot.setVolume(0.35);

    //Parse player number from URL
    queryString = window.location.search;
    searchParams = new URLSearchParams(queryString)
    playerNumberParam = searchParams.get("p")

    if (playerNumberParam == 1 || playerNumberParam == 2) {
        numberOfPlayers = playerNumberParam
    }
}

function setup() {
    if (windowWidth >= canvasWidth && windowHeight >= canvasHeight) {
        deviceIsOkay = true;
    }
    //createCanvas(windowWidth, windowHeight);
    createCanvas(canvasWidth, canvasHeight);
    if (enemiesPerRow < 1) enemiesPerRow = 1;
    if (startEnemyRows < 1) startEnemyRows = 1;
    for (var i = 0; i < numberOfPlayers; i++) { //Add two Players
        players[i] = new Player();
        players[i].number = i + 1;
        players[i].showHelp = true;
    }
    for (var i = 0; i < startEnemyRows; i++) {
        enemyRows[i] = newRow(enemiesPerRow);
        //
        for (var e = enemyRows.length - 1; e >= 0; e--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                if (e != 0) { //Dont come closer if its the last row
                    enemyRows[e][j].moveCloser();
                }
            }
        }
    }
    for (var i = 0; i < blockerCounter; i++) {
        blockers[i] = new Blocker();
        blockers[i].setup(i, blockerCounter - 1);
    }
    noStroke();
    textAlign(CENTER);
    rectMode(CENTER);
    ellipseMode(CENTER);
    setTimeout(function() { //First timeout is different from the normal one
        timeouted = true;
        setInterval(function() {
            timeouted = true;
        }, enemyWait);
    }, enemyFirstWait)
    setTimeout(function() {
        start = true;
    }, enemyBeginWait);
    textColor = color(200);
    scoreCounter = new ScoreCounter();
    setInterval(function() {
        scoreCounter.everyMinute();
    }, 1000 * 60);
    setInterval(function() {
        scoreCounter.everyTenSeconds();
    }, 1000 * 10);
    animate = new Animate();

}

function draw() {
    if (deviceIsOkay == false) {
        gameIsOver('too small');
    } else {
        if (enemyCounter == 0 && alreadyOver == false) {
            alreadyOver = true;
            gameIsOver('won');
        } else if ((playersAlive == 0 || lost == true) && alreadyOver == false && undeadPlayers == false) {
            alreadyOver = true;
            gameIsOver('lost');
        } else {
            //Always animate: because of endOfGame animation
            for (var i = playerAnimations.length - 1; i >= 0; i--) {
                if (playerAnimations[i].done() == true) {
                    playerAnimations.splice(i, 1);
                } else {
                    playerAnimations[i].update();
                    playerAnimations[i].show();
                }
            }

            if (alreadyOver == false) { 
                background(color(0, 0, 0));
                if (!keyIsPressed) {
                    keys = [];
                }
                enemyCounter = 0;
                playersAlive = 0; //reset the counter
                for (var i = enemyRows.length - 1; i >= 0; i--) {
                    if (enemyRows[i].isABoss && !enemyRows[i].dead) {
                        enemyCounter++;
                    } else {
                        for (var j = enemyRows[i].length - 1; j >= 0; j--) { //Count the enemies
                            if (!enemyRows[i][j].dead) {
                                enemyCounter++;
                            }
                        }
                    }
                }
                for (var i = blockers.length - 1; i >= 0; i--) {
                    if (blockers[i].active == true) {
                        blockers[i].update();
                        blockers[i].show();
                    }
                }
                for (var i = players.length - 1; i >= 0; i--) {
                    if (players[i].alive == true) {
                        playersAlive++;
                        fill(0, 200, 0);
                        players[i].updateBullets();
                        players[i].showBullets();
                        players[i].show();
                        players[i].move();
                        if (start == true) {
                            players[i].showHelp = false;
                        }
                    }
                }
                for (var i = enemyRows.length - 1; i >= 0; i--) {
                    if (enemyRows[i].isABoss == true) {
                        if (enemyRows[i].dead == true) {
                            enemyRows[i].move();
                            enemyRows[i].update();
                        } else {
                            if (start == true) {
                                enemyRows[i].updateBullets(); //firstly draw bullets so they are below the bodies
                                enemyRows[i].showBullets();
                            }
                            enemyRows[i].move();
                            enemyRows[i].update();
                            enemyRows[i].show(i);
                        }
                    } else {
                        for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                            if (enemyRows[i].length == 0) {
                                enemyRows.splice(i, 1);
                            } else {
                                if (enemyRows[i][j].dead == true) {
                                    enemyRows[i][j].move(enemyMovingDir);
                                    enemyRows[i][j].update();
                                } else {
                                    if (start == true) {
                                        enemyRows[i][j].updateBullets();
                                        enemyRows[i][j].showBullets();
                                    }
                                    enemyRows[i][j].move(enemyMovingDir);
                                    enemyRows[i][j].update();
                                    enemyRows[i][j].show(i);
                                }
                            }
                        }
                    }
                }
                var frontArr = enemyRows[0];
                lastEnemy = frontArr[frontArr.length - 1];
                firstEnemy = frontArr[0];
                if (lastEnemy.pos.x >= canvasWidth - firstEnemy.w) {
                    enemyMovingDir = -1;
                } else if (firstEnemy.pos.x <= 0 + firstEnemy.w) {
                    enemyMovingDir = 1;
                }
                for (var i = enemyAnimations.length - 1; i >= 0; i--) {
                    if (enemyAnimations[i].done() == true) {
                        enemyAnimations.splice(i, 1);
                    } else {
                        enemyAnimations[i].update();
                        enemyAnimations[i].show();
                    }
                }
                if (timeouted) {
                    timeouted = false;
                    for (var i = enemyRows.length - 1; i >= 0; i--) {
                        if (enemyRows[i].isABoss == true) {
                            enemyRows[i].moveCloser();
                        } else {
                            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                                enemyRows[i][j].moveCloser();
                            }
                        }
                    }
                    var divBy__ = (enemyRows.length + 1) / 3;
                    clog(divBy__)
                    if (floor(divBy__) == divBy__) { // Nur wenn es teilbar durch ___ ist
                        enemyRows[enemyRows.length] = new BossEnemy();
                    } else {
                        enemyRows[enemyRows.length] = newRow(enemiesPerRow, enemyRows[0][0].pos.x);
                    }
                }
            }
        }
        // Draw overlays afterwards
        if (paused) {
            pauseGame()
        }
        scoreCounter.show();
    }
}
//=====================================================================================================
function gameIsOver(why) {
    clearInterval();
    clearTimeout();
    window.addEventListener("keydown", function(event) {
        if (event.keyCode == 32) {
            window.location.reload();
        }
    }, false);
    if (why == 'too small') {
        noLoop();
        background(0);
        fill(255);
        textSize(canvasWidth / 20);
        text("Your device is too small!", canvasWidth / 2, canvasHeight / 2);
        textSize(canvasWidth / 50);
        text("Press the spacebar after you have resized it.", canvasWidth / 2, canvasHeight / 2 + 30)
    } else {
        setTimeout(function() { 
            //First stop the game and then write on top of it
            noLoop();
            //setTimeout(function() {
            //background(0);
            fill(0)
            textSize(70);
            if (why == 'won') {
                animate.endOfGame()
                win.play();
                rect(canvasWidth / 2, canvasHeight - 110, 300, 100);
                fill(textColor);
                text("You won!", canvasWidth / 2, canvasHeight - 100);
                scoreCounter.show();
                textSize(15);
                text("Press the spacebar to play again.", canvasWidth / 2, canvasHeight - 70);
            }
            if (why == 'lost') {
                rect(canvasWidth / 2, canvasHeight - 110, 500, 100);
                fill(textColor);
                text("You have lost!", canvasWidth / 2, canvasHeight - 100);
                scoreCounter.show();
                textSize(15);
                text("Press the spacebar to retry.", canvasWidth / 2, canvasHeight - 70);
            }
            //}, 200);
        }, 1000);
    }
}

function newRow(number, firstPos) {
    var row = [];
    for (var i = number; i > 0; i--) {
        row.push(new Enemy());
    }
    for (var i = 0; i <= row.length - 1; i++) {
        row[i].setup(i, number, firstPos);
    }
    return row;
}

function keyPressed() {
    if (key == ' ' && !alreadyOver) {
        if (!paused) {
            paused = true;
        } else {
            paused = false;
            resumeGame();
        }
    }
}

function resumeGame() {
    loop();
}

function pauseGame() {
    noLoop();
    fill(255);
    var size = 40;
    rect(size, size * 2, size, size * 2);
    rect(size * 3 - (size / 2), size * 2, size, size * 2);
}
//KEY CONTROLLER =================================================================================================
keys = [];
window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = e.keyCode;
}, false);
window.addEventListener('keyup', function(e) {
    keys.splice(e.keyCode, 1);
}, false);

function getPressedKeys() {
    var res = [];
    for (var i = 0; i < keys.length; i++) {
        if (keys[i]) {
            res[res.length] = keys[i];
        }
    }
    return res;
}