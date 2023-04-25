import Button from '@/games/common/Factories/button';
import GAME from '@/games/common/constants/game';
import MenuItem from '@/games/speed/constants/menuItem';
import Phaser from 'phaser';
import Zone = Phaser.GameObjects.Zone;
import Text = Phaser.GameObjects.Text;

import ImageUtility from '../utility/ImageUtility';

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

    if (this.config.canGoBack) {
      const backButton = new Button(
        this,
        0,
        0,
        GAME.TABLE.BACK,
        GAME.TABLE.BUTTON_CLICK_SOUND_KEY
      );

      Phaser.Display.Align.In.TopLeft(
        backButton as Phaser.GameObjects.GameObject,
        this.gameZone as Phaser.GameObjects.GameObject,
        -STYLE.GUTTER_SIZE,
        -STYLE.GUTTER_SIZE
      );

      backButton.setClickHandler(() => {
        this.scene.start('BetScene');
      });
    }
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

  protected createMenu(
    menu: Array<MenuItem>,
    setupMenuEvents: (menuItem: MenuItem) => void
  ) {
    const buttons: Button[] = new Array<Button>();

    for (let i = 0; i < menu.length; i += 1) {
      const menuItem = menu[i];
      menuItem.button = new Button(
        this,
        0,
        this.config.height / 2,
        GAME.TABLE.BUTTON,
        GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
        menuItem.text
      );
      buttons.push(menuItem.button);
      setupMenuEvents(menuItem);
    }
    ImageUtility.spaceOutImagesEvenlyHorizontally(
      buttons as Button[],
      this.scene
    );
  }
}
