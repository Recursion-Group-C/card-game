import LobbyScene from '@/games/common/scenes/LobbyScene';
import { Result } from '@/games/common/types/game';
import {
  addResult,
  updateMoney
} from '@/utils/supabase-client';
import GAME from '../constants/game';
import STYLE from '../constants/style';
import BaseScene from '../scenes/BaseScene';
import Card from './cardImage';
import Deck from './deckImage';
import Player from './player';
import Zone = Phaser.GameObjects.Zone;
import Text = Phaser.GameObjects.Text;
import GameObject = Phaser.GameObjects.GameObject;

export default abstract class Table extends BaseScene {
  protected playerHandZones: Array<Zone> = [];

  protected timerText: Text | undefined;

  protected playerNameTexts: Array<Text> = [];

  protected players: Array<Player> = [];

  protected lobbyScene: LobbyScene | undefined;

  protected deck: Deck | undefined;

  protected gamePhase: string | undefined;

  protected turnCounter = 0;

  protected initialTime = 2;

  #winGameSound: Phaser.Sound.BaseSound | undefined;

  #lossGameSound: Phaser.Sound.BaseSound | undefined;

  create(): void {
    super.create();
    this.lobbyScene = this.scene.get(
      'LobbyScene'
    ) as LobbyScene;
    if (this.config.game === 'poker') {
      this.createMoneyText(this.lobbyScene.money, 0);
    } else {
      this.createMoneyText(
        this.lobbyScene.money,
        this.lobbyScene.bet
      );
    }

    this.turnCounter = 0;
    this.initialTime = 2;

    this.#winGameSound = this.scene.scene.sound.add(
      GAME.TABLE.WIN_GAME_SOUND_KEY,
      { volume: 0.3 }
    );
    this.#lossGameSound = this.scene.scene.sound.add(
      GAME.TABLE.LOSS_GAME_SOUND_KEY,
      { volume: 0.3 }
    );
  }

  get winGameSound(): Phaser.Sound.BaseSound | undefined {
    return this.#winGameSound;
  }

  get lossGameSound(): Phaser.Sound.BaseSound | undefined {
    return this.#lossGameSound;
  }

  /**
   * デッキをリセットしてシャッフルする。
   * @param x デッキのx座標（オプション）
   * @param y デッキのy座標（オプション）
   */
  protected resetAndShuffleDeck(
    x?: number,
    y?: number
  ): void {
    this.deck = undefined;
    this.deck = new Deck(this, x ?? 0, y ?? 0);
    this.deck.shuffle();
  }

  protected createPlayerNameTexts(): void {
    this.playerNameTexts = []; // 前回のゲームで作成したものが残っている可能性があるので、初期化する
    this.players.forEach((player) => {
      const playerNameText = this.add.text(
        0,
        300,
        player.name,
        STYLE.NAME_TEXT
      );

      if (player.playerType === 'player') {
        Phaser.Display.Align.In.BottomCenter(
          playerNameText as Text,
          this.gameZone as Zone,
          0,
          -20
        );
      } else if (player.playerType === 'house') {
        Phaser.Display.Align.In.TopCenter(
          playerNameText as Text,
          this.gameZone as Zone,
          0,
          -20
        );
      } else if (player.playerType === 'cpu') {
        Phaser.Display.Align.In.TopCenter(
          playerNameText as Text,
          this.gameZone as Zone,
          0,
          -20
        );
      }
      // aiが存在する場合は、個別に位置の設定が必要。
      this.playerNameTexts.push(playerNameText);
    });
  }

  protected createPlayerHandZones(
    width: number,
    height: number
  ): void {
    this.playerHandZones = []; // 前回のゲームで作成したものが残っている可能性があるので、初期化する
    this.players.forEach((player, index) => {
      const playerHandZone = this.add.zone(
        0,
        0,
        width,
        height
      );

      if (player.playerType === 'player') {
        Phaser.Display.Align.To.TopCenter(
          playerHandZone as Zone,
          this.playerNameTexts[index] as Text,
          0,
          STYLE.GUTTER_SIZE
        );
      } else if (player.playerType === 'house') {
        Phaser.Display.Align.To.BottomCenter(
          playerHandZone as Zone,
          this.playerNameTexts[index] as GameObject,
          0,
          STYLE.GUTTER_SIZE
        );
      } else if (player.playerType === 'cpu') {
        Phaser.Display.Align.To.BottomCenter(
          playerHandZone as Zone,
          this.playerNameTexts[index] as GameObject,
          0,
          STYLE.GUTTER_SIZE
        );
      }
      // aiが存在する場合は、個別に位置の設定が必要。
      this.playerHandZones.push(playerHandZone);
    });
  }

  protected countDown(callback: () => void) {
    this.initialTime -= 1;
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

  protected createResultText(
    result: string,
    winAmount: number
  ): void {
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
      `${result} ${Table.formatNumber(winAmount)}`,
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
        this.scene.start('LobbyScene');
        this.scene.stop('PlayScene');
      },
      this
    );
  }

  private static formatNumber(amount: number): string {
    let result: string;
    if (amount > 0) {
      result = `+$${amount}`;
    } else if (amount === 0) {
      result = '';
    } else {
      result = `-$${Math.abs(amount)}`;
    }
    return result;
  }

  protected setBetDouble(): void {
    if (this.lobbyScene) {
      this.lobbyScene.bet *= 2;
      this.setBetText(this.lobbyScene.bet);
    }
  }

  abstract handOutCard(
    deck: Deck,
    player: Player,
    toX: number,
    toY: number,
    isFaceDown: boolean
  ): void;

  protected endHand(result: string): void {
    const resultObj = this.payOut(result);
    this.time.delayedCall(500, () => {
      this.createResultText(result, resultObj.winAmount);
      this.playGameResultSound(result);
    });
    // ログインしている場合は、DBのmoneyを更新する。
    // ログインしていない場合は、storageのHighScoreを更新する。
    if (this.config.userId) {
      updateMoney(
        this.config.userId,
        this.lobbyScene!.money
      );
      const { gameResult, winAmount } = resultObj;
      addResult(
        this.config.userId,
        this.config.game,
        gameResult,
        winAmount
      );
    } else {
      Table.setStorageHighScore(
        this.config.game,
        this.lobbyScene!.money
      );
    }
    this.clearPlayerHandsAndBets();
  }

  protected clearPlayerHandsAndBets(): void {
    this.players.forEach((player) => {
      player.clearHand();
      player.clearBet();
    });
  }

  protected static setStorageHighScore(
    highScoreKey: string,
    money: number
  ): void {
    const highScore = localStorage.getItem(highScoreKey);
    if (!highScore || money > Number(highScore)) {
      localStorage.setItem(highScoreKey, String(money));
    }
  }

  abstract payOut(
    result: string,
    playerIndex?: number
  ): Result;

  abstract playGameResultSound(result: string): void;

  // abstract deriveGameResult(): string | undefined;
}
