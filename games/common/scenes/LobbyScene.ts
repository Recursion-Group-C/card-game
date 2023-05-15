import {
  fetchProfile,
  updateMoney,
  addResult
} from '@/utils/supabase-client';
import BaseScene from './BaseScene';

import Button from '../Factories/button';

import GAME from '../constants/game';
import STYLE from '../constants/style';
import ImageUtility from '../utility/ImageUtility';

import Text = Phaser.GameObjects.Text;

export default class LobbyScene extends BaseScene {
  public money = 1000;

  public bet = 0;

  public level = 0;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  public highScoreText: Text | undefined;

  public highScore: number | undefined;

  #chips: Array<Button> = [];

  #dealButton: Button | undefined;

  #clearButton: Button | undefined;

  #enterGameSound: Phaser.Sound.BaseSound | undefined;

  constructor(config: any) {
    super('LobbyScene', GAME.TABLE.BET_TABLE_KEY, config);
  }

  create(): void {
    super.create();

    this.loadData().then(() => {
      if (this.money === 0) {
        this.gameOver();
      } else {
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
    });
  }

  private async loadData() {
    if (this.config.userId) {
      const data = await fetchProfile(this.config.userId);
      if (data) {
        this.money = data.money;
      }
    }
  }

  private getHighScore(): number {
    return Number(localStorage.getItem(this.config.game));
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
    this.setMoneyText(this.money);

    this.betText = this.add.text(0, 0, '', STYLE.TEXT);
    this.setBetText(this.bet);

    // ユーザーがログインしていない場合に、HighScoreを表示する
    if (!this.config.userId) {
      this.highScoreText = this.add.text(
        0,
        0,
        '',
        STYLE.TEXT
      );
      this.setHighScoreText();
    }
  }

  private setHighScoreText() {
    this.highScore = this.getHighScore();
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
    this.#chips = [];

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

    this.#chips.push(whiteChip);
    this.#chips.push(redChip);
    this.#chips.push(orangeChip);
    this.#chips.push(blueChip);

    ImageUtility.spaceOutImagesEvenlyHorizontally(
      this.#chips as Button[],
      this.scene
    );

    this.#chips.forEach((chip: Button) => {
      chip.setClickHandler(() => {
        if (this.bet + chip.getChipValue() <= this.money) {
          this.addChip(chip.getChipValue());
          this.#dealButton?.playFadeIn();
          // アニメーション用のチップを作成する
          const tempChip = new Button(
            this,
            chip.x,
            chip.y,
            chip.texture.key
          );
          tempChip.playMoveAndDestroy(this.config.width, 0);
          // 現在のベット金額と追加チップの合計が所持金を上回る場合は、チップをフェードアウトする
          this.#chips.forEach((otherChip: Button) => {
            if (
              this.bet + otherChip.getChipValue() >
              this.money
            ) {
              otherChip.playFadeOut();
            }
          });
        }
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
      this.#chips.forEach((chip) => {
        chip.playFadeIn();
      });
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
        if (this.config.userId) {
          updateMoney(this.config.userId, 1000);
          addResult(
            this.config.userId,
            '',
            'GAME OVER',
            1000
          );
        }
        this.bet = 0;
        this.scene.restart();
      },
      this
    );
  }
}
