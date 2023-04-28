/* eslint no-underscore-dangle: 0 */
import BaseScene from './BaseScene';

import Button from '../Factories/button';

import GAME from '../constants/game';
import STYLE from '../constants/style';
import ImageUtility from '../utility/ImageUtility';

import Text = Phaser.GameObjects.Text;

export default class BetScene extends BaseScene {
  public money = 1000;

  public bet = 0;

  public level = 0;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  public highScoreText: Text | undefined;

  public highScore: number | undefined;

  #dealButton: Button | undefined;

  #clearButton: Button | undefined;

  #enterGameSound: Phaser.Sound.BaseSound | undefined;

  constructor(config: any) {
    super('BetScene', GAME.TABLE.BET_TABLE_KEY, config);
  }

  create(): void {
    super.create();

    if (this.money === 0) {
      this.gameOver();
    } else {
      this.highScore = this.getHighScore();

      if (this.bet > this.money) this.bet = this.money;

      this.createTitle();
      this.createChips();
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
      'Place Your Bet',
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
    this.setBetText(this.bet);
    this.setHighScoreText();
  }

  private setHighScoreText() {
    this.highScoreText?.setText(
      `High Score: $${this.highScore}`
    );
    Phaser.Display.Align.In.TopCenter(
      this.highScoreText as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -STYLE.GUTTER_SIZE
    );
  }

  private createChips(): void {
    const chipHeight: number =
      Number(this.config.height) / 2;

    const whiteChip = new Button(
      this,
      0,
      chipHeight,
      GAME.TABLE.WHITE_CHIP_KEY,
      GAME.TABLE.CHIP_CLICK_SOUND_KEY,
      '10',
      10
    );
    const redChip = new Button(
      this,
      0,
      chipHeight,
      GAME.TABLE.RED_CHIP_KEY,
      GAME.TABLE.CHIP_CLICK_SOUND_KEY,
      '20',
      20
    );
    const orangeChip = new Button(
      this,
      0,
      chipHeight,
      GAME.TABLE.ORANGE_CHIP_KEY,
      GAME.TABLE.CHIP_CLICK_SOUND_KEY,
      '50',
      50
    );
    const blueChip = new Button(
      this,
      0,
      chipHeight,
      GAME.TABLE.BLUE_CHIP_KEY,
      GAME.TABLE.CHIP_CLICK_SOUND_KEY,
      '100',
      100
    );

    const chips: Button[] = new Array<Button>();
    chips.push(whiteChip);
    chips.push(redChip);
    chips.push(orangeChip);
    chips.push(blueChip);

    ImageUtility.spaceOutImagesEvenlyHorizontally(
      chips as Button[],
      this.scene
    );
    chips.forEach((chip) => {
      chip.setClickHandler(() => {
        this.addChip(chip.getChipValue());
        this.#dealButton?.playFadeIn();
      });
    });
  }

  private createButtons(): void {
    this.createClearButton();
    this.createDealButton();
    this.createBackButton();
    if (this.config.canGoConfig) {
      this.createCogButton();
    }

    const buttons: Button[] = new Array<Button>();
    buttons.push(this.#clearButton as Button);
    buttons.push(this.#dealButton as Button);

    ImageUtility.spaceOutImagesEvenlyHorizontally(
      buttons as Button[],
      this.scene
    );
  }

  private createClearButton(): void {
    const buttonHeight: number =
      Number(this.config.height) * 0.75;
    this.#clearButton = new Button(
      this,
      0,
      buttonHeight,
      GAME.TABLE.BUTTON,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'Clear',
      0
    );
    this.#clearButton.setClickHandler(() => {
      this.bet = 0;
      this.setBetText(this.bet);
      this.#dealButton?.playFadeOut();
    });
  }

  private createDealButton(): void {
    const buttonHeight: number =
      Number(this.config.height) * 0.75;
    this.#dealButton = new Button(
      this,
      0,
      buttonHeight,
      GAME.TABLE.BUTTON,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'Deal',
      0
    );
    if (this.bet === 0) {
      this.#dealButton.setAlpha(0);
    }
    this.#dealButton.setClickHandler(() => {
      if (this.bet > 0) {
        this.scene.start('PlayScene');
        this.#enterGameSound?.play();
      }
    });
  }

  private createBackButton(): void {
    const backButton = new Button(
      this,
      0,
      0,
      GAME.TABLE.BACK,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY
    );

    backButton.setClickHandler(() => {
      window.location.href = '/';
    });

    Phaser.Display.Align.In.TopLeft(
      backButton as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject,
      -STYLE.GUTTER_SIZE,
      -STYLE.GUTTER_SIZE
    );
  }

  private createCogButton(): void {
    const configButton = new Button(
      this,
      0,
      0,
      GAME.TABLE.COG,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY
    );

    configButton.setClickHandler(() => {
      this.scene.start('LevelScene');
    });

    Phaser.Display.Align.In.BottomLeft(
      configButton as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject,
      -STYLE.GUTTER_SIZE,
      -STYLE.GUTTER_SIZE
    );
  }

  private addChip(value: number) {
    this.bet += value;
    if (this.bet > this.money) this.bet = this.money;
    this.setBetText(this.bet);
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
        this.bet = 0;
        this.scene.restart();
      },
      this
    );
  }
}
