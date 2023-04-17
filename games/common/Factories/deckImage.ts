/* eslint no-underscore-dangle: 0 */
import Phaser from 'phaser';
import Card from './cardImage';

const SUIT_CHOICES = [
  'Spades',
  'Clubs',
  'Hearts',
  'Diamonds'
];
const RANK_CHOICES = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
];

export default class Deck {
  cardList: Array<Card> = [];

  /**
   * Deckクラスのコンストラクタ
   *
   * @remarks
   * カードのリストを初期化する
   *
   * @param scene - このDeckクラスを生成するPhaser.Sceneインスタンス。
   * @param x - カードのx座標。
   * @param y - カードのy座標。
   * @param suitChoices - デッキに含めるマークの配列。
   * @param rankChoices - デッキに含めるランクの配列。
   *
   * @returns Deckクラスのインスタンス。
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    suitChoices = SUIT_CHOICES,
    rankChoices = RANK_CHOICES
  ) {
    for (let s = 0; s < suitChoices.length; s += 1) {
      for (let r = 0; r < rankChoices.length; r += 1) {
        this.cardList.push(
          new Card(
            scene,
            x,
            y,
            suitChoices[s],
            rankChoices[r],
            true
          )
        );
      }
    }
  }

  /**
   * デッキをシャッフルする。
   */
  shuffle(): void {
    for (let i = 0; i < this.cardList.length; i += 1) {
      const randomIndex: number = Math.floor(
        Math.random() * this.cardList.length
      );
      const temp: Card = this.cardList[i];
      this.cardList[i] = this.cardList[randomIndex];
      this.cardList[randomIndex] = temp;
    }
  }

  /**
   * デッキから1枚引いて返す
   *
   * @remarks
   * カードが残っていない場合はundefinedを返す
   *
   * @returns デッキから引いたCardクラスのインスタンス。デッキが空の場合はundefined。
   */
  drawOne(): Card | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.cardList.pop();
  }

  /**
   * デッキが空かどうかを判定する
   * @returns {boolean} デッキが空の場合true
   */
  isEmpty(): boolean {
    return this.cardList.length === 0;
  }

  /**
   * カードの残り枚数を返す
   * @returns {number} デッキ内の残りカード枚数
   */
  getSize(): number {
    return this.cardList.length;
  }
}
