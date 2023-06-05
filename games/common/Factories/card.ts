/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Phaser from 'phaser';
import GAME from '../constants/game';

const CARD_BACK_KEY = 'cardBack';
const CARD_FRONT_KEY = 'cards';
const FLIP_TIME = 350;
const MOVE_TIME = 350;

export default class Card extends Phaser.GameObjects.Image {
  readonly #suit: string;

  readonly #rank: string;

  #isFaceDown: boolean;

  #flipOverSound: Phaser.Sound.BaseSound;

  #putDownSound: Phaser.Sound.BaseSound;

  originalPositionX: number | undefined;

  originalPositionY: number | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    suit: string,
    rank: string,
    isFaceDown: boolean
  ) {
    super(scene, x, y, CARD_BACK_KEY); // 一時的に裏面のImageを作成する
    scene.add.existing(this);
    this.#suit = suit;
    this.#rank = rank;
    this.#isFaceDown = isFaceDown;
    this.#flipOverSound = this.scene.sound.add(
      GAME.CARD.FLIP_OVER_SOUND_KEY,
      { volume: 0.3 }
    );
    this.#putDownSound = this.scene.sound.add(
      GAME.CARD.PUT_DOWN_SOUND_KEY,
      { volume: 0.3 }
    );

    // 初期状態が表向きの場合は、表面のImageに更新する
    if (!isFaceDown) {
      this.setFaceUp();
    }

    this.setInteractive();
  }

  get suit(): string {
    return this.#suit;
  }

  get rank(): string {
    return this.#rank;
  }

  get isFaceDown(): boolean {
    return this.#isFaceDown;
  }

  /**
   * カードを表向きにし、表面の画像を設定
   * @returns なし。
   */
  setFaceUp(): void {
    this.#isFaceDown = false;
    this.setTexture(CARD_FRONT_KEY);
    this.setFrame(this.getAtlasFrame());
  }

  /**
   * カードを裏返すアニメーションを再生。
   * アニメーション完了後、カードの表面に更新する。
   * @returns なし
   */
  playFlipOverTween(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      duration: FLIP_TIME,
      ease: 'Linear',
      onComplete: () => {
        // アニメーション完了後に実行するコールバック関数を追加
        this.setFaceUp();
        this.#flipOverSound.play();
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          duration: FLIP_TIME,
          delay: FLIP_TIME,
          ease: 'Linear'
        });
      }
    });
  }

  /**
   * カードを新しい位置に移動するアニメーション
   * @param toX 移動先のx座標
   * @param toY 移動先のy座標
   */
  playMoveTween(toX: number, toY: number): void {
    this.#putDownSound.play();
    this.scene.tweens.add({
      targets: this,
      x: toX,
      y: toY,
      duration: MOVE_TIME,
      ease: 'Linear'
    });
  }

  /**
   * ドラッグ可能な状態に設定する
   */
  setDraggable(): void {
    this.setInteractive();
    this.scene.input.setDraggable(this);
  }

  /**
   * カードを元の位置に戻す関数
   */
  returnToOrigin(): void {
    this.setPosition(
      this.input.dragStartX,
      this.input.dragStartY
    );
  }

  /**
   * カードの表面の画像フレーム取得
   * @returns カードの表面の画像ファイル名
   */
  getAtlasFrame(): string {
    return `card-${this.#suit}-${this.#rank}.png`;
  }

  /**
   * クリック可能にする。
   */
  enableClick(): void {
    this.on('pointerdown', this.onClick, this);
    this.setOriginalPosition();
  }

  setOriginalPosition(): void {
    this.originalPositionX = this.x;
    this.originalPositionY = this.y;
  }

  /**
   * クリック無効にする。
   */
  disableClick(): void {
    this.off('pointerdown', this.onClick, this);
  }

  /**
   * クリックされた際のイベントハンドラ。
   * クリックされた場合、カードの位置を上方向に移動する。
   * すでに移動している場合はもとの位置に戻す。
   */
  private onClick(): void {
    if (this.y === this.originalPositionY) {
      this.y -= 20;
    } else {
      this.y = this.originalPositionY as number;
    }
  }

  /**
   * カードが上に移動しているかを判定する。
   * @return true: 上に移動している。
   */
  isMoveUp(): boolean {
    return this.y !== this.originalPositionY;
  }

  getRankNumber(gameType: string): number {
    let rankToNum;
    switch (gameType) {
      case 'blackjack':
        rankToNum = {
          A: 11,
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
          '6': 6,
          '7': 7,
          '8': 8,
          '9': 9,
          '10': 10,
          J: 10,
          Q: 10,
          K: 10
        };
        break;
      case 'war':
        rankToNum = {
          A: 14,
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
          '6': 6,
          '7': 7,
          '8': 8,
          '9': 9,
          '10': 10,
          J: 11,
          Q: 12,
          K: 13
        };
        break;
      default:
        rankToNum = {
          A: 1,
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
          '6': 6,
          '7': 7,
          '8': 8,
          '9': 9,
          '10': 10,
          J: 11,
          Q: 12,
          K: 13
        };
        break;
    }
    return rankToNum[this.#rank] ?? 0; // if rankToNum[this.rank] is undefined, this function returns 0
  }
}
