import GameDecision from '../../common/Factories/gameDecision';
import Player from '../../common/Factories/player';

export default class BlackjackPlayer extends Player {
  // eslint-disable-next-line class-methods-use-this
  promptPlayer(userData: number) {
    const result = new GameDecision('Do nothing', userData);
    return result;
  }

  getHandScore(): number {
    let score = 0;
    let aceCount = 0;

    this.hand.forEach((card) => {
      const value = card.getRankNumber('blackjack');
      score += value;
      if (card.rank === 'A') {
        aceCount += 1;
      }
    });

    for (let i = 0; i < aceCount; i += 1) {
      if (score > 21) {
        score -= 10; // Scoreが21を越える場合は、Aを11ではなく、1としてカウントするため、10を引く
      } else {
        break;
      }
    }

    return score;
  }
}
