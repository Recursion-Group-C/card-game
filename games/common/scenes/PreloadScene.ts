import path from 'path';

import Phaser from 'phaser';

import game from '../constants/game';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.atlasXML(
      game.card.atlas_key,
      path.join(
        game.card.common_assets_path,
        'playingCards.png'
      ),
      path.join(
        game.card.common_assets_path,
        'playingCards.xml'
      )
    );
    this.load.image(
      game.card.back_key,
      path.join(
        game.card.common_assets_path,
        'card_back_red.png'
      )
    );
    this.load.image(
      game.table.redChip_key,
      path.join(game.card.common_assets_path, 'chipRed.png')
    );
    this.load.image(
      game.table.whiteChip_key,
      path.join(
        game.card.common_assets_path,
        'chipWhite.png'
      )
    );
    this.load.image(
      game.table.blueChip_key,
      path.join(
        game.card.common_assets_path,
        'chipBlue.png'
      )
    );
    this.load.image(
      game.table.orangeChip_key,
      path.join(
        game.card.common_assets_path,
        'chipOrange.png'
      )
    );
    this.load.image(
      game.table.yellowChip_key,
      path.join(
        game.card.common_assets_path,
        'chipYellow.png'
      )
    );
  }

  create() {
    this.scene.start('BetScene');
  }
}
