const GAME = {
  STORAGE: {
    HIGH_SCORE_STORAGE: 'highscore'
  },
  TABLE: {
    BET_DENOMINATIONS: [5, 21, 50, 100],
    RED_CHIP_KEY: 'redChip',
    WHITE_CHIP_KEY: 'whiteChip',
    BLUE_CHIP_KEY: 'blueChip',
    ORANGE_CHIP_KEY: 'orangeChip',
    YELLOW_CHIP_KEY: 'yellowChip'
  },
  PLAYER: {
    CHIPS: 1000
  },
  CARD: {
    SUIT_CHOICES: ['Spades', 'Clubs', 'Hearts', 'Diamonds'],
    RANK_CHOICES: [
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
    WIDTH: 140,
    HEIGHT: 190,
    FLIP_TIME: 800,
    ATLAS_KEY: 'cards',
    BACK_KEY: 'cardBack',
    COMMON_ASSETS_PATH: '/game_assets/common/images'
  }
} as const;

export default GAME;
