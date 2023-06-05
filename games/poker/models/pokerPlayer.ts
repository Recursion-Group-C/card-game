import GAME from '@/games/common/constants/game';
import GameDecision from '../../common/Factories/gameDecision';
import Player from '../../common/Factories/player';
import {
  HAND_RANK,
  HAND_RANK_MAP
} from '../constants/handRank';

export default class PokerPlayer extends Player {
  constructor(
    playerType: 'player' | 'cpu',
    bet: number,
    winAmount: number,
    gameStatus: string,
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

  getHandRank(): number {
    const ranks: number[] = this.hand
      .map((card) =>
        GAME.CARD.RANK_CHOICES.indexOf(
          card.rank as
            | 'A'
            | '2'
            | '3'
            | '4'
            | '5'
            | '6'
            | '7'
            | '8'
            | '9'
            | '10'
            | 'J'
            | 'Q'
            | 'K'
        )
      )
      .sort((a, b) => a - b);

    console.log(ranks[4], ranks[0]);

    // フラッシュ
    const isFlush = this.hand.every(
      (card) => card.suit === this.hand[0].suit
    );

    // ストレート
    let isStraight: boolean;

    if (ranks[4] === 12 && ranks[0] === 0) {
      // Aを0として扱う場合のストレート
      isStraight =
        ranks[3] === 11 &&
        ranks[2] === 10 &&
        ranks[1] === 9;
    } else {
      // Aを13として扱う場合のストレート
      console.log('Aを13として扱う場合のストレート');
      isStraight =
        ranks[4] - ranks[0] === 4 &&
        new Set(ranks).size === 5;
    }

    console.log(
      new Set(ranks).size,
      Number(ranks[4]) - Number(ranks[0])
    );

    const isRoyalStraightFlush =
      isFlush &&
      isStraight &&
      ranks[0] === 0 &&
      ranks[4] === 12;

    // ペア
    const pairs = ranks.filter(
      (rank, i) => rank === ranks[i + 1]
    );

    // フルハウス
    const isFullHouse =
      pairs.length === 3 && new Set(pairs).size === 2;

    console.log(isFlush, isStraight);
    console.log(pairs.length, new Set(pairs).size);

    if (isRoyalStraightFlush) {
      return HAND_RANK_MAP.get(
        HAND_RANK.ROYAL_STRAIGHT_FLUSH
      ) as number;
    }
    if (isFlush && isStraight) {
      return HAND_RANK_MAP.get(
        HAND_RANK.STRAIGHT_FLUSH
      ) as number;
    }
    if (isFullHouse) {
      return HAND_RANK_MAP.get(
        HAND_RANK.FULL_HOUSE
      ) as number;
    }
    if (pairs.length === 1) {
      return HAND_RANK_MAP.get(
        HAND_RANK.ONE_PAIR
      ) as number;
    }
    if (pairs.length === 2 && new Set(pairs).size === 2) {
      return HAND_RANK_MAP.get(
        HAND_RANK.TWO_PAIR
      ) as number;
    }
    if (pairs.length === 2 && new Set(pairs).size === 1) {
      return HAND_RANK_MAP.get(
        HAND_RANK.THREE_OF_A_KIND
      ) as number;
    }
    if (pairs.length === 3 && new Set(pairs).size === 1) {
      return HAND_RANK_MAP.get(
        HAND_RANK.FOUR_OF_A_KIND
      ) as number;
    }
    if (isFlush) {
      return HAND_RANK_MAP.get(HAND_RANK.FLUSH) as number;
    }
    if (isStraight) {
      return HAND_RANK_MAP.get(
        HAND_RANK.STRAIGHT
      ) as number;
    }
    return HAND_RANK_MAP.get(HAND_RANK.HIGH_CARD) as number;
  }
}
