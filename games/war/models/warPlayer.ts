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

  promptPlayer(userData: number): GameDecision {
    // 押されたボタンに応じてプレイを選ぶ
    if (this.gameStatus === 'broke') {
      return new GameDecision('broke', 0);
    }

    if (this.gameStatus === 'bet') {
      return new GameDecision('bet', userData);
    }

    if (this.gameStatus === 'war') {
      return new GameDecision('war', this.bet);
    }

    if (this.gameStatus === 'surrender') {
      return new GameDecision('surrender', this.bet);
    }

    throw new Error('Invalid game status');
  }

  //   addCardToHand(card: Card) {
  //     this.hand.push(card);
  //   }

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

  getUserActionGameDecision(): GameDecision {
    return this.promptPlayer(this.bet);
  }
}
