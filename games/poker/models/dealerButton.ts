import Phaser from 'phaser';
import STYLE from '../../common/constants/style';
import Text = Phaser.GameObjects.Text;

const MOVE_TIME = 200;

export default class DealerButton extends Phaser.GameObjects
  .Image {
  #key: string;

  #initScale: number;

  #text: Text;

  #clickSound: Phaser.Sound.BaseSound | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    key = 'DEALER',
    textStyle = STYLE.TEXT
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.#key = key;
    this.#initScale =
      Number(scene.scene.manager.game.config.height) /
        1100 >=
      1
        ? Number(scene.scene.manager.game.config.height) /
          1100
        : 1;
    this.#text = this.scene.add.text(
      0,
      0,
      this.#key,
      textStyle
    );

    this.#text.setFontSize(24);
    Phaser.Display.Align.In.Center(this.#text, this);
    this.setScale(this.#initScale * 0.6);
    this.setDataEnabled();
  }

  destroy(): void {
    this.#text.destroy();
    super.destroy();
  }

  setX(x: number): any {
    super.setX(x);
    Phaser.Display.Align.In.Center(this.#text, this);
  }

  playMoveTween(toX: number, toY: number): void {
    this.scene.tweens.add({
      targets: this,
      x: toX,
      y: toY,
      duration: MOVE_TIME,
      ease: 'Linear'
    });
  }
}
