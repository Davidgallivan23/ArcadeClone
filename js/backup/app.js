/*----------------------------------------------------------------------------*/
/*-----------------------------Enemy------------------------------------------*/

/*
* This is the bad guy our player must avoid
*/
let Enemy = function(x,y,speed) {
    "use strict";
    this.x = x;
    this.y = y;
    this.speed = speed;
    //sprite is the image of the enemy
    this.sprite = 'images/enemy-bug.png';
};

/* 
* Updates where the enemy is
* Parameter: time difference between ticks
*/
Enemy.prototype.update = function(dt) {
    "use strict";
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    // Reset the enemy with a new speed after it goes off screen
    this.offScreenX = 505;
    this.startingX = -100;
    if (this.x >= this.offScreenX) {
        this.x = this.startingX;
        this.randomSpeed();
    }
    this.checkCollision();
};

//controls the difficulty of the game
let speedMultiplier = 40;

// Random speed generator
Enemy.prototype.randomSpeed = function (){
    "use strict";
    //make the speed random
    this.speed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
};

/*
* Draw the bad guy
*/
Enemy.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillStyle = "white";
    ctx.font = "16px Comic Sans MS";
    ctx.fillText("Score: " + player.playerScore, 40, 70);
    ctx.fillText("Lives: " + player.playerLives, 141, 70);
    ctx.fillText("Difficulty: " + speedMultiplier, 260, 70);
};

/*
* Check to see if we got ran over
*/
Enemy.prototype.checkCollision = function() {
    "use strict";
    var playerBox = {x: player.x, y: player.y, width: 50, height: 40};
    var enemyBox = {x: this.x, y: this.y, width: 60, height: 70};

    if (playerBox.x < enemyBox.x + enemyBox.width &&
        playerBox.x + playerBox.width > enemyBox.x &&
        playerBox.y < enemyBox.y + enemyBox.height &&
        playerBox.height + playerBox.y > enemyBox.y) {
        // Collision detected, call collisionDetected function
        this.collisionDetected();
    }
};

/*
* We got ran over, take a life and reset
*/
Enemy.prototype.collisionDetected = function() {
    "use strict";
    player.playerLives -= 1;
    player.characterReset();
};

/*----------------------------------------------------------------------------*/
/*--------------------------------Gem-----------------------------------------*/

/*
* Prizes we try to pick up
*/
let Gem = function(x,y) {
    "use strict";
    this.x = x;
    this.y = y;
    this.sprite = 'images/Gem-Blue.png';
    this.gemWaitTime = undefined;
};

// did we get hit
Gem.prototype.update = function() {
    "use strict";
    this.checkCollision();
};

// Draw the gem to the screen
Gem.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Check for collision
Gem.prototype.checkCollision = function() {
    "use strict";

    let playerBox = {x: player.x, y: player.y, width: 50, height: 40};
    let gemBox = {x: this.x, y: this.y, width: 60, height: 70};
    // Check for collisions, if playerBox intersects gemBox, we have one
    if (playerBox.x < gemBox.x + gemBox.width &&
        playerBox.x + playerBox.width > gemBox.x &&
        playerBox.y < gemBox.y + gemBox.height &&
        playerBox.height + playerBox.y > gemBox.y) {
        // Collision detected, call collisionDetected function
        this.collisionDetected();
    }
};

//We picked up the prize, inc our score
Gem.prototype.collisionDetected = function() {
    "use strict";
    this.x = 900;
    this.y = 900;
    player.playerScore += 50;
    this.wait();
};

//used to reset
Gem.prototype.wait = function() {
    this.gemWaitTime = setTimeout( function() {
        gem.gemReset(); 
    }, 5000);
};

// move the prize
Gem.prototype.gemReset = function() {
    "use strict";
    this.x = (101 * Math.floor(Math.random() * 4) + 0);
    this.y = (60 + (85 * Math.floor(Math.random() * 3) + 0));
};
/*----------------------------------------------------------------------------*/
/*--------------------------------Heart---------------------------------------*/

// Hearts the player should try to pick up
let Heart = function(x,y) {
    "use strict";
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart.png';
    this.heartWaitTime = undefined;
};

// did we get hit
Heart.prototype.update = function() {
    "use strict";
    this.checkCollision();
};

// draw the heart
Heart.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check to see if we got ran over
Heart.prototype.checkCollision = function() {
    "use strict";
    
    var playerBox = {x: player.x, y: player.y, width: 50, height: 40};
    var heartBox = {x: this.x, y: this.y, width: 60, height: 70};
    if (playerBox.x < heartBox.x + heartBox.width &&
        playerBox.x + playerBox.width > heartBox.x &&
        playerBox.y < heartBox.y + heartBox.height &&
        playerBox.height + playerBox.y > heartBox.y) {
        // Collision detected, call collisionDetected function
        this.collisionDetected();
    }
};

//we grabbed the heart, up our lives
Heart.prototype.collisionDetected = function() {
    "use strict";
    this.x = 900;
    this.y = 900;
    player.playerLives += 1;
    this.wait();
};

//used to reset timeout
Heart.prototype.wait = function() {
    this.heartWaitTime = setTimeout( function() {
        heart.heartReset(); // this.heartReset() doesn't work
    }, 30000);
};

// move the heart
Heart.prototype.heartReset = function() {
    "use strict";
    this.x = (101 * Math.floor(Math.random() * 4) + 0);
    this.y = (70 + (85 * Math.floor(Math.random() * 3) + 0));
};

/*----------------------------------------------------------------------------*/
/*------------------------------Player----------------------------------------*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/*
* This is us, set the starting position and the number of lives
*/
let Player = function() {
    "use strict";
    this.startingX = 200;
    this.startingY = 400;
    this.x = this.startingX;
    this.y = this.startingY;
    this.sprite = 'images/char-boy.png';
    this.playerScore = 0;
    this.playerLives = 3;
};

// check to see if we are dead
Player.prototype.update = function() {
    "use strict";
    if (this.playerLives === 0) {
    reset();
    }
};

// Resets us back to the start position
Player.prototype.characterReset = function() {
    "use strict";
    this.startingX = 200;
    this.startingY = 400;
    this.x = this.startingX;
    this.y = this.startingY;
};

// Keep making it harder for the player when they reach the water
Player.prototype.success = function() {
    "use strict";
    this.playerScore += 20;
    speedMultiplier += 5;
    this.characterReset();
};

// draw us
Player.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// mover us with the keys
Player.prototype.handleInput = function(allowedKeys) {
    "use strict";
    switch (allowedKeys) {
        case "left":
            //check for wall, otherwise move left
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case "right":
            //check for wall, otherwise move right
            if (this.x < 402) {
                this.x += 101;
            }
            break;
        case "up":
            //check if player reached top of water, if so call success function,
            // otherwise move up
            if (this.y < 0) {
                this.success();
            } else {
                this.y -= 83;
            }
            break;
        case "down":
            //check for bottom, otherwise move down
            if (this.y < 400) {
                this.y += 83;
            }
            break;
    }
};

/*----------------------------------------------------------------------------*/
/*-------------------------Instantiate Objects--------------------------------*/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// us
var player = new Player();

// Empty bad guy
var allEnemies = [];

// give us 3 bad guys
for (var i = 0; i < 3; i++) {
    var startSpeed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
    allEnemies.push(new Enemy(-100, 60 + (85 * i), startSpeed));
}

//make a gem
var gem = new Gem (101 * Math.floor(Math.random() * 4) + 0, 60 +
    (85 * Math.floor(Math.random() * 3) + 0));

//make a heart
var heart = new Heart (101 * Math.floor(Math.random() * 4) + 0, 70 +
    (85 * Math.floor(Math.random() * 3) + 0));

/*----------------------------------------------------------------------------*/
/*---------------------------Event Listener-----------------------------------*/

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

/* 
 * Set the key allowed to move
 */
var input = function(e) {
    "use strict";
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};
document.addEventListener('keyup', input);

