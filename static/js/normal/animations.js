function Animate() {
    this.trailLength = 15 //copies of the bullet with lower gamma
    this.enemyDeath = function(x, y, enemyC, bulletC) {
        enemyKill.play();
        if (enemyCounter > 1) {
            var antiLifetime = 5;
            var range = 10;
            var size = 30;
            var count = 15;
            var c = [bulletC, enemyC];
            enemyAnimations.push(new Explosion(x, y, c, antiLifetime, range, size, count));
            enemyAnimations[enemyAnimations.length - 1].explode();
        }
    }
    this.enemyShooted = function(x, y, c) {
        enemyShoot.play();
        var antiLifetime = 10;
        var range = 3;
        var size = 5;
        var count = 10;
        enemyAnimations.push(new Explosion(x, y, c, antiLifetime, range, size, count));
        enemyAnimations[enemyAnimations.length - 1].explode();
    }
    this.playerDeath = function(x, y, playerC, bulletC) {
        playerKill.play();
        var antiLifetime = 5;
        var range = 18;
        var size = 40;
        var count = 20;
        var c = [bulletC, playerC];
        playerAnimations.push(new Explosion(x, y, c, antiLifetime, range, size, count));
        playerAnimations[playerAnimations.length - 1].explode();
    }
    this.playerShooted = function(x, y, c) {
        playerShoot.play()
        var antiLifetime = 10;
        var range = 3;
        var size = 5;
        var count = 10;
        playerAnimations.push(new Explosion(x, y, c, antiLifetime, range, size, count));
        playerAnimations[playerAnimations.length - 1].explode();
    }

    this.playerBulletTrail = function(bullet, bulletSize) {
        bulletsToDraw = int((bullet.spawn_y - bullet.y) / bulletSize + 1)
        if (bulletsToDraw > this.trailLength) {
            bulletsToDraw = this.trailLength
        }

        for (var i = 0; i < bulletsToDraw; i++) {
            curr_y = bullet.y + 10 * i
            green_col = ((i-15)*0.9)**(2) + 10 //something arbitrary
            curr_color = color(0, green_col, 0)

            fill(curr_color)
            ellipse(bullet.x, curr_y, bulletSize)
        }
    }

    this.enemyBulletTrail = function(bullet, bulletSize, c, corners) {
        bulletsToDraw = int((bullet.y - bullet.spawn_y) / bulletSize + 1)
        if (bulletsToDraw > this.trailLength) {
            bulletsToDraw = this.trailLength
        }

        for (var i = 0; i < bulletsToDraw; i++) {
            curr_y = bullet.y - 10 * i
            col_mod = ((i-15)*0.065)**(2) + 0.05 //something arbitrary
            curr_color = color(c.levels[0] * col_mod, c.levels[1] * col_mod, c.levels[2] * col_mod)

            fill(curr_color)
            polygon(bullet.x, curr_y, bulletSize, corners)      
        }
    }

    this.bossEnemyBulletTrail = function(bullet, bulletSize, c) {
        bulletsToDraw = int((bullet.y - bullet.spawn_y) / bulletSize + 1)
        if (bulletsToDraw > this.trailLength) {
            bulletsToDraw = this.trailLength
        }

        for (var i = 0; i < bulletsToDraw; i++) {
            curr_y = bullet.y - 10 * i
            col_mod = ((i-15)*0.065)**(2) + 0.05 //something arbitrary
            curr_color = color(c.levels[0] * col_mod, c.levels[1] * col_mod, c.levels[2] * col_mod)

            fill(curr_color)
            clog(curr_color)
            makeTriangle(bullet.x, curr_y, bulletSize)      
        }
    }
}
//========================================================================
function Explosion(x, y, c, antiLifetime, range, size, count) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.particles = [];
    this.done = function() {
        if (this.particles.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    this.update = function() {
        for (var i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].done()) {
                this.particles.splice(i, 1);
            }
        }
    }
    this.explode = function() {
        for (var i = 0; i < count; i++) {
            if (!this.c[0]) {
                var p = new Particle(this.x, this.y, this.c, antiLifetime, range, size);
                this.particles.push(p);
            } else {
                var index = floor(random(0, 4));
                if (index == 2 || index == 3) index = 1;
                var rndmC = this.c[index];
                var p = new Particle(this.x, this.y, rndmC, antiLifetime, range, size);
                this.particles.push(p);
            }
        }
    }
    this.show = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].show();
        }
    }

    function Particle(x, y, c, antiLifetime, range, size) {
        this.pos = createVector(x, y);
        this.antiLifetime = 255;
        this.c = c;
        this.acc = createVector(0, 0);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2, range));
        this.range = range;
        this.update = function() {
            this.vel.mult(0.9);
            this.antiLifetime -= antiLifetime;
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
        this.done = function() {
            if (this.antiLifetime < 0) {
                return true;
            } else {
                return false;
            }
        }
        this.show = function() {
            fill(red(this.c), green(this.c), blue(this.c), this.antiLifetime);
            rect(this.pos.x, this.pos.y, size, size);
        }
    }
}