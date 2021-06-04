import Component from '@glimmer/component';
import Phaser from 'phaser';

const preview = () => {
  class Example extends Phaser.Scene {
    constructor() {
      super();
    }

    preload() {
      this.load.spritesheet('fox', 'assets/FoxSpriteSheet.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
      this.load.image('grid', 'assets/grid-ps2.png');
    }

    create() {
      // Text section
      this.add.tileSprite(400, 300, 800, 600, 'grid');

      this.add.image(0, 0, 'fox', '__BASE').setOrigin(0, 0);

      this.add
        .grid(0, 0, 448, 224, 32, 32)
        .setOrigin(0, 0)
        .setOutlineStyle(0x00ff00);

      this.add.text(450, 32, '<- idle', { color: '#00ff00' }).setOrigin(0, 0.5);
      this.add
        .text(450, 32 * 2, '<- idle2', { color: '#00ff00' })
        .setOrigin(0, 0.5);
      this.add
        .text(450, 32 * 3, '<- right', { color: '#00ff00' })
        .setOrigin(0, 0.5);
      this.add
        .text(450, 32 * 4, '<- jump', { color: '#00ff00' })
        .setOrigin(0, 0.5);
      this.add
        .text(450, 32 * 5, '<- bark', { color: '#00ff00' })
        .setOrigin(0, 0.5);
      this.add
        .text(450, 32 * 6, '<- sleep', { color: '#00ff00' })
        .setOrigin(0, 0.5);
      this.add
        .text(450, 32 * 7, '<- gameover', { color: '#00ff00' })
        .setOrigin(0, 0.5);
      this.add.text(48, 440, 'Click to change animation', { color: '#00ff00' });
      const current = this.add.text(48, 460, 'Playing: idle', {
        color: '#00ff00',
      });

      // Animation set
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
          frames: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
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

      const keys = [
        'idle',
        'idle2',
        'right',
        'jump',
        'bark',
        'sleep',
        'gameover',
      ];

      const cody = this.add.sprite(600, 370);
      cody.setScale(8);
      cody.play('idle');

      let c = 0;
      this.input.on('pointerdown', function () {
        c++;
        if (c === keys.length) {
          c = 0;
        }
        cody.play(keys[c]);
        current.setText('Playing: ' + keys[c]);
      });
    }
  }

  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [Example],
  };

  const game = new Phaser.Game(config);
};

export default class SpriteSheetViewerComponent extends Component {
  spriteViewer() {
    preview();
  }
}
