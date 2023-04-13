const GAME = {
  STORAGE: {
    BLACKJACK_HIGH_SCORE_STORAGE: 'blackjack_high_score',
    SPEED_HIGH_SCORE_STORAGE: 'speed_high_score',
    WAR_HIGH_SCORE_STORAGE: 'war_high_score',
    PORKER_HIGH_SCORE_STORAGE: 'porker_high_score',
    HOLDEM_HIGH_SCORE_STORAGE: 'holdem_high_score',
    RUMMY_HIGH_SCORE_STORAGE: 'rummy_high_score'
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
