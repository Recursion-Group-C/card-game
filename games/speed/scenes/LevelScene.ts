import GAME from '@/games/common/constants/game';
import BetScene from '@/games/common/scenes/BetScene';

import STYLE from '../../common/constants/style';
import BaseScene from '../../common/scenes/BaseScene';
import MenuItem from '../constants/menuItem';

import Text = Phaser.GameObjects.Text;

const LEVEL = ['EASY', 'MEDIUM', 'HARD'];

export default class LevelScene extends BaseScene {
  #menu: Array<MenuItem> = [];

  #betScene: BetScene | undefined;

  constructor(config: any) {
    super('LevelScene', GAME.TABLE.BET_TABLE_KEY, {
      ...config,
      canGoBack: true
    });
  }

  create(): void {
    super.create();
    this.#betScene = this.scene.get('BetScene') as BetScene;

    this.createTitle();

    this.#menu = [];
    for (let i = 0; i < LEVEL.length; i += 1) {
      this.#menu.push({
        scene: 'BetScene',
        text: LEVEL[i],
        level: i,
        button: undefined
      });
    }

    this.createMenu(
      this.#menu,
      this.setupMenuEvents.bind(this)
    );
  }

  private createTitle(): void {
    const textTitle: Text = this.add.text(
      0,
      20,
      'Select Difficulty',
      STYLE.TEXT
    );
    Phaser.Display.Align.In.Center(
      textTitle as Text,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -(this.config.height * 0.25)
    );
  }

  private setupMenuEvents(menuItem: MenuItem): void {
    // eslint-disable-next-line prefer-destructuring
    const button = menuItem.button;

    button?.setClickHandler(() => {
      if (menuItem.scene && this.#betScene) {
        this.#betScene.level = menuItem.level;
        this.scene.start(menuItem.scene);
      }
    });
  }
}
