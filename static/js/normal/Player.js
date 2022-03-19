//=====================================================================================================
function Player() {
    this.w = 50;
    this.h = this.w / 2;
    this.bullets = [];
    this.bulletSpeed = 10;
    this.lastShoot = millis();
    this.xspeed = 10;
    this.c = color(0, 200, 0);
    this.alive = true;
    this.leftKey = [];
    this.rightKey = [];
    this.shootKey = [];
    this.number;
    this.x = random(this.w, windowWidth - this.w);
    /*this.calcX = function() {
        if (this.number == 1) {
            return 
        } else if (this.number == 2) {
            if (mouseX < windowWidth && mouseX > 0) {
                return mouseX;
            } else {
                return random(this.w, windowWidth - this.w);
            }
        }
    }
    this.x = this.calcX();*/
    this.y = windowHeight - this.w - this.w / 6;
    this.showHelp;
    this.kills = 0;
    this.keys = {
        left: 37,
        right: 39,
        shoot: 38
    }
    this.keySymbols = {
        left: '<',
        right: '>',
        shoot: '^'
    }
    //
    this.show = function() {
        // beginShape();
        // vertex(this.x, /*              */ this.y - this.w / 2);
        // vertex(this.x + (this.w / 3) / 2, this.y - this.w / 2);
        // vertex(this.x + (this.w / 3) / 2, this.y - this.w / 2 + this.w / 3);
        // vertex(this.x + this.w / 2, /* */ this.y - this.w / 2 + this.w / 3);
        // vertex(this.x + this.w / 2, /* */ this.y + this.w / 3);
        // vertex(this.x - this.w / 2, /* */ this.y + this.w / 3);
        // vertex(this.x - this.w / 2, /* */ this.y - this.w / 2 + this.w / 3);
        // vertex(this.x - (this.w / 3) / 2, this.y - this.w / 2 + this.w / 3);
        // vertex(this.x - (this.w / 3) / 2, this.y - this.w / 2);
        // vertex(this.x, /*              */ this.y - this.w / 2);
        // endShape(CLOSE);
        fill(this.c);
        beginShape();
        vertex(this.x, this.y - this.h / 3);
        vertex(this.x + ((this.w / 3) / 2), this.y);
        vertex(this.x + ((this.w / 3) * 2), this.y);
        vertex(this.x + ((this.w / 3) * 2), this.y + this.h / 1.5);
        vertex(this.x - ((this.w / 3) * 2), this.y + this.h / 1.5);
        vertex(this.x - ((this.w / 3) * 2), this.y);
        vertex(this.x - ((this.w / 3) / 2), this.y);
        vertex(this.x, this.y - this.h / 3);
        endShape(CLOSE);
        textSize(this.h + 10);
        text(this.number, this.x, this.y + this.h * 2);
        if (this.showHelp == true) {
            textSize(20);
            if (this.number == 1) {
                text(this.keySymbols.left, this.x - this.w, this.y);
                text(this.keySymbols.shoot, this.x, this.y - this.h / 2);
                text(this.keySymbols.right, this.x + this.w, this.y);
            } else if (this.number == 2) {
                text("use mouse", this.x, this.y - this.h / 2);
            }
        } else if (this.kills > 0) {
            textSize(20);
            text(this.kills, this.x, this.y - this.h);
        }
        //clog(this.x);
    }
    //
    this.move = function() {
        var prssdKeys = getPressedKeys();
        if (this.number == 1) {
            if (prssdKeys.includes(this.keys.left)) {
                this.moveLeft();
            }
            if (prssdKeys.includes(this.keys.right)) {
                this.moveRight();
            }
            if (prssdKeys.includes(this.keys.shoot)) {
                this.moveShoot();
            }
        } else if (this.number == 2) {
            if (mouseX < this.x) {
                this.moveLeft();
            }
            if (mouseX > this.x) {
                this.moveRight();
            }
            if (mouseIsPressed) {
                this.moveShoot();
            }
        }
    }
    this.moveLeft = function() {
        if (this.x >= 0 + this.w) {
            this.x += -this.xspeed;
        }
    }
    this.moveRight = function() {
        if (this.x <= windowWidth - this.w) {
            this.x += this.xspeed;
        }
    }
    this.moveShoot = function() {
        if (millis() - this.lastShoot > playerShootSpeed) {
            this.newBullet();
            this.lastShoot = millis();
        }
    }
    this.newBullet = function() {
        var bullet = createVector(this.x, this.y + this.h / 2);
        bullet.active = true;
        bullet.spawn_y = this.y + this.h / 2 //For animating the trail of the bullet
        this.bullets.push(bullet);
        animate.playerShooted(this.x, this.y - this.h / 3, this.c);
    }
    this.showBullets = function() {
        fill(this.c);
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].active == true) {
                this.bullets[i].y -= this.bulletSpeed;
                ellipse(this.bullets[i].x, this.bullets[i].y, bulletSize);

                //Show trail:
                animate.playerBulletTrail(this.bullets[i], bulletSize, this.c)
                
            }
        }
    }
    this.updateBullets = function() {
        var killed = [];
        for (var j = this.bullets.length - 1; j >= 0; j--) {
            if (this.bullets[j].y < 0) {
                this.bullets.splice(j, 1);
            } else if (this.bullets[j].active == true) {
                for (var i = enemyRows.length - 1; i >= 0; i--) {
                    if (enemyRows[i].isABoss == true) {
                        if (enemyRows[i].dead == false) {
                            if (dist(this.bullets[j].x, this.bullets[j].y, enemyRows[i].pos.x, enemyRows[i].pos.y) < enemyRows[i].w) {
                                var currBoss = enemyRows[i];
                                currBoss.die(this.c);
                                scoreCounter.pointsBossKill();
                                this.bullets[j].active = false;
                                this.kills++;
                            }
                        }
                    } else {
                        for (var e = enemyRows[i].length - 1; e >= 0; e--) {
                            if (enemyRows[i][e].dead == false) {
                                if (dist(this.bullets[j].x, this.bullets[j].y, enemyRows[i][e].pos.x, enemyRows[i][e].pos.y) < enemyRows[i][e].w) {
                                    var currEnemy = enemyRows[i][e];
                                    currEnemy.die(this.c);
                                    scoreCounter.pointsEnemyKill();
                                    this.bullets[j].active = false;
                                    this.kills++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    this.die = function(c) {
        if (undeadPlayers == false) {
            this.alive = false;
            animate.playerDeath(this.x, this.y, this.c, c);
        }
    }
}

function getKeysForPlayer(number) {
    switch (number) {
        case 1:
            assignKeys(number - 1, 37, '<', 39, '>', 38, '^');
            break;
        case 2:
            assignKeys(number - 1, 65, 'A', 68, 'D', 87, 'W');
            break;
    }
}

function assignKeys(number, left1, left2, right1, right2, shoot1, shoot2) {
    players[number].leftKey[0] = left1;
    players[number].leftKey[1] = left2;
    players[number].rightKey[0] = right1;
    players[number].rightKey[1] = right2;
    players[number].shootKey[0] = shoot1;
    players[number].shootKey[1] = shoot2;
}