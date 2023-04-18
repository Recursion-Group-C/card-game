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

  setFaceUp(): void {
    this.#isFaceDown = false;
    this.setTexture(CARD_FRONT_KEY);
    this.setFrame(this.getAtlasFrame());
  }

  // カードを裏返す関数（裏面->表面）
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

  setDraggable(): void {
    this.setInteractive();
    this.scene.input.setDraggable(this);
  }

  // カードを元の位置に戻す関数
  returnToOrigin(): void {
    this.setPosition(
      this.input.dragStartX,
      this.input.dragStartY
    );
  }

  getAtlasFrame(): string {
    return `card-${this.#suit}-${this.#rank}.png`;
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
