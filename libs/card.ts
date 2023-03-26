/* eslint no-underscore-dangle: 0 */
export default class Card {
  private readonly _suit: string;

  private readonly _rank: string;

  constructor(suit: string, rank: string) {
    this._suit = suit;
    this._rank = rank;
  }

  get suit(): string {
    return this._suit;
  }

  get rank(): string {
    return this._rank;
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
    return rankToNum[this.rank] ?? -1; // if rankToNum[this.rank] is undefined, this function returns -1
  }
}

