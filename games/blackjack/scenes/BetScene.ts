/* eslint-disable */
import {
  HIGH_SCORE_STORAGE,
  textStyle
} from '../constants/constants';
import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import TextUtility from '../utility/TextUtility';
import ImageUtility from '../utility/ImageUtility';
import Zone = Phaser.GameObjects.Zone;

export default class BetScene extends Phaser.Scene {
  public money = 1000;

  public bet = 0;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  public highScoreText: Text | undefined;

  public highScore: number | undefined;

  private gameZone: Zone | undefined;

  public scale: any | unknown;

  constructor() {
    super({
      key: 'BetScene'
    });
  }

  preload(): void {
    this.load.image(
      'redChip',
      '/game_assets/common/images/chipRed.png'
    );

    this.load.image(
      'whiteChip',
      '/game_assets/common/images/chipWhite.png'
    );
    this.load.image(
      'blueChip',
      '/game_assets/common/images/chipBlue.png'
    );
    this.load.image(
      'orangeChip',
      '/game_assets/common/images/chipOrange.png'
    );
    this.load.image(
      'orangeChip2',
      '/game_assets/common/images/chipOrange.png'
    );
    this.load.image(
      'yellowChip',
      '/game_assets/common/images/chipYellow.png'
    );
  }

  create(): void {
    if (this.money === 0) {
      this.gameOver();
    } else {
      this.highScore = new Number(
        localStorage.getItem(HIGH_SCORE_STORAGE)
      ).valueOf();
      if (this.bet > this.money) this.bet = this.money;
      const width: number = new Number(
        this.scene.manager.game.config.width
      ).valueOf();
      const height: number = new Number(
        this.scene.manager.game.config.height
      ).valueOf();
      this.gameZone = this.add.zone(
        width * 0.5,
        height * 0.5,
        width,
        height
      );
      this.scale = this.gameZone.height / 1100;
      if (this.scale < 1) this.scale = 1;
      this.setUpTitle();
      this.setUpButtons();
      this.setUpText();
    }
  }

  private setUpTitle(): void {
    let textTitle: Text = this.add.text(
      0,
      20,
      'Place your bet',
      textStyle
    );
    Phaser.Display.Align.In.Center(
      textTitle as Text,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -(this.gameZone!.height * 0.25)
    );
  }

  setUpHoverButtons(image: Image): void {
    image.on(
      'pointerover',
      function (this: BetScene) {
        image.setScale(1.2 * this.scale);
      },
      this
    );
    image.on(
      'pointerout',
      function (this: BetScene) {
        image.setScale(1 * this.scale);
      },
      this
    );
  }

  private setUpText(): void {
    this.moneyText = this.add.text(0, 0, '', textStyle);
    this.betText = this.add.text(0, 0, '', textStyle);
    this.highScoreText = this.add.text(0, 0, '', textStyle);

    this.updateMoneyText();
    this.updateBetText();
    this.updateHighScoreText();
  }

  private updateMoneyText(): void {
    this.moneyText?.setText('Money: $' + this.money);
    Phaser.Display.Align.In.TopRight(
      this.moneyText as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject,
      -20,
      -20
    );
  }

  private updateBetText() {
    this.betText?.setText('Bet: $' + this.bet);
    Phaser.Display.Align.To.BottomLeft(
      this.betText as Phaser.GameObjects.GameObject,
      this.moneyText as Phaser.GameObjects.GameObject
    );
  }

  private updateHighScoreText() {
    this.highScoreText?.setText(
      'High score: $' + this.highScore
    );
    Phaser.Display.Align.In.TopCenter(
      this.highScoreText as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject
    );
  }

  private setUpButtons(): void {
    let whiteChip = this.add
      .image(100, 300, 'whiteChip')
      .setScale(this.scale);
    whiteChip.setInteractive();
    whiteChip.setDataEnabled();
    whiteChip.data.set('value', 5);
    this.setUpHoverButtons(whiteChip);
    let add5 = this.add.text(175, 375, '5', textStyle);

    let redChip = this.add
      .image(200, 300, 'redChip')
      .setScale(this.scale);
    let add20 = this.add.text(260, 375, '20', textStyle);
    redChip.setInteractive();
    redChip.setDataEnabled();
    redChip.data.set('value', 20);
    this.setUpHoverButtons(redChip);

    let orangeChip = this.add
      .image(500, 300, 'orangeChip2')
      .setScale(this.scale);
    let add50 = this.add.text(900, 375, '50', textStyle);
    orangeChip.setInteractive();
    orangeChip.setDataEnabled();
    orangeChip.data.set('value', 50);
    this.setUpHoverButtons(orangeChip);

    let blueChip = this.add
      .image(600, 300, 'blueChip')
      .setScale(this.scale);
    blueChip.setInteractive();
    blueChip.setDataEnabled();
    blueChip.data.set('value', 100);
    this.setUpHoverButtons(blueChip);
    let add100 = this.add.text(550, 375, '100', textStyle);

    this.data.set('money', 1000);
    let chips: Image[] = new Array<Image>();
    chips.push(whiteChip);
    chips.push(redChip);
    chips.push(orangeChip);
    chips.push(blueChip);

    let clearButton = this.add
      .image(0, 500, 'yellowChip')
      .setScale(1.2 * this.scale);
    let clearText = this.add.text(
      0,
      575,
      'Clear',
      textStyle
    );
    let dealButton = this.add
      .image(0, 500, 'orangeChip')
      .setScale(1.2 * this.scale);
    let dealText = this.add.text(0, 575, 'Deal', textStyle);
    Phaser.Display.Align.In.BottomCenter(
      clearButton as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -(40 * this.scale)
    );
    Phaser.Display.Align.In.BottomCenter(
      dealButton as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -(40 * this.scale)
    );
    Phaser.Display.Align.In.Center(
      redChip as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      0
    );
    Phaser.Display.Align.In.Center(
      blueChip as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      0
    );
    Phaser.Display.Align.In.Center(
      whiteChip as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      0
    );
    Phaser.Display.Align.In.Center(
      orangeChip as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      100,
      0
    );
    clearButton.setInteractive();
    dealButton.setInteractive();
    this.setUpHoverButtons(clearButton);
    this.setUpHoverButtons(dealButton);
    clearButton.on(
      'pointerdown',
      function (this: BetScene) {
        this.bet = 0;
        this.updateBetText();
      },
      this
    );
    dealButton.on(
      'pointerdown',
      function (this: BetScene) {
        this.scene.start('MainScene');
      },
      this
    );
    const buttons: Image[] = new Array<Image>();
    buttons.push(clearButton);
    buttons.push(dealButton);
    ImageUtility.spaceOutImagesEvenlyHorizontally(
      buttons,
      this.scene
    );
    ImageUtility.spaceOutImagesEvenlyHorizontally(
      chips as Image[],
      this.scene as Phaser.Scenes.ScenePlugin
    );
    Phaser.Display.Align.In.Center(add5, whiteChip);
    Phaser.Display.Align.In.Center(add20, redChip);
    Phaser.Display.Align.In.Center(add50, orangeChip);
    Phaser.Display.Align.In.Center(add100, blueChip);
    Phaser.Display.Align.In.Center(clearText, clearButton);
    Phaser.Display.Align.In.Center(dealText, dealButton);
    this.setUpBetButtonHandlers(chips); // 配列の順番で横並びする
  }

  private setUpBetButtonHandlers(buttons: Image[]) {
    buttons.forEach((button) => {
      button.on(
        'pointerdown',
        function (this: BetScene) {
          this.addChip(button.data.get('value'));
        },
        this
      );
    }, this);
  }

  private addChip(value: number) {
    this.bet += value;
    if (this.bet > this.money) this.bet = this.money;
    this.updateBetText();
  }

  private gameOver() {
    const graphics = this.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.75 }
    });
    const square = new Phaser.Geom.Rectangle(
      0,
      0,
      new Number(
        this.scene.manager.game.config.width
      ).valueOf(),
      new Number(
        this.scene.manager.game.config.height
      ).valueOf()
    );
    graphics.fillRectShape(square);
    const resultText: Text = this.add.text(
      0,
      0,
      "You're Broke! Here's another grand on the house.",
      textStyle
    );
    resultText.setColor('#ffde3d');
    Phaser.Display.Align.In.Center(
      resultText,
      this.gameZone as Phaser.GameObjects.GameObject
    );
    this.input.once(
      'pointerdown',
      function (this: BetScene) {
        this.input.once(
          'pointerup',
          function (this: BetScene) {
            this.money = 1000;
            this.bet = 0;
            this.scene.restart();
          },
          this
        );
      },
      this
    );
  }
}
