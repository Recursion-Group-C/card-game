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

  drawOne(): Card | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.cardList.pop();
  }

  isEmpty(): boolean {
    return this.cardList.length === 0;
  }

  getSize(): number {
    return this.cardList.length;
  }
}
