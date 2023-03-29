export default class Card {
  readonly #suit: string;

  readonly #rank: string;

  #faceDown = false;

  constructor(suit: string, rank: string) {
    this.#suit = suit;
    this.#rank = rank;
  }

  get suit(): string {
    return this.#suit;
  }

  get rank(): string {
    return this.#rank;
  }

  set faceDown(faceDown: boolean) {
    this.#faceDown = faceDown;
  }

  get faceDown(): boolean {
    return this.#faceDown;
  }

  getAtlasFrame(): string {
    return !this.#faceDown
      ? `card${this.#suit}${this.#rank}.png`
      : '';
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
