/* eslint no-param-reassign: ["error", { "props": false }] */

import Card from '../../common/Factories/cardImage';
import GAME from '../../common/constants/game';
import STYLE from '../../common/constants/style';
import GameResult from '../constants/gameResult';
import BlackDeck from '../models/blackDeck';
import SpeedPlayer from '../models/player';
import RedDeck from '../models/redDeck';

import Table from '../../common/Factories/tableScene';

import Text = Phaser.GameObjects.Text;
import Zone = Phaser.GameObjects.Zone;
import GameObject = Phaser.GameObjects.GameObject;
import TimeEvent = Phaser.Time.TimerEvent;

const GAME_PHASE = {
  BETTING: 'betting',
  PLAYING: 'playing',
  GAME_END: 'game_end'
};

export default class PlayScene extends Table {
  private redDeck: RedDeck | undefined;

  private blackDeck: BlackDeck | undefined;

  private playerDeckSizeText: Text | undefined;

  private aiDeckSizeText: Text | undefined;

  private rightDropZone: Zone | undefined;

  private leftDropZone: Zone | undefined;

  private rightDropCardRank = 0;

  private leftDropCardRank = 0;

  private timeEvent: TimeEvent | undefined;

  private aiTimeEvent: TimeEvent | undefined;

  private houseTimeEvent: TimeEvent | undefined;

  constructor(config: any) {
    super('PlayScene', config);
  }

  create(): void {
    super.create();

    // TODO: 必要かどうか要検討
    this.gamePhase = GAME_PHASE.BETTING;

    this.createAiNameText();
    this.createPlayerNameText();

    this.createPlayerHandZone();
    this.createAiHandZone();

    this.createAiDeckSizeText();
    this.createPlayerDeckSizeText();

    this.createLeftDropZone();
    this.createRightDropZone();
    this.createDropZoneEvent();

    this.setUpNewGame();

    this.dealInitialCards();

    // ゲームのカウントダウン
    this.time.delayedCall(3000, () => {
      this.createTimerText();
      this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.countDown(() => {
            this.enableCardDraggable();
            if (this.timeEvent) this.timeEvent.remove();
            this.gamePhase = GAME_PHASE.PLAYING;
          });
        },
        callbackScope: this,
        loop: true
      });
    });

    // AIの始動
    this.time.delayedCall(7000, () => {
      this.aiTimeEvent = this.time.addEvent({
        delay: 2000,
        callback: this.playAiTurn,
        callbackScope: this,
        loop: true
      });
    });

    // Houseの始動（ゲーム停滞時のカード配布）
    this.time.delayedCall(7000, () => {
      this.houseTimeEvent = this.time.addEvent({
        delay: 5000,
        callback: this.playHouse,
        callbackScope: this,
        loop: true
      });
    });
  }

  update(): void {
    const result = this.deriveGameResult();

    if (this.gamePhase === GAME_PHASE.PLAYING && result) {
      this.endHand(result);
    }
  }

  private createLeftDropZone(): void {
    this.leftDropZone = this.add
      .zone(
        0,
        0,
        GAME.CARD.WIDTH * 1.5,
        GAME.CARD.HEIGHT * 1.5
      )
      .setRectangleDropZone(
        GAME.CARD.WIDTH,
        GAME.CARD.HEIGHT
      );
    this.alignCardDropZone(
      this.leftDropZone,
      -GAME.CARD.WIDTH
    );
  }

  private createRightDropZone(): void {
    this.rightDropZone = this.add
      .zone(
        0,
        0,
        GAME.CARD.WIDTH * 1.5,
        GAME.CARD.HEIGHT * 1.5
      )
      .setRectangleDropZone(
        GAME.CARD.WIDTH,
        GAME.CARD.HEIGHT
      );
    this.alignCardDropZone(
      this.rightDropZone,
      GAME.CARD.WIDTH
    );
  }

  private playAiTurn(): void {
    if (!this.isAiStagnant()) {
      this.putDownCardFromHand();
    }
  }

  private playHouse(): void {
    if (this.isGameStagnant()) {
      this.dealLeadCards();
    }
  }

  private disableCardDraggable(): void {
    this.player?.hand.forEach((card) =>
      card.disableInteractive()
    );
  }

  private enableCardDraggable(): void {
    this.player?.hand.forEach((card) =>
      card.setInteractive()
    );
  }

  private setUpNewGame() {
    if (this.playerHandZone) {
      this.redDeck = new RedDeck(
        this,
        this.playerHandZone.x + GAME.CARD.WIDTH * 2,
        this.playerHandZone.y
      );
      this.redDeck.shuffle();
    }

    if (this.aiHandZone) {
      this.blackDeck = new BlackDeck(
        this,
        this.aiHandZone.x - GAME.CARD.WIDTH * 2,
        this.aiHandZone.y
      );
      this.blackDeck.shuffle();
    }
  }

  private alignCardDropZone(
    dropCardZone: Zone,
    xOffset: number
  ): void {
    Phaser.Display.Align.In.Center(
      dropCardZone,
      this.gameZone as GameObject,
      xOffset,
      -20
    );
  }

  private createDropZoneEvent(): void {
    this.createCardDragStartEvent();
    this.createCardDragEvent();
    this.createCardDropEvent();
    this.createCardDragEndEvent();
  }

  private createCardDropEvent(): void {
    this.input.on(
      'drop',
      (
        pointer: Phaser.Input.Pointer,
        card: Card,
        dropZone: Zone
      ) => {
        if (this.canDropCard(dropZone, card)) {
          card.setPosition(dropZone.x, dropZone.y);
          card.disableInteractive();

          if (dropZone === this.rightDropZone) {
            this.rightDropCardRank =
              card.getRankNumber('speed');
          } else {
            this.leftDropCardRank =
              card.getRankNumber('speed');
          }

          if (this.player)
            this.player.removeCardFromHand(card);
          if (this.playerHandZone) {
            this.handOutCard(
              this.redDeck as RedDeck,
              this.player as SpeedPlayer,
              card.input.dragStartX,
              this.playerHandZone.y,
              false
            );
          }
        } else {
          card.returnToOrigin();
        }
      }
    );
  }

  private canDropCard(dropZone: Zone, card: Card): boolean {
    return (
      (dropZone === this.rightDropZone &&
        PlayScene.isNextRank(
          this.rightDropCardRank,
          card.getRankNumber('speed')
        )) ||
      (dropZone === this.leftDropZone &&
        PlayScene.isNextRank(
          this.leftDropCardRank,
          card.getRankNumber('speed')
        ))
    );
  }

  private static isNextRank(
    rankNum1: number,
    rankNum2: number
  ): boolean {
    const diff = Math.abs(rankNum1 - rankNum2);
    return diff === 1 || diff === 12;
  }

  private isGameStagnant(): boolean {
    return this.isPlayerStagnant() && this.isAiStagnant();
  }

  private isPlayerStagnant(): boolean {
    let isPlayerContinuable = false;
    this.player?.hand.forEach((card) => {
      isPlayerContinuable =
        isPlayerContinuable ||
        this.canDropCard(this.rightDropZone as Zone, card);
      isPlayerContinuable =
        isPlayerContinuable ||
        this.canDropCard(this.leftDropZone as Zone, card);
    });
    return !isPlayerContinuable;
  }

  private isAiStagnant(): boolean {
    let isAiContinuable = false;
    this.ai?.hand.forEach((card) => {
      isAiContinuable =
        isAiContinuable ||
        this.canDropCard(this.rightDropZone as Zone, card);
      isAiContinuable =
        isAiContinuable ||
        this.canDropCard(this.leftDropZone as Zone, card);
    });
    return !isAiContinuable;
  }

  private createAiDeckSizeText(): void {
    this.aiDeckSizeText = this.add.text(
      0,
      200,
      '',
      STYLE.DECK_SIZE
    );

    Phaser.Display.Align.In.BottomLeft(
      this.aiDeckSizeText,
      this.aiHandZone as Zone,
      70,
      0
    );
  }

  private setAiDeckSizeText(): void {
    if (!this.blackDeck?.isEmpty()) {
      this.aiDeckSizeText?.setText(
        `${this.blackDeck?.getSize()} 枚`
      );
    } else {
      this.aiDeckSizeText?.setText('');
    }
  }

  private createPlayerDeckSizeText(): void {
    this.playerDeckSizeText = this.add.text(
      0,
      300,
      '',
      STYLE.DECK_SIZE
    );

    Phaser.Display.Align.In.BottomRight(
      this.playerDeckSizeText,
      this.playerHandZone as Zone,
      20,
      0
    );
  }

  private setPlayerDeckSizeText(): void {
    if (!this.redDeck?.isEmpty()) {
      this.playerDeckSizeText?.setText(
        `${this.redDeck?.getSize()} 枚`
      );
    } else {
      this.playerDeckSizeText?.setText('');
    }
  }

  // ゲーム開始時にカードを配る関数
  private dealInitialCards() {
    // 中央の台札をセットする
    this.dealLeadCards();

    if (this.player && this.ai) {
      let i = 0;
      this.timeEvent = this.time.addEvent({
        delay: 200,
        callback: () => {
          if (i >= 3 && this.timeEvent)
            this.timeEvent.remove();

          if (this.playerHandZone) {
            this.handOutCard(
              this.redDeck as RedDeck,
              this.player as SpeedPlayer,
              this.playerHandZone.x -
                GAME.CARD.WIDTH * 2 +
                i * GAME.CARD.WIDTH,
              this.playerHandZone.y,
              true
            );
          }
          if (this.aiHandZone) {
            this.handOutCard(
              this.blackDeck as BlackDeck,
              this.ai as SpeedPlayer,
              this.aiHandZone.x +
                GAME.CARD.WIDTH * 2 -
                i * GAME.CARD.WIDTH,
              this.aiHandZone.y,
              true
            );
          }
          i += 1;
        },
        callbackScope: this,
        loop: true
      });

      // カードを裏返す
      this.time.delayedCall(1500, () => {
        this.player?.hand.forEach((card) => {
          card.playFlipOverTween();
        });
        this.ai?.hand.forEach((card) =>
          card.playFlipOverTween()
        );
        this.disableCardDraggable();
      });
    }
  }

  private handOutCard(
    deck: RedDeck | BlackDeck,
    player: SpeedPlayer,
    toX: number,
    toY: number,
    isFaceDown: boolean
  ) {
    const card: Card | undefined = deck.drawOne();

    if (card) {
      if (!isFaceDown) {
        card.setFaceUp();
      }
      if (player.playerType === 'player') {
        card.setDraggable();
      }
      player.addCardToHand(card);

      this.children.bringToTop(card);
      card.playMoveTween(toX, toY);
    } else {
      return;
    }

    this.setAiDeckSizeText();
    this.setPlayerDeckSizeText();
  }

  // 山札から台札にカードを裏向きに配って、裏返す
  // 山札がない場合は、手札から出す
  private dealLeadCards(): void {
    if (this.leftDropZone) {
      if (!this.blackDeck?.isEmpty()) {
        this.handOutLeadCardFromDeck(
          this.blackDeck as BlackDeck,
          this.leftDropZone.x,
          this.leftDropZone.y
        );
      } else {
        this.handOutLeadCardFromHand(
          this.ai as SpeedPlayer,
          this.leftDropZone.x,
          this.leftDropZone.y
        );
      }
    }

    if (this.rightDropZone) {
      if (!this.redDeck?.isEmpty()) {
        this.handOutLeadCardFromDeck(
          this.redDeck as RedDeck,
          this.rightDropZone.x,
          this.rightDropZone.y
        );
      } else {
        this.handOutLeadCardFromHand(
          this.player as SpeedPlayer,
          this.rightDropZone.x,
          this.rightDropZone.y
        );
      }
    }

    this.setAiDeckSizeText();
    this.setPlayerDeckSizeText();
  }

  private handOutLeadCardFromDeck(
    deck: RedDeck | BlackDeck,
    toX: number,
    toY: number
  ): void {
    const card: Card | undefined = deck.drawOne();

    if (card) {
      if (deck.constructor === RedDeck) {
        this.rightDropCardRank =
          card.getRankNumber('speed');
      } else {
        this.leftDropCardRank = card.getRankNumber('speed');
      }
      this.children.bringToTop(card);
      card.playMoveTween(toX, toY);
      this.time.delayedCall(1500, () => {
        card.playFlipOverTween();
      });
    }
  }

  private handOutLeadCardFromHand(
    player: SpeedPlayer,
    toX: number,
    toY: number
  ): void {
    const card = player.hand[0];
    if (card) {
      if (player.playerType === 'player') {
        this.rightDropCardRank =
          card.getRankNumber('speed');
      } else {
        this.leftDropCardRank = card.getRankNumber('speed');
      }
      player.removeCardFromHand(card);
      this.children.bringToTop(card);
      card.playMoveTween(toX, toY);
    }
  }

  private putDownCardFromHand(): void {
    const [card, dropZone] =
      this.getAvailableCardFromHand();
    if (card) {
      this.children.bringToTop(card);
      if (
        dropZone === this.rightDropZone &&
        this.rightDropZone
      ) {
        this.rightDropCardRank =
          card.getRankNumber('speed');
        card.playMoveTween(
          this.rightDropZone.x,
          this.rightDropZone.y
        );
      } else if (
        dropZone === this.leftDropZone &&
        this.leftDropZone
      ) {
        this.leftDropCardRank = card.getRankNumber('speed');
        card.playMoveTween(
          this.leftDropZone.x,
          this.leftDropZone.y
        );
      } else {
        return;
      }

      this.handOutCard(
        this.blackDeck as BlackDeck,
        this.ai as SpeedPlayer,
        card.x,
        card.y,
        false
      );
    }
  }

  private getAvailableCardFromHand(): [
    Card | undefined,
    Zone | undefined
  ] {
    let result: [Card | undefined, Zone | undefined] = [
      undefined,
      undefined
    ];

    this.ai?.hand.forEach((card) => {
      if (
        this.ai &&
        PlayScene.isNextRank(
          card.getRankNumber('speed'),
          this.leftDropCardRank
        )
      ) {
        this.ai.removeCardFromHand(card);
        result = [card, this.leftDropZone];
      }
      if (
        this.ai &&
        PlayScene.isNextRank(
          card.getRankNumber('speed'),
          this.rightDropCardRank
        )
      ) {
        this.ai.removeCardFromHand(card);
        result = [card, this.rightDropZone];
      }
    });
    return result;
  }

  deriveGameResult(): string | undefined {
    let result;
    if (
      this.player &&
      this.player.getHandScore() === 0 &&
      this.ai &&
      this.ai.getHandScore() === 0
    ) {
      result = GameResult.DRAW;
    } else if (
      this.player &&
      this.player.getHandScore() === 0
    ) {
      result = GameResult.WIN;
    } else if (this.ai && this.ai.getHandScore() === 0) {
      result = GameResult.LOSS;
    } else {
      result = undefined; // まだゲームが終わっていない
    }
    return result;
  }

  payOut(result: string): void {
    if (this.betScene && this.betScene.money) {
      if (result === GameResult.WIN) {
        this.betScene.money += this.betScene.bet * 2;
      } else if (result === GameResult.LOSS) {
        this.betScene.money -= this.betScene.bet;
      }
      this.setMoneyText(this.betScene.money);

      const highScore = localStorage.getItem(
        GAME.STORAGE.SPEED_HIGH_SCORE_STORAGE
      );
      if (
        !highScore ||
        this.betScene.money > Number(highScore)
      ) {
        localStorage.setItem(
          GAME.STORAGE.SPEED_HIGH_SCORE_STORAGE,
          String(this.betScene.money)
        );
      }
    }
  }
}
