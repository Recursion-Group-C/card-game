const GAME = {
  STORAGE: {
    BLACKJACK_HIGH_SCORE_STORAGE: 'blackjack_high_score',
    SPEED_HIGH_SCORE_STORAGE: 'speed_high_score',
    WAR_HIGH_SCORE_STORAGE: 'war_high_score',
    POKER_HIGH_SCORE_STORAGE: 'poker_high_score',
    HOLDEM_HIGH_SCORE_STORAGE: 'holdem_high_score',
    RUMMY_HIGH_SCORE_STORAGE: 'rummy_high_score'
  },
  TABLE: {
    BET_DENOMINATIONS: [5, 21, 50, 100],
    RED_CHIP_KEY: 'redChip',
    WHITE_CHIP_KEY: 'whiteChip',
    BLUE_CHIP_KEY: 'blueChip',
    ORANGE_CHIP_KEY: 'orangeChip',
    YELLOW_CHIP_KEY: 'yellowChip',
    BET_TABLE_KEY: 'betTable',
    BLACKJACK_TABLE_KEY: 'blackjackTable',
    SPEED_TABLE_KEY: 'speedTable',
    BUTTON: 'button',
    BACK: 'back',
    COG: 'cog',
    COUNT_DOWN_SOUND_KEY: 'countDown',
    ENTER_GAME_SOUND_KEY: 'enterGame',
    WIN_GAME_SOUND_KEY: 'winGame',
    LOSS_GAME_SOUND_KEY: 'lossGame',
    BUTTON_CLICK_SOUND_KEY: 'buttonClick',
    CHIP_CLICK_SOUND_KEY: 'chipClick',
    ERROR_SOUND_KEY: 'error'
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
    FLIP_OVER_SOUND_KEY: 'flipOverCard',
    PUT_DOWN_SOUND_KEY: 'putDownCard'
  },
  DECK: {
    POKER_HEIGHT: 600
  },
  COMMON_IMG_ASSETS_PATH: '/game_assets/common/images',
  COMMON_SOUND_ASSETS_PATH: '/game_assets/common/sounds'
} as const;

export default GAME;
