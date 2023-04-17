// import Card from '@/games/common/Factories/card';
import GameDecision from '../../common/Factories/gameDecision';
import Player from '../../common/Factories/player';

export default class WarPlayer extends Player {
  // eslint-disable-next-line class-methods-use-this
  promptPlayer(): GameDecision {
    throw new Error('Method not implemented.');
  }

  getHandScore(): number {
    let score = 0;
    this.hand.forEach((card) => {
      const value = card.getRankNumber('war');
      score += value;
    });
    return score;
  }
}
