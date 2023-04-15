/* eslint-disable */
import GameDecision from '@/games/common/Factories/gameDecision';
import Card from '../../common/Factories/cardImage';
import Player from '../../common/Factories/player';

export default class SpeedPlayer extends Player {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    playerType: string,
    bet: number,
    winAmount: number,
    gameStatus: string,
    name: string,
    chips: number
  ) {
    super(
      playerType,
      bet,
      winAmount,
      gameStatus,
      name,
      chips
    );
  }

  removeCardFromHand(card: Card): void {
    for (let i = 0; i < this.hand.length; i += 1) {
      if (
        this.hand[i].suit === card.suit &&
        this.hand[i].rank === card.rank
      ) {
        this.hand.splice(i, 1);
      }
    }
  }

  promptPlayer(userData: number) {
    const result = new GameDecision('Do nothing', userData);
    return result;
  }

  getHandScore(): number {
    return this.hand.length;
  }
}
