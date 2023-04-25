/* eslint no-underscore-dangle: 0 */
import BaseScene from '../../common/scenes/BaseScene';

import Button from '../../common/Factories/button';

import GAME from '../../common/constants/game';
import STYLE from '../../common/constants/style';
import ImageUtility from '../../common/utility/ImageUtility';

import Text = Phaser.GameObjects.Text;

export default class LobbyScene extends BaseScene {
  public money = 1000;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  public highScoreText: Text | undefined;

  public highScore: number | undefined;

  #enterGameSound: Phaser.Sound.BaseSound | undefined;

  constructor(config: any) {
    super('LobbyScene', GAME.TABLE.BET_TABLE_KEY, config);
  }

  create(): void {
    this.add
      .image(0, 0, GAME.TABLE.BET_TABLE_KEY)
      .setOrigin(0);
    if (this.money === 0) {
      this.gameOver();
    } else {
      this.highScore = this.getHighScore();

      this.createGameZone();
      this.createTitle();
      this.createButtons();
      this.createText();

      this.#enterGameSound = this.scene.scene.sound.add(
        GAME.TABLE.ENTER_GAME_SOUND_KEY,
        { volume: 0.3 }
      );
    }
  }

  private getHighScore(): number {
    switch (this.config.game) {
      case 'speed':
        return Number(
          localStorage.getItem(
            GAME.STORAGE.SPEED_HIGH_SCORE_STORAGE
          )
        );
      case 'blackjack':
        return Number(
          localStorage.getItem(
            GAME.STORAGE.BLACKJACK_HIGH_SCORE_STORAGE
          )
        );
      case 'war':
        return Number(
          localStorage.getItem(
            GAME.STORAGE.WAR_HIGH_SCORE_STORAGE
          )
        );
      case 'rummy':
        return Number(
          localStorage.getItem(
            GAME.STORAGE.RUMMY_HIGH_SCORE_STORAGE
          )
        );
      case 'porker':
        return Number(
          localStorage.getItem(
            GAME.STORAGE.PORKER_HIGH_SCORE_STORAGE
          )
        );
      case 'holdem':
        return Number(
          localStorage.getItem(
            GAME.STORAGE.HOLDEM_HIGH_SCORE_STORAGE
          )
        );
      default:
        return 0;
    }
  }

  private createTitle(): void {
    const textTitle: Text = this.add.text(
      0,
      20,
      'Please select the number of players.',
      STYLE.TEXT
    );
    Phaser.Display.Align.In.Center(
      textTitle as Text,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -(this.config.height * 0.25)
    );
  }

  private createText(): void {
    this.moneyText = this.add.text(0, 0, '', STYLE.TEXT);
    this.betText = this.add.text(0, 0, '', STYLE.TEXT);
    this.highScoreText = this.add.text(
      0,
      0,
      '',
      STYLE.TEXT
    );
    this.setMoneyText(this.money);
    this.setHighScoreText();
  }

  private setHighScoreText() {
    this.highScoreText?.setText(
      `High score: $${this.highScore}`
    );
    Phaser.Display.Align.In.TopCenter(
      this.highScoreText as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject
    );
  }

  private createButtons(): void {
    const buttonHeight: number =
      Number(this.config.height) - 100;

    const startButton = new Button(
      this,
      0,
      buttonHeight,
      GAME.TABLE.BUTTON,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'Start',
      0
    );
    startButton.setClickHandler(() => {
      this.scene.start('PlayScene');
      this.#enterGameSound?.play();
    });

    const buttons: Button[] = new Array<Button>();
    buttons.push(startButton);

    ImageUtility.spaceOutImagesEvenlyHorizontally(
      buttons,
      this.scene
    );
  }

  private gameOver() {
    const graphics = this.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.75 }
    });
    const square = new Phaser.Geom.Rectangle(
      0,
      0,
      Number(this.config.width),
      Number(this.config.height)
    );
    graphics.fillRectShape(square);
    const resultText: Text = this.add.text(
      0,
      0,
      "You're Broke! Here's another grand on the house.",
      STYLE.TEXT
    );
    resultText.setColor('#ffde3d');
    Phaser.Display.Align.In.Center(
      resultText,
      this.gameZone as Phaser.GameObjects.GameObject
    );
    this.input.once(
      'pointerdown',
      () => {
        this.money = 1000;
        this.scene.restart();
      },
      this
    );
  }
}
