/* eslint no-underscore-dangle: 0 */
import Card from './card';

export default class Deck {
  private _cardList: Array<Card> = [];

  constructor() {
    const suitChoices = ['S', 'C', 'H', 'D'];
    const rankChoices = [
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

    for (let s = 0; s < suitChoices.length; s += 1) {
      for (let r = 0; r < rankChoices.length; r += 1) {
        this._cardList.push(
          new Card(suitChoices[s], rankChoices[r])
        );
      }
    }
  }

  shuffle(): void {
    for (let i = 0; i < this._cardList.length; i += 1) {
      const randomIndex: number = Math.floor(
        Math.random() * this._cardList.length
      );
      const temp: Card = this._cardList[i];
      this._cardList[i] = this._cardList[randomIndex];
      this._cardList[randomIndex] = temp;
    }
  }

  drawOne(): Card | undefined {
    if (this.isEmpty()) {
      console.log(
        'no more cards left. refresh to start new game.'
      );
      return undefined;
    }
    return this._cardList.pop();
  }

  isEmpty(): boolean {
    return this._cardList.length === 0;
  }
}
