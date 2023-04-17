import Phaser from 'phaser';
import Text = Phaser.GameObjects.Text;
import STYLE from '../constants/style';

const MOVE_TIME = 200;

export default class Chip extends Phaser.GameObjects.Image {
  #key: string;

  #initScale: number;

  #text: Text;

  /**
   * Chipオブジェクトを生成する
   * @remarks
   * PhaserのImageオブジェクトを拡張している
   * @param scene - Chipオブジェクトを追加するPhaser.Sceneオブジェクト
   * @param x - Chipオブジェクトのx座標
   * @param y - Chipオブジェクトのy座標
   * @param texture - チップのテクスチャ名
   * @param key - チップのキー名
   * @param value - チップの額面の値
   * @param textStyle - チップのテキストスタイル
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    key = '',
    value = 0,
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
    Phaser.Display.Align.In.Center(this.#text, this);

    this.setScale(this.#initScale);
    this.setInteractive();
    this.setDataEnabled();
    this.data.set('value', value);
    this.setHoverHandler();
  }

  /**
   * Chipをマウスオーバーしたときの挙動を設定する
   *
   * @remarks
   * Chipをマウスオーバーしたとき、Chipのサイズを1.2倍に拡大する
   *
   * @returns なし。
   */
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

  /**
   * Chipの額面の値を取得する
   * @returns Chipの額面の値
   */
  getChipValue(): number {
    return this.data.get('value');
  }

  /**
   * Chipをクリックしたときの挙動を設定する
   * @param pushHandler Chipをクリックしたときに実行する関数
   */
  setClickHandler(pushHandler: () => void): void {
    this.on('pointerdown', pushHandler, this);
  }

  /**
   * Chipオブジェクトを破棄する
   * @remarks
   * 同時にテキストオブジェクトも破棄する
   */
  destroy(): void {
    this.#text.destroy();
    super.destroy();
  }

  /**
   * Chipオブジェクトのx座標を設定する
   * @remarks
   * Chipオブジェクトのx座標設定後、テキストをChipの中央に配置
   * @param x Chipオブジェクトのx座標
   */
  setX(x: number): any {
    super.setX(x);
    Phaser.Display.Align.In.Center(this.#text, this);
  }

  /**
   * Chipオブジェクトをアニメーションで移動させる。
   * @param toX 移動先のx座標
   * @param toY 移動先のy座標
   */
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
