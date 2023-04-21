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
        GAME.COMMON_IMG_ASSETS_PATH,
        'playingCards.png'
      ),
      path.join(
        GAME.COMMON_IMG_ASSETS_PATH,
        'playingCards.xml'
      )
    );
    this.load.image(
      GAME.CARD.BACK_KEY,
      path.join(
        GAME.COMMON_IMG_ASSETS_PATH,
        'card_back_red.png'
      )
    );
    this.load.image(
      GAME.TABLE.RED_CHIP_KEY,
      path.join(GAME.COMMON_IMG_ASSETS_PATH, 'chipRed.png')
    );
    this.load.image(
      GAME.TABLE.WHITE_CHIP_KEY,
      path.join(
        GAME.COMMON_IMG_ASSETS_PATH,
        'chipWhite.png'
      )
    );
    this.load.image(
      GAME.TABLE.BLUE_CHIP_KEY,
      path.join(GAME.COMMON_IMG_ASSETS_PATH, 'chipBlue.png')
    );
    this.load.image(
      GAME.TABLE.ORANGE_CHIP_KEY,
      path.join(
        GAME.COMMON_IMG_ASSETS_PATH,
        'chipOrange.png'
      )
    );
    this.load.image(
      GAME.TABLE.YELLOW_CHIP_KEY,
      path.join(
        GAME.COMMON_IMG_ASSETS_PATH,
        'chipYellow.png'
      )
    );

    this.load.audio(
      GAME.TABLE.CHIP_CLICK_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'chipClick.mp3'
      )
    );
    this.load.audio(
      GAME.CARD.FLIP_OVER_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'flipOverCard.mp3'
      )
    );
    this.load.audio(
      GAME.CARD.PUT_DOWN_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'putDownCard.mp3'
      )
    );
    this.load.audio(
      GAME.TABLE.COUNT_DOWN_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'countDown.mp3'
      )
    );
    this.load.audio(
      GAME.TABLE.ENTER_GAME_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'enterGame.mp3'
      )
    );
    this.load.audio(
      GAME.TABLE.WIN_GAME_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'gameWin.mp3'
      )
    );
    this.load.audio(
      GAME.TABLE.LOSS_GAME_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'gameLoss.mp3'
      )
    );
    this.load.audio(
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      path.join(
        GAME.COMMON_SOUND_ASSETS_PATH,
        'buttonClick.mp3'
      )
    )
  }

  create() {
    this.scene.start('BetScene');
  }
}
