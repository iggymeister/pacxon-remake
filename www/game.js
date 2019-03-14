
//Game config
let config = {
    type: Phaser.AUTO,
    width:800,
    height:640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//Create game
let game = new Phaser.Game(config);

//Preload assets
function preload(){
    this.load.image('background', 'assets/space.jpg');
    this.load.image('tile', 'assets/blue_tile_16x16.jpg');
    this.load.spritesheet('pacman', 'assets/pacman.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('ghost', 'assets/ghost_16x16.png');
}

//Game variables
let player;
let enemy;
let cursors;
let tilesTop;
let tilesBottom;
let tilesLeft;
let tilesRight;
let enemySpeedX = 5;
let enemySpeedY = 5;
let enemyMaxY = 615;
let enemyMaxX = 775;
let enemyMinY = 25;
let enemyMinX = 25;
let tileExists = false;
let nextMove;
let lastKeyUsed;
let moving = false;
let playerMaxX = 776;
let playerMaxY = 616;
let playerMinX = 24;
let playerMinY = 24;

//Create assets
function create(){   
    //Background
    this.add.image(400, 300, 'background');
    //Top Tiles
    tilesTop = this.physics.add.group({
        key: 'tile',
        repeat: (this.sys.game.config.width / 16) - 1,
        setXY: { x: 8, y: 8, stepX: 16}
    });
    //Bottom Tiles
    tilesBottom = this.physics.add.group({
        key: 'tile',
        repeat: (this.sys.game.config.width / 16) - 1,
        setXY: { x: 8, y: this.sys.game.config.height - 8, stepX: 16}
    });
    //Left Tiles
    tilesLeft = this.physics.add.group({
        key: 'tile',
        repeat: (this.sys.game.config.height / 16) - 3,
        setXY: { x: 8, y: 24, stepY: 16}
    });
    //Right Tiles
    tilesRight = this.physics.add.group({
        key: 'tile',
        repeat: (this.sys.game.config.height / 16) - 3,
        setXY: { x: this.sys.game.config.width - 8, y: 24, stepY: 16}
    });
    //Create cursor keys
    cursors = this.input.keyboard.createCursorKeys();
    //Create player left animation
    this.anims.create(
        {
            key: 'left',
            frames: this.anims.generateFrameNumbers('pacman', { start: 3, end: 5}),
            frameRate: 10,
            repeat: -1
        }
    );
    //Create player right animation
    this.anims.create(
        {
            key: 'right',
            frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        }
    );
    //Create player up animation
    this.anims.create(
        {
            key: 'up',
            frames: this.anims.generateFrameNumbers('pacman', { start: 6, end: 8}),
            frameRate: 10,
            repeat: -1
        }
    );
    //Create player down animation
    this.anims.create(
        {
            key: 'down',
            frames: this.anims.generateFrameNumbers('pacman', { start: 9, end: 11}),
            frameRate: 10,
            repeat: -1
        }
    );
    //Add pacman sprite for player
    player = this.physics.add.sprite(8, 8, 'pacman');
    //Play animation while idle
    player.anims.play('right');   
    //Limit player within world bounds
    player.setCollideWorldBounds(true);
    //Add ghost sprite for the enemy
    enemy = this.physics.add.sprite(400, 320, 'ghost');
    //Limit enemy within world bounds
    enemy.setCollideWorldBounds(true);
}
//Create game flow and object interactions
function update(){   
    //Get tiles from tile groups into arrays
    let topTilesChildren = tilesTop.getChildren();
    let bottomTilesChildren = tilesBottom.getChildren();
    let leftTilesChildren = tilesLeft.getChildren();
    let rightTilesChildren = tilesRight.getChildren();
    //Get lengths of tile arrays
    let numTopTiles = topTilesChildren.length;
    let numBottomTiles = bottomTilesChildren.length;
    let numLeftTiles = leftTilesChildren.length;
    let numRightTiles = rightTilesChildren.length;

    //Check if a tile exists where player is standing by cycling through tile arrays
    for(let i = 0; i < numTopTiles; i++){
        if(player.x == topTilesChildren[i].x && player.y == topTilesChildren[i].y){
            tileExists = true;
            moving = false;
        }
    }
    for(let i = 0; i < numBottomTiles; i++){
        if(player.x == bottomTilesChildren[i].x && player.y == bottomTilesChildren[i].y){
            tileExists = true;
            moving = false;
        }
    }
    for(let i = 0; i < numLeftTiles; i++){
        if(player.x == leftTilesChildren[i].x && player.y == leftTilesChildren[i].y){
            tileExists = true;
            moving = false;
        }
    }
    for(let i = 0; i < numRightTiles; i++){
        if(player.x == rightTilesChildren[i].x && player.y == rightTilesChildren[i].y){
            tileExists = true;
            moving = false;
        }
    }

    //Move the enemy
    enemy.x += enemySpeedX;
    enemy.y += enemySpeedY; 

    //If enemy reaches bounds, reverse direction
    if(enemy.y >= enemyMaxY && enemySpeedY > 0){
        enemySpeedY *= -1;
    }
    else if(enemy.x >= enemyMaxX && enemySpeedX > 0){
        enemySpeedX *= -1;
    }
    else if(enemy.y <= enemyMinY && enemySpeedY < 0){
        enemySpeedY *= -1;
    }
    else if(enemy.x <= enemyMinX && enemySpeedX < 0){
        enemySpeedX *= -1;
    }

    //Player movement functions
    function moveDown(){
        if(player.y <= playerMaxY){
            player.y += 16;
            player.anims.play('down');
            lastKeyUsed = 'down';
        }
    }
    function moveUp(){
        if(player.y >= playerMinY){
            player.y -= 16;
            player.anims.play('up');
            lastKeyUsed = 'up';
        }
    }
    function moveLeft(){
        if(player.x >= playerMinX){
            player.x -= 16;
            player.anims.play('left');
            lastKeyUsed = 'left';
        }
    }
    function moveRight(){
        if(player.x <= playerMaxX){
            player.x += 16;
            player.anims.play('right');
            lastKeyUsed = 'right';
        }
    }

    //Check for keyboard input and move if detected.
    //Also wait 0.05ms before next move
    if(nextMove > this.time.now){
        return;
    }
    else if(moving == false){
        if(cursors.down.isDown){
            moving = true;
            moveDown();
        }
        else if(cursors.up.isDown){
            moving = true;
            moveUp();
        }
        else if(cursors.left.isDown){
            moving = true;
            moveLeft();
        }
        else if(cursors.right.isDown){
            moving = true;
            moveRight();
        }
        nextMove = this.time.now + 50;
    } 
    else{
        nextMove = this.time.now + 50;
    }

    //If tile is non-existant, keep moving until reaching the other side
    if(tileExists == false && lastKeyUsed == 'down'){
        this.add.image(player.x, player.y, 'tile');
        moveDown();
    }
    else if(tileExists == false && lastKeyUsed == 'up'){
        this.add.image(player.x, player.y, 'tile');
        moveUp();
    }
    else if(tileExists == false && lastKeyUsed == 'left'){
        this.add.image(player.x, player.y, 'tile');
        moveLeft();
    }
    else if(tileExists == false && lastKeyUsed == 'right'){
        this.add.image(player.x, player.y, 'tile');
        moveRight();
    }

    //Reset tileExists variable
    tileExists = false;
}

