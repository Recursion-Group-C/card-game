// import Card from '@/games/common/Factories/card';
import GameDecision from '@/games/common/Factories/gameDecision';
import Player from '@/games/common/Factories/player';

export default class WarPlayer extends Player {
  constructor(
    bet: number,
    winAmount: number,
    gameStatus: string,
    name = 'WarPlayer',
    chips = 100
  ) {
    super(
      'player',
      bet,
      winAmount,
      gameStatus,
      name,
      chips
    );
  }

  // eslint-disable-next-line class-methods-use-this
  promptPlayer(): GameDecision {
    throw new Error('Method not implemented.');
  }

  clearHand() {
    this.hand.pop();
  }

  clearBet() {
    this.bet = 0;
  }

  addBet(bet: number) {
    this.bet += bet;
  }

  // eslint-disable-next-line class-methods-use-this
  getHandScore(): number {
    let score = 0;
    this.hand.forEach((card) => {
      const value = card.getRankNumber('war');
      score += value;
    });
    return score;
  }

  // eslint-disable-next-line class-methods-use-this
  getUserActionGameDecision(): GameDecision {
    throw new Error('Method not implemented.');
  }
}
