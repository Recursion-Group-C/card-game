import GAME from '@/games/common/constants/game';
import GameDecision from '../../common/Factories/gameDecision';
import Player from '../../common/Factories/player';
import GameStatus from '../constants/gameStatus';
import HandRank from '../constants/handRank';

export default class PokerPlayer extends Player {
  constructor(
    playerType: string,
    bet: number,
    winAmount: number,
    gameStatus: GameStatus,
    name = 'Player',
    chips: number = GAME.PLAYER.CHIPS
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

  // eslint-disable-next-line class-methods-use-this
  promptPlayer(userData: number) {
    const result = new GameDecision('Do nothing', userData);
    return result;
  }

  getHandScore(): number {
    return this.hand.length;
  }

  getHandRank(): HandRank {
    const ranks: string[] = this.hand
      .map((card) => card.rank)
      .sort();

    // フラッシュ
    const isFlush = this.hand.every(
      (card) => card.suit === this.hand[0].suit
    );

    // ストレート
    const isStraight =
      new Set(ranks).size === 5 &&
      Number(ranks[4]) - Number(ranks[0]) === 4 &&
      new Set([ranks[0], ranks[4]]).size === 2;

    // ペア
    const pairs = ranks.filter(
      (rank, i) => rank === ranks[i + 1]
    );

    if (isFlush && isStraight) {
      return HandRank.STRAIGHT_FLUSH;
    }
    if (pairs.length === 1) {
      return HandRank.ONE_PAIR;
    }
    if (pairs.length === 2) {
      return HandRank.TWO_PAIR;
    }
    if (pairs.length === 3) {
      return HandRank.THREE_OF_A_KIND;
    }
    if (isFlush) {
      return HandRank.FLUSH;
    }
    if (isStraight) {
      return HandRank.STRAIGHT;
    }
    return HandRank.HIGH_CARD;
  }
}
