import GAME from '../constants/game';
import STYLE from '../constants/style';

import SpeedPlayer from '../../speed/models/player';
import Card from './cardImage';

import BaseScene from '../scenes/BaseScene';
import BetScene from '../scenes/BetScene';
import Zone = Phaser.GameObjects.Zone;
import Text = Phaser.GameObjects.Text;
import GameObject = Phaser.GameObjects.GameObject;

const GAME_PHASE = {
  BETTING: 'betting',
  PLAYING: 'playing',
  GAME_END: 'game_end'
};

export default abstract class Table extends BaseScene {
  protected gameZone: Zone | undefined;

  protected playerHandZone: Zone | undefined;

  protected aiHandZone: Zone | undefined;

  protected timerText: Text | undefined;

  protected playerNameText: Text | undefined;

  protected aiNameText: Text | undefined;

  protected player: SpeedPlayer | undefined;

  protected ai: SpeedPlayer | undefined;

  protected betScene: BetScene | undefined;

  protected gamePhase: string | undefined;

  protected initialTime = 3;

  create(): void {
    super.create();
    // create player instance
    this.player = new SpeedPlayer(
      'player',
      0,
      0,
      'deal',
      'Okuma',
      100
    );

    this.ai = new SpeedPlayer(
      'ai',
      0,
      0,
      'deal',
      'AI',
      100
    );
    this.betScene = this.scene.get('BetScene') as BetScene;
    this.initialTime = 3;
    this.createMoneyText(
      this.betScene.money,
      this.betScene.bet
    );
  }

  protected createPlayerNameText(): void {
    if (this.player) {
      this.playerNameText = this.add.text(
        0,
        300,
        this.player.name,
        STYLE.TEXT
      );
    }
    Phaser.Display.Align.In.BottomCenter(
      this.playerNameText as Text,
      this.gameZone as Zone,
      0,
      -20
    );
  }

  protected createAiNameText(): void {
    if (this.ai) {
      this.aiNameText = this.add.text(
        0,
        200,
        this.ai.name,
        STYLE.TEXT
      );
    }
    Phaser.Display.Align.In.TopCenter(
      this.aiNameText as Text,
      this.gameZone as Zone,
      0,
      -20
    );
  }

  protected createPlayerHandZone(): void {
    this.playerHandZone = this.add.zone(
      0,
      0,
      GAME.CARD.WIDTH * 5,
      GAME.CARD.HEIGHT
    );
    Phaser.Display.Align.To.TopCenter(
      this.playerHandZone as Zone,
      this.playerNameText as Text,
      0,
      STYLE.GUTTER_SIZE
    );
  }

  protected createAiHandZone(): void {
    this.aiHandZone = this.add.zone(
      0,
      0,
      GAME.CARD.WIDTH * 5,
      GAME.CARD.HEIGHT
    );
    Phaser.Display.Align.To.BottomCenter(
      this.aiHandZone as Zone,
      this.aiNameText as GameObject,
      0,
      STYLE.GUTTER_SIZE
    );
  }

  protected countDown(callback: () => void) {
    if (this.initialTime > 0) {
      this.setTimerText(`${String(this.initialTime)}`);
    } else if (this.initialTime === 0) {
      this.setTimerText('GO!!');
      // 最初にSetした文字数（ここでは３）を基準に中心位置が決まってしまうため、再度this.timerTextの位置を設定している
      Phaser.Display.Align.In.Center(
        this.timerText as Text,
        this.gameZone as GameObject,
        0,
        -20
      );
    } else {
      this.setTimerText('');
      callback();
    }
    this.initialTime -= 1;
  }

  protected createTimerText(): void {
    this.timerText = this.add.text(0, 0, '', STYLE.TIMER);
    this.setTimerText(`${String(this.initialTime)}`);
    Phaser.Display.Align.In.Center(
      this.timerText as Text,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  protected setTimerText(time: string): void {
    if (this.timerText) this.timerText.setText(`${time}`);
  }

  protected createCardDragStartEvent(): void {
    this.input.on(
      'dragstart',
      (pointer: Phaser.Input.Pointer, card: Card) => {
        this.children.bringToTop(card);
      },
      this
    );
  }

  protected createCardDragEvent(): void {
    this.input.on(
      'drag',
      (
        pointer: Phaser.Input.Pointer,
        card: Card,
        dragX: number,
        dragY: number
      ) => {
        card.setPosition(dragX, dragY);
      },
      this
    );
  }

  protected createCardDragEndEvent(): void {
    this.input.on(
      'dragend',
      (
        pointer: Phaser.Input.Pointer,
        card: Card,
        dropped: boolean
      ) => {
        if (!dropped) {
          card.returnToOrigin();
        }
      }
    );
  }

  protected createResultText(result: string): void {
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
      result as string,
      STYLE.TEXT
    );
    resultText.setColor('#ffde3d');
    resultText.setStroke('#000000', 5);
    resultText.setFontSize(60);
    Phaser.Display.Align.In.Center(
      resultText,
      this.gameZone as Phaser.GameObjects.GameObject
    );
    this.input.once(
      'pointerdown',
      () => {
        this.scene.start('BetScene');
        this.scene.stop('PlayScene');
      },
      this
    );
  }

  protected endHand(result: string): void {
    this.payOut(result);
    this.time.delayedCall(2000, () =>
      this.createResultText(result)
    );
    this.gamePhase = GAME_PHASE.GAME_END;
  }

  abstract payOut(result: string): void;

  abstract deriveGameResult(): string | undefined;

  // abstract handOutCard(deck: Deck, player: Player, toX: number, toY: number, isFaceDown: boolean): void;
}
