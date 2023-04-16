import path from 'path';

import Phaser from 'phaser';

import GAME from '../constants/game';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.atlasXML(
      GAME.CARD.ATLAS_KEY,
      path.join(
        GAME.CARD.COMMON_ASSETS_PATH,
        'playingCards.png'
      ),
      path.join(
        GAME.CARD.COMMON_ASSETS_PATH,
        'playingCards.xml'
      )
    );
    this.load.image(
      GAME.CARD.BACK_KEY,
      path.join(
        GAME.CARD.COMMON_ASSETS_PATH,
        'card_back_red.png'
      )
    );
    this.load.image(
      GAME.TABLE.RED_CHIP_KEY,
      path.join(GAME.CARD.COMMON_ASSETS_PATH, 'chipRed.png')
    );
    this.load.image(
      GAME.TABLE.WHITE_CHIP_KEY,
      path.join(
        GAME.CARD.COMMON_ASSETS_PATH,
        'chipWhite.png'
      )
    );
    this.load.image(
      GAME.TABLE.BLUE_CHIP_KEY,
      path.join(
        GAME.CARD.COMMON_ASSETS_PATH,
        'chipBlue.png'
      )
    );
    this.load.image(
      GAME.TABLE.ORANGE_CHIP_KEY,
      path.join(
        GAME.CARD.COMMON_ASSETS_PATH,
        'chipOrange.png'
      )
    );
    this.load.image(
      GAME.TABLE.YELLOW_CHIP_KEY,
      path.join(
        GAME.CARD.COMMON_ASSETS_PATH,
        'chipYellow.png'
      )
    );
  }

  create() {
    this.scene.start('BetScene');
  }
}
