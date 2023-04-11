/* eslint no-underscore-dangle: 0 */
// TODO: この画面を他のゲームでも共通して使用する
import BaseScene from './BaseScene';

import Chip from '../Factories/chip';

import GAME from '../constants/game';
import STYLE from '../constants/style';
import ImageUtility from '../utility/ImageUtility';

import Text = Phaser.GameObjects.Text;

export default class BetScene extends BaseScene {
  public money = 1000;

  public bet = 0;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  public highScoreText: Text | undefined;

  public highScore: number | undefined;

  constructor(config: any) {
    super('BetScene', config);
  }

  create(): void {
    if (this.money === 0) {
      this.gameOver();
    } else {
      this.highScore = Number(
        localStorage.getItem(
          GAME.STORAGE.HIGH_SCORE_STORAGE
        )
      );
      if (this.bet > this.money) this.bet = this.money;

      this.createGameZone();
      this.createTitle();
      this.createChips();
      this.createButtons();
      this.createText();
    }
  }

  private createTitle(): void {
    const textTitle: Text = this.add.text(
      0,
      20,
      'Place your bet',
      STYLE.TEXT
    );
    Phaser.Display.Align.In.Center(
      textTitle as Text,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -(this.gameZone!.height * 0.25)
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
    this.setMoneyText();
    this.setBetText();
    this.setHighScoreText();
  }

  private setMoneyText(): void {
    this.moneyText?.setText(`Money: $${this.money}`);
    Phaser.Display.Align.In.TopRight(
      this.moneyText as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject,
      -20,
      -20
    );
  }

  private setBetText() {
    this.betText?.setText(`Bet: $${this.bet}`);
    Phaser.Display.Align.To.BottomLeft(
      this.betText as Phaser.GameObjects.GameObject,
      this.moneyText as Phaser.GameObjects.GameObject
    );
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

  private createChips(): void {
    const chipHeight: number =
      Number(this.scene.manager.game.config.height) / 2;

    const whiteChip = new Chip(
      '10',
      10,
      this,
      0,
      chipHeight,
      GAME.TABLE.WHITE_CHIP_KEY
    );
    const redChip = new Chip(
      '20',
      20,
      this,
      0,
      chipHeight,
      GAME.TABLE.RED_CHIP_KEY
    );
    const orangeChip = new Chip(
      '50',
      50,
      this,
      0,
      chipHeight,
      GAME.TABLE.ORANGE_CHIP_KEY
    );
    const blueChip = new Chip(
      '100',
      100,
      this,
      0,
      chipHeight,
      GAME.TABLE.BLUE_CHIP_KEY
    );

    const chips: Chip[] = new Array<Chip>();
    chips.push(whiteChip);
    chips.push(redChip);
    chips.push(orangeChip);
    chips.push(blueChip);

    ImageUtility.spaceOutImagesEvenlyHorizontally(
      chips as Chip[],
      this.scene
    );
    chips.forEach((chip) => {
      chip.setText();
      chip.setPushAction(() =>
        this.addChip(chip.getChipValue())
      );
    });
  }

  private createButtons(): void {
    const buttonHeight: number =
      Number(this.scene.manager.game.config.height) - 100;

    const clearButton = new Chip(
      'Clear',
      0,
      this,
      0,
      buttonHeight,
      GAME.TABLE.YELLOW_CHIP_KEY
    );
    clearButton.setPushAction(() => {
      this.bet = 0;
      this.setBetText();
    });

    const dealButton = new Chip(
      'Deal',
      0,
      this,
      0,
      buttonHeight,
      GAME.TABLE.ORANGE_CHIP_KEY
    );
    dealButton.setPushAction(() => {
      this.scene.start('PlayScene');
    });

    const buttons: Chip[] = new Array<Chip>();
    buttons.push(clearButton);
    buttons.push(dealButton);

    ImageUtility.spaceOutImagesEvenlyHorizontally(
      buttons,
      this.scene
    );
    buttons.forEach((chip) => {
      chip.setText();
    });
  }

  private addChip(value: number) {
    this.bet += value;
    if (this.bet > this.money) this.bet = this.money;
    this.setBetText();
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
