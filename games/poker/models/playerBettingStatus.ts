import Phaser from 'phaser';
import STYLE from '../../common/constants/style';
import Text = Phaser.GameObjects.Text;

export default class PlayerBettingStatus extends Phaser
  .GameObjects.Image {
  #status: string;

  #initScale: number;

  #text: Text;

  #clickSound: Phaser.Sound.BaseSound | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    status: string,
    textStyle = STYLE.TEXT
  ) {
    super(scene, x, y, texture, status);
    scene.add.existing(this);

    this.#status = status;
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
      this.#status,
      textStyle
    );

    this.#status = `${status}`;
    this.#text.setFontSize(24);
    Phaser.Display.Align.In.Center(this.#text, this);
    this.setScale(this.#initScale * 0.6);
    this.setDataEnabled();
  }

  destroy(): void {
    this.#text.destroy();
    super.destroy();
  }

  setAmount(status: string, amount: number): void {
    this.#status = status;
    this.#text.setText(`${this.#status}: ${amount}`);
  }
}
