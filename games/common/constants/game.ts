const game = {
  storage: {
    high_score_storage: 'highscore'
  },
  table: {
    betDenominations: [5, 21, 50, 100],
    redChip_key: 'redChip',
    whiteChip_key: 'whiteChip',
    blueChip_key: 'blueChip',
    orangeChip_key: 'orangeChip',
    yellowChip_key: 'yellowChip'
  },
  player: {
    chips: 1000
  },
  card: {
    suitChoices: ['Spades', 'Clubs', 'Hearts', 'Diamonds'],
    rankChoices: [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K'
    ],
    width: 140,
    height: 190,
    flip_time: 800,
    atlas_key: 'cards',
    back_key: 'cardBack',
    common_assets_path: '/game_assets/common/images'
  }
} as const;

export default game;
