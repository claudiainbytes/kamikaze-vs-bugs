// timeGameReset determine time in ms to reset the game and entities
var timeGameReset = 500;

//  gemsTypes, array object that contains specifications of each gem
var gemsTypes = [ { "color": "orange", "value": 1000 }, { "color": "green", "value": 2000 }, { "color": "blue", "value": 5000 } ];

// setRandom, Set the speed of the Enemy randomly
var setRandom = function( min, max ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// shuffle, randomize an array
var shuffle = function(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

/** Obstacle **/

// Obstacles avoid to move in a specific direction
var Obstacle = function( posX, posY ) {
    this.sprite = "images/rock.png";
    this.x = posX;
    this.y = posY;
};

/** Gem **/

// Gems are picked to get more score
var Gem = function( posX, posY, color, value ) {
    this.sprite = "images/gem-" + color + ".png";
    this.x = posX;
    this.y = posY;
    this.value = value;
};

Gem.prototype.hide = function() {
    this.sprite = "images/transparent.png";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y );
};

/** Enemy **/

// Enemies our player must avoid
var Enemy = function( name, posX, posY ) {
    this.name = name;
    this.x = posX;
    this.y = posY;
    this.iniX = posX;
    this.iniY = posY;
    this.minSpeed = 120;
    this.maxSpeed = 360;
    this.speed = setRandom( this.minSpeed, this.maxSpeed );
    this.sprite = 'images/enemy-bug.png';
};

// Initialize all the sprites of each bug
Enemy.prototype.reset = function() {
    this.sprite = 'images/enemy-bug.png';
    this.speed = setRandom( this.minSpeed, this.maxSpeed );
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if ( this.x < 505 ) {
        this.x += ( this.speed * dt );
    } else  {
        this.x = 0;
    }
};

// Get current position of the enemy in X axis
Enemy.prototype.getPosX = function(x) {
    return Math.floor( ( 5 * x ) / 505 );
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, (this.y * 83) - 20 );
};

// Check if the enemy collided with the player
Enemy.prototype.getCollision = function( xPlayer ) {
    if ( ( this.getPosX( this.x ) == xPlayer.x ) && ( this.y == xPlayer.y ) ) {
        return true;
    }
};

/** Player **/

var Player = function( posX, posY ) {
    this.sprite = 'images/char-boy.png';
    this.x = posX;
    this.y = posY;
    this.iniX = posX;
    this.iniY = posY;
    this.score = 0;
    this.lifes = 3;
    this.level = 1;
    this.isGoalReached = false;
    this.isMoving = true;
    this.isShocked = false;
    this.isGameOver = false;
    this.isMoveToUp = true;
    this.isMoveToDown = true;
    this.isMoveToLeft = true;
    this.isMoveToRight = true;
};

// Draw the player sprite on the canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, (this.y * 83) - 10 );
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function() {

    this.checkObstacles( itemsLevel );
    if ( this.y == 0 ) {
        var self = this;
        this.isGoalReached = true;
        this.sprite = "images/char-boy-win.png";
        setTimeout( function() { self.reset(); } , timeGameReset );
    }

};

// checkObstacles according to the position of the player and each obstacle
Player.prototype.checkObstacles = function( arrElements ) {

    var playerX = this.x;
    var playerY = this.y;

    this.isMoveToUp = true;
    this.isMoveToDown = true;
    this.isMoveToLeft = true;
    this.isMoveToRight = true;

    for ( var i = 0; i < arrElements.length; i++ ) {
        if ( arrElements[i] instanceof Obstacle ) {

            var obstacleX = arrElements[i].x;
            var obstacleY = arrElements[i].y;

            if ( ( ( playerY - 1 ) == obstacleY ) && ( playerX == obstacleX ) ) {
                this.isMoveToUp = false;
            } else if ( ( ( playerY + 1 ) == obstacleY ) && ( playerX == obstacleX ) ) {
                this.isMoveToDown = false;
            } else if ( ( ( playerX - 1 ) == obstacleX ) && ( playerY == obstacleY ) ) {
                 this.isMoveToLeft = false;
            } else if ( ( ( playerX + 1 ) == obstacleX ) && ( playerY == obstacleY ) ) {
                this.isMoveToRight = false;
            }
        }
    }

};

// handleInput allows movements of the player in the canvas
Player.prototype.handleInput = function( move ) {
    if ( move == 'left' && this.x > 0 && this.isMoveToLeft ) {
        this.x--;
    } else if ( move == 'right' && this.x < 4 && this.isMoveToRight ) {
        this.x++;
    } else if ( move == 'up' && this.y > 0 && this.isMoveToUp ) {
        this.y--;
    } else if ( move == 'down' && this.y < 5 && this.isMoveToDown ){
        this.y++;
    }
};

// pickGem allows the player collect gems and get more points
Player.prototype.pickGems = function( arrElements ) {
    for ( var i = 0; i < arrElements.length; i++ ) {
        if ( arrElements[i] instanceof Gem ) {
            var gem = arrElements[i];
            if ( ( this.x == gem.x ) && ( this.y == gem.y ) ) {
                this.score += gem.value;
                gem.hide();
                itemsLevel.splice( i, 1 );
            }
        }
    }
};

// reset the player according the game status
Player.prototype.reset = function() {

    this.sprite = 'images/char-boy.png';
    this.x = this.iniX;
    this.y = this.iniY;
    this.isMoving = true;
    this.isMoveToUp = true;
    this.isMoveToDown = true;
    this.isMoveToLeft = true;
    this.isMoveToRight = true;

    if ( this.isGoalReached ) {
        this.setScore();
        this.level++;
        if ( this.level <= levels.length ){
            level = levels[ this.level - 1 ];
            itemsLevel = level.setStage();
        }
        this.isGoalReached = false;
    }

    if ( this.isShocked ) {
        this.reduceLifes();
        this.isShocked = false;
    }

};

// resetDashboard, reset the score if the game over
Player.prototype.resetDashboard = function() {
    this.score = 0;
    this.lifes = 3;
    this.level = 1;
    this.isGameOver = false;
};

// reduceLifes, decrease the number of player's attemps
Player.prototype.reduceLifes = function() {
    if ( this.lifes >= 1 ) {
        this.lifes--;
    }
};

// setScore, increase the player's score
Player.prototype.setScore = function() {
    if ( this.score >= 0 ) {
        this.score = this.score + 10000;
    }
};

/** Level **/

var Level = function( numLevel, numObstacles, numGems ) {
    this.level = numLevel;
    this.sprite = "";
    this.rangeX = [0 , 4];
    this.rangeY = [1 , 3];
    this.numObstacles = numObstacles;
    this.numGems = numGems;
};

// Draw the sprites of obstacules and gems or other elements
Level.prototype.renderElements = function ( x, y, sprite ) {
    this.sprite = sprite;
    ctx.drawImage(Resources.get(this.sprite), x * 101, (y * 83) - 22 );
};

// setStage, set the obstacles and gems according to the level randomly
Level.prototype.setStage = function ( ) {

    var items = Array();
    var arrTemp = Array();
    var x = 0, y = 0, gemPos = 0;

    var totalElements = this.numObstacles + this.numGems;

    for ( var i = this.rangeX[0]; i <= this.rangeX[1]; i++ ) {
        for ( var j = this.rangeY[0]; j <= this.rangeY[1]; j++ ) {
            arrTemp.push( [ i , j ] );
        }
    }

    shuffle(arrTemp);

    for ( var i = 0; i < totalElements; i++ ) {
        if ( i < this.numObstacles ) {
            items.push( new Obstacle( arrTemp[i][0], arrTemp[i][1] ) );
        } else {
            gemPos = setRandom( 0, ( gemsTypes.length - 1) );
            items.push( new Gem( arrTemp[i][0], arrTemp[i][1], gemsTypes[gemPos].color, gemsTypes[gemPos].value ) );
        }
    }

    return items;
};

/** Objects Instances **/

// Enemies
var allEnemies = [ new Enemy( "El Vocho", 0, 1 ), new Enemy( "La Cuca", 3, 2 ), new Enemy( "Pancho", 0, 3 ) ];

// Player
var player = new Player( 2, 4 );

// Levels
var levels = [ new Level( 1, 2, 1 ), new Level( 2, 2, 3 ), new Level( 3, 4, 2 ) ];

// Level by default
var level = levels[ player.level - 1 ];

// itemsLevel, set elements by level
var itemsLevel = level.setStage();

/** Event Listeners **/

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    if ( ( player.isMoving ) && ( player.isGameOver == false ) ){
        player.handleInput( allowedKeys[e.keyCode] );
    }
    if ( ( allowedKeys[e.keyCode] == 'enter' ) && ( player.isGameOver ) ){
       allEnemies.forEach( function(enemy) {
            enemy.reset();
        });
       player.resetDashboard();
       player.level = 1;
       level = levels[ player.level - 1 ];
       itemsLevel = level.setStage();
       player.isGameOver = false;
       player.reset();
    }
});


