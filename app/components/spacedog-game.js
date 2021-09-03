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
        gravity: { y: 0 },
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
  var asteroids;
  var cursors;
  var score = 0;
  var gameOver = false;
  var scoreText;

  var game = new Phaser.Game(config);

  function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('asteroid', 'assets/star.png');
    this.load.spritesheet('fox', 'assets/FoxSpriteSheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  function create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    // The player and its settings
    player = this.physics.add.sprite(100, 450);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(2);
    // debugger
    player.body.setOffset(0, 10);
    // player.body.offset = { y: 10, x: 0 }

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
        frames: [/*42, 43, 44,*/ 45, 46, 47, 48 /*49, 50, 51, 52*/],
      }),
      frameRate: 8,
      repeat: 0,
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

    //  Some asteroids to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    asteroids = this.physics.add.group({
      key: 'asteroid',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    asteroids.children.iterate(function (child) {
      //  Give each asteroid a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000',
    });

    //  Checks to see if the player overlaps with any of the asteroids, if he does call the collectasteroid function
    // this.physics.add.overlap(player, asteroids, collectasteroid, null, this);

    this.physics.add.collider(asteroids, player);
    player.anims.play('idle');
  }

  let velocityX = 0;
  let velocityY = 0;
  const increment = 5;

  function update() {
    if (gameOver) {
      return;
    }

    if (cursors.up.isDown) {
      velocityY -= increment;
      player.setVelocityY(velocityY);
    } else if (cursors.left.isDown) {
      velocityX -= increment;
      player.setVelocityX(velocityX);
      player.setFlip(true, false);
      player.anims.play('right', true);
    } else if (cursors.right.isDown) {
      velocityX += increment;
      player.setVelocityX(velocityX);
      player.setFlip(false, false);
      player.anims.play('right', true);
    } else if (cursors.down.isDown) {
      velocityY += increment;
      player.setVelocityY(velocityY);
    } else {
      player.anims.play('idle', true);
    }
  }

  function collectAsteroid(player, asteroid) {
    asteroid.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (asteroids.countActive(true) === 0) {
      //  A new batch of asteroids to collect
      asteroids.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }
};

export default class GameComponent extends Component {
  runGame() {
    theGame();
  }
}
