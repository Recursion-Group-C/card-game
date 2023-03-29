const game = {
  table: {
    betDenominations: [5, 20, 50, 100]
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
    common_assets_path: '/game_assets/common/images'
  }
} as const;

export default game;
