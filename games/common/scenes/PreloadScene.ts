import path from 'path';

import Phaser from 'phaser';
import Text = Phaser.GameObjects.Text;

import GAME from '../constants/game';
import STYLE from '../constants/style';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // TODO: ロード画面の表示を関数にまとめる
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      centerX - 300,
      centerY - 120,
      600,
      240
    );

    const loadingText = this.make.text({
      x: centerX,
      y: centerY - 50,
      text: 'Loading...',
      style: STYLE.LOAD_TEXT
    });
    loadingText.setOrigin(0.5);

    const percentText = this.make.text({
      x: centerX,
      y: centerY + 30,
      text: '0%',
      style: STYLE.LOAD_TEXT
    });
    percentText.setOrigin(0.5);

    const assetText: Text = this.make.text({
      x: centerX,
      y: centerY + 60,
      text: '',
      style: STYLE.LOAD_TEXT
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      percentText.setText(`${value * 100}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        centerX - 150,
        centerY - 30,
        300 * value,
        30
      );
    });

    this.load.on('fileprogress', (file: any) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });
    this.load.on('complete', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0, () => {
        // progressBar.destroy();
        // progressBox.destroy();
        // loadingText.destroy();
        // percentText.destroy();
        // assetText.destroy();
      });
    });

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
    this.load.image(
      GAME.TABLE.BET_TABLE_KEY,
      path.join(GAME.COMMON_IMG_ASSETS_PATH, 'betTable.jpg')
    );
    this.load.image(
      GAME.TABLE.BLACKJACK_TABLE_KEY,
      path.join(
        GAME.COMMON_IMG_ASSETS_PATH,
        'blackjackTable.jpg'
      )
    );
    this.load.image(
      GAME.TABLE.SPEED_TABLE_KEY,
      path.join(
        GAME.COMMON_IMG_ASSETS_PATH,
        'speedTable.jpg'
      )
    );
    this.load.image(
      GAME.TABLE.BUTTON,
      path.join(GAME.COMMON_IMG_ASSETS_PATH, 'button.png')
    );
    this.load.image(
      GAME.TABLE.BACK,
      path.join(GAME.COMMON_IMG_ASSETS_PATH, 'back.png')
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
    );
    this.load.audio(
      GAME.TABLE.ERROR_SOUND_KEY,
      path.join(GAME.COMMON_SOUND_ASSETS_PATH, 'error.mp3')
    );
  }

  create() {
    // フェードアウトが完了したとき
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start('BetScene');
      }
    );
  }
}
