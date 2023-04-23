import Phaser from 'phaser';
import Zone = Phaser.GameObjects.Zone;
import Text = Phaser.GameObjects.Text;

import STYLE from '../constants/style';

export default class BaseScene extends Phaser.Scene {
  protected config;

  protected gameZone: Zone | undefined;

  protected moneyText: Text | undefined;

  protected betText: Text | undefined;

  protected bgKey: string;

  constructor(
    sceneKey: string,
    bgKey: string,
    config: any
  ) {
    super(sceneKey);
    this.config = config;
    this.bgKey = bgKey;
  }

  create() {
    this.createGameZone();
    this.add.image(0, 0, this.bgKey).setOrigin(0);
  }

  protected createGameZone(): void {
    const width = Number(this.config.width);
    const height = Number(this.config.height);
    this.gameZone = this.add.zone(
      width * 0.5,
      height * 0.5,
      width,
      height
    );
  }

  protected createMoneyText(
    money: number,
    bet: number
  ): void {
    this.moneyText = this.add.text(0, 0, '', STYLE.TEXT);
    this.betText = this.add.text(0, 0, '', STYLE.TEXT);

    this.setMoneyText(money);
    this.setBetText(bet);
  }

  protected setMoneyText(money: number): void {
    this.moneyText?.setText(`Money: $${money}`);
    Phaser.Display.Align.In.TopRight(
      this.moneyText as Text,
      this.gameZone as Zone,
      -STYLE.GUTTER_SIZE,
      -STYLE.GUTTER_SIZE
    );
  }

  protected setBetText(bet: number): void {
    this.betText?.setText(`Bet: $${bet}`);
    Phaser.Display.Align.To.BottomLeft(
      this.betText as Text,
      this.moneyText as Text
    );
  }
}
