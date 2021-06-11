import Component from '@glimmer/component';
import Phaser from 'phaser';

const theGame = function () {
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 800 },
        debug: false,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  var player;
  var stars;
  var bombs;
  var platforms;
  var cursors;
  var score = 0;
  var gameOver = false;
  var scoreText;

  var game = new Phaser.Game(config);

  function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('fox', 'assets/FoxSpriteSheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  function create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(3);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('fox', {
        frames: [0, 1, 2, 3, 4],
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle2',
      frames: this.anims.generateFrameNumbers('fox', {
        frames: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('fox', {
        frames: [28, 29, 30, 31, 32, 33, 34, 35],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('fox', {
        frames: [/*42, 43, 44,*/ 45, 46, 47, 48, /*49, 50, 51, 52*/],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'bark',
      frames: this.anims.generateFrameNumbers('fox', {
        frames: [56, 57, 58, 59, 60],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'sleep',
      frames: this.anims.generateFrameNumbers('fox', {
        frames: [70, 71, 72, 73, 74, 75],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'gameover',
      frames: this.anims.generateFrameNumbers('fox', {
        frames: [30, 31],
      }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000,
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate(function (child) {
      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000',
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    player.anims.play('idle');
  }

  function update() {
    if (gameOver) {
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play('left', true);
    } else if (cursors.up.isDown) {
      player.anims.play('jump', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('idle', true);
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-200);
    }
  }

  function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
  }
};

export default class GameComponent extends Component {
  runGame() {
    theGame();
  }
}
