import { Scene } from 'phaser';

export default class Preloader extends Scene {
  constructor() {
    super('preloader');
  }
  preload() {
    this.load.image('sky', 'img/sky.png');
    this.load.image('ground', 'img/platform.png');
    this.load.image('star', 'img/star.png');
    this.load.image('bomb', 'img/bomb.png');
    this.load.spritesheet('dude', 'img/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.scene.start('testscene');
  }
}