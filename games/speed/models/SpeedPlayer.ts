import GameDecision from '../../common/Factories/gameDecision';
import Player from '../../common/Factories/player';

export default class SpeedPlayer extends Player {
  // eslint-disable-next-line class-methods-use-this
  promptPlayer(userData: number) {
    const result = new GameDecision('Do nothing', userData);
    return result;
  }

  getHandScore(): number {
    return this.hand.length;
  }
}
