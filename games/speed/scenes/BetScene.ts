/* eslint no-underscore-dangle: 0 */
// TODO: この画面を他のゲームでも共通して使用する
import BaseScene from '../../common/scenes/BaseScene';

import game from '../../common/constants/game';
import style from '../../common/constants/style';
import ImageUtility from '../../common/utility/ImageUtility';

import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import Zone = Phaser.GameObjects.Zone;

export default class BetScene extends BaseScene {
  public money = 1000;

  public bet = 0;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  public highScoreText: Text | undefined;

  public highScore: number | undefined;

  private gameZone: Zone | undefined;

  public scale: any | unknown;

  constructor(config: any) {
    super('BetScene', config);
  }

  create(): void {
    if (this.money === 0) {
      this.gameOver();
    } else {
      this.highScore = Number(
        localStorage.getItem(
          game.storage.high_score_storage
        )
      );
      if (this.bet > this.money) this.bet = this.money;
      const width = Number(
        this.scene.manager.game.config.width
      );
      const height = Number(
        this.scene.manager.game.config.height
      );
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
    const textTitle: Text = this.add.text(
      0,
      20,
      'Place your bet',
      style.text
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
      () => {
        image.setScale(1.2 * this.scale);
      },
      this
    );
    image.on(
      'pointerout',
      () => {
        image.setScale(1 * this.scale);
      },
      this
    );
  }

  private setUpText(): void {
    this.moneyText = this.add.text(0, 0, '', style.text);
    this.betText = this.add.text(0, 0, '', style.text);
    this.highScoreText = this.add.text(
      0,
      0,
      '',
      style.text
    );

    this.updateMoneyText();
    this.updateBetText();
    this.updateHighScoreText();
  }

  private updateMoneyText(): void {
    this.moneyText?.setText(`Money: $${this.money}`);
    Phaser.Display.Align.In.TopRight(
      this.moneyText as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject,
      -20,
      -20
    );
  }

  private updateBetText() {
    this.betText?.setText(`Bet: $${this.bet}`);
    Phaser.Display.Align.To.BottomLeft(
      this.betText as Phaser.GameObjects.GameObject,
      this.moneyText as Phaser.GameObjects.GameObject
    );
  }

  public updateBetDoubleText() {
    this.betText?.setText(`Bet: $${this.bet * 2}`);
    Phaser.Display.Align.To.BottomLeft(
      this.betText as Phaser.GameObjects.GameObject,
      this.moneyText as Phaser.GameObjects.GameObject
    );
  }

  private updateHighScoreText() {
    this.highScoreText?.setText(
      `High score: $${this.highScore}`
    );
    Phaser.Display.Align.In.TopCenter(
      this.highScoreText as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject
    );
  }

  private setUpButtons(): void {
    const whiteChip = this.add
      .image(100, 300, game.table.whiteChip_key)
      .setScale(this.scale);
    whiteChip.setInteractive();
    whiteChip.setDataEnabled();
    whiteChip.data.set('value', 5);
    this.setUpHoverButtons(whiteChip);
    const add5 = this.add.text(175, 375, '5', style.text);

    const redChip = this.add
      .image(200, 300, game.table.redChip_key)
      .setScale(this.scale);
    const add20 = this.add.text(260, 375, '20', style.text);
    redChip.setInteractive();
    redChip.setDataEnabled();
    redChip.data.set('value', 20);
    this.setUpHoverButtons(redChip);

    const orangeChip = this.add
      .image(500, 300, game.table.orangeChip_key)
      .setScale(this.scale);
    const add50 = this.add.text(900, 375, '50', style.text);
    orangeChip.setInteractive();
    orangeChip.setDataEnabled();
    orangeChip.data.set('value', 50);
    this.setUpHoverButtons(orangeChip);

    const blueChip = this.add
      .image(600, 300, game.table.blueChip_key)
      .setScale(this.scale);
    blueChip.setInteractive();
    blueChip.setDataEnabled();
    blueChip.data.set('value', 100);
    this.setUpHoverButtons(blueChip);
    const add100 = this.add.text(
      550,
      375,
      '100',
      style.text
    );

    this.data.set('money', 1000);
    const chips: Image[] = new Array<Image>();
    chips.push(whiteChip);
    chips.push(redChip);
    chips.push(orangeChip);
    chips.push(blueChip);

    const clearButton = this.add
      .image(0, 500, 'yellowChip')
      .setScale(1.2 * this.scale);
    const clearText = this.add.text(
      0,
      575,
      'Clear',
      style.text
    );
    const dealButton = this.add
      .image(0, 500, 'orangeChip')
      .setScale(1.2 * this.scale);
    const dealText = this.add.text(
      0,
      575,
      'Deal',
      style.text
    );
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
      () => {
        this.bet = 0;
        this.updateBetText();
      },
      this
    );
    dealButton.on(
      'pointerdown',
      () => {
        this.scene.start('PlayScene');
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
        () => {
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
      Number(this.scene.manager.game.config.width),
      Number(this.scene.manager.game.config.height)
    );
    graphics.fillRectShape(square);
    const resultText: Text = this.add.text(
      0,
      0,
      "You're Broke! Here's another grand on the house.",
      style.text
    );
    resultText.setColor('#ffde3d');
    Phaser.Display.Align.In.Center(
      resultText,
      this.gameZone as Phaser.GameObjects.GameObject
    );
    this.input.once(
      'pointerdown',
      () => {
        this.input.once(
          'pointerup',
          () => {
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
