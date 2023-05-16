/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import GAME from '@/games/common/constants/game';
import Card from '@/games/common/Factories/cardImage';
import {
  HAND_RANK_MAP,
  HAND_RANK
} from '../constants/handRank';
import PokerPlayer from '../models/pokerPlayer';

export function testGetHandRank(
  scene: Phaser.Scene,
  testPlayer: PokerPlayer
): void {
  const card1: Card = new Card(
    scene,
    0,
    0,
    GAME.CARD.SUIT_CHOICES[0],
    'A',
    true
  );
  const card2: Card = new Card(
    scene,
    0,
    0,
    GAME.CARD.SUIT_CHOICES[0],
    'K',
    true
  );
  const card3: Card = new Card(
    scene,
    0,
    0,
    GAME.CARD.SUIT_CHOICES[1],
    'A',
    true
  );
  const card4: Card = new Card(
    scene,
    0,
    0,
    GAME.CARD.SUIT_CHOICES[2],
    'A',
    true
  );
  const card5: Card = new Card(
    scene,
    0,
    0,
    GAME.CARD.SUIT_CHOICES[3],
    'A',
    true
  );

  // カードを手札に追加
  testPlayer?.addCardToHand(card1);
  testPlayer?.addCardToHand(card2);
  testPlayer?.addCardToHand(card3);
  testPlayer?.addCardToHand(card4);
  testPlayer?.addCardToHand(card5);

  // 手札の役を評価
  const handRank = testPlayer?.getHandRank();

  testPlayer.hand.forEach((card) => {
    console.log(card);
  });

  if (
    handRank !== HAND_RANK_MAP.get(HAND_RANK.FOUR_OF_A_KIND)
  ) {
    // eslint-disable-next-line no-console
    console.error(
      'Hand rank evaluation failed: expected FOUR_OF_A_KIND, got',
      handRank
    );
  } else {
    console.log('PASS');
  }
}
