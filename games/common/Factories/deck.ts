/* eslint no-underscore-dangle: 0 */
import GAME from '../constants/game';
import Card from './card';

export default class Deck {
  protected cardList: Array<Card> = [];

  constructor() {
    const suitChoices: Array<string> = [
      ...GAME.CARD.SUIT_CHOICES
    ];
    const rankChoices: Array<string> = [
      ...GAME.CARD.RANK_CHOICES
    ];

    for (let s = 0; s < suitChoices.length; s += 1) {
      for (let r = 0; r < rankChoices.length; r += 1) {
        this.cardList.push(
          new Card(suitChoices[s], rankChoices[r])
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
      console.log(
        'no more cards left. refresh to start new game.'
      );
      return undefined;
    }
    return this.cardList.pop();
  }

  isEmpty(): boolean {
    return this.cardList.length === 0;
  }

  getDeckSize(): number {
    return this.cardList.length;
  }
}
