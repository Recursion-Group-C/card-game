import Phaser from 'phaser';
import STYLE from '../constants/style';
import Text = Phaser.GameObjects.Text;

const MOVE_TIME = 200;
const FADE_TIME = 200;

export default class Button extends Phaser.GameObjects
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
    soundKey = '',
    key = '',
    value = 0,
    textStyle = STYLE.TEXT
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.#key = key;
    this.#initScale = 1;
    this.#text = this.scene.add.text(
      0,
      0,
      this.#key,
      textStyle
    );
    Phaser.Display.Align.In.Center(this.#text, this);

    if (soundKey) {
      this.#clickSound = this.scene.sound.add(soundKey, {
        volume: 0.6
      });
    }

    this.setScale(this.#initScale);
    this.setInteractive();
    this.setDataEnabled();
    this.data.set('value', value);
    this.setHoverHandler();
  }

  private setHoverHandler(): void {
    this.on(
      'pointerover',
      () => {
        this.setScale(1.2 * this.#initScale);
      },
      this
    );
    this.on(
      'pointerout',
      () => {
        this.setScale(this.#initScale);
      },
      this
    );
  }

  getChipValue(): number {
    return this.data.get('value');
  }

  setClickHandler(pushHandler: () => void): void {
    this.on(
      'pointerdown',
      () => {
        if (this.#clickSound) this.#clickSound.play();
        pushHandler();
      },
      this
    );
  }

  destroy(): void {
    this.#text.destroy();
    super.destroy();
  }

  setX(x: number): any {
    super.setX(x);
    Phaser.Display.Align.In.Center(this.#text, this);
  }

  setY(y: number): any {
    super.setY(y);
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

  playMoveAndDestroy(toX: number, toY: number): void {
    this.scene.tweens.add({
      targets: this,
      x: toX,
      y: toY,
      duration: MOVE_TIME,
      ease: 'Linear',
      onComplete: () => {
        this.destroy();
      }
    });
  }

  playFadeOut(): void {
    this.scene.tweens.add({
      targets: [this, this.#text],
      alpha: 0,
      duration: FADE_TIME,
      ease: 'Linear'
    });
  }

  playFadeIn(): void {
    this.scene.tweens.add({
      targets: [this, this.#text],
      alpha: 1,
      duration: FADE_TIME,
      ease: 'Linear'
    });
  }

  setAlpha(alpha: number): any {
    super.setAlpha(alpha);
    this.#text.setAlpha(alpha);
  }

  resizeButton(scale: number): void {
    if (scale < 0) {
      throw new Error('Scale value cannot be negative.');
    }
    this.setScale(this.#initScale * scale);
  }
}
