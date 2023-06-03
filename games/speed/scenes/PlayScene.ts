import Card from '@/games/common/Factories/cardImage';
import Deck from '@/games/common/Factories/deckImage';
import Table from '@/games/common/Factories/tableScene';
import GAME from '@/games/common/constants/game';
import STYLE from '@/games/common/constants/style';
import { Result } from '@/games/common/types/game';
import GamePhase from '../constants/gamePhase';
import GameResult from '../constants/gameResult';
import SpeedPlayer from '../models/SpeedPlayer';

import Text = Phaser.GameObjects.Text;
import Zone = Phaser.GameObjects.Zone;
import GameObject = Phaser.GameObjects.GameObject;
import TimeEvent = Phaser.Time.TimerEvent;

export default class PlayScene extends Table {
  #playerDecks: Deck[] = []; // player, house

  #deckSizeTexts: Text[] = []; // player, house

  #dropZones: Zone[] = []; // player, house

  #dropCardRanks: number[] = []; // player, house

  #timeEvent: TimeEvent | undefined;

  #housePlayTimeEvent: TimeEvent | undefined;

  #houseDealTimeEvent: TimeEvent | undefined;

  #countDownSound: Phaser.Sound.BaseSound | undefined;

  constructor(config: any) {
    super('PlayScene', GAME.TABLE.SPEED_TABLE_KEY, {
      ...config,
      canGoBack: true
    });
  }

  create(): void {
    super.create();
    this.gamePhase = GamePhase.BETTING;
    this.players = [
      new SpeedPlayer(
        'player',
        0,
        0,
        'bet',
        this.config.userName,
        0
      ),
      new SpeedPlayer('house', 0, 0, 'bet', 'House', 0)
    ];

    this.createPlayerNameTexts();
    this.createPlayerHandZones(
      GAME.CARD.WIDTH * 5 + STYLE.GUTTER_SIZE * 4,
      GAME.CARD.HEIGHT
    );

    this.createDeckSizeTexts();
    this.createDropZones();
    this.createDropZoneEvent();

    this.resetAndShuffleDeck();
    this.dealInitialCards();

    this.registerCountDownSound();

    this.startCountDown();
    this.startHousePlay(7000);
    this.startDealer();
  }

  update(): void {
    let result: GameResult | undefined;

    if (this.gamePhase === GamePhase.ACTING) {
      result = this.deriveGameResult();
    }

    if (
      this.gamePhase === GamePhase.END_OF_GAME &&
      result
    ) {
      this.time.delayedCall(2000, () => {
        this.#housePlayTimeEvent?.remove();
        this.#houseDealTimeEvent?.remove();
        this.endHand(result as GameResult);
      });
    }
  }

  private registerCountDownSound(): void {
    this.#countDownSound = this.scene.scene.sound.add(
      GAME.TABLE.COUNT_DOWN_SOUND_KEY,
      { volume: 0.3 }
    );
  }

  private startCountDown(): void {
    this.time.delayedCall(3000, () => {
      this.createTimerText();
      this.#countDownSound?.play();
      this.#timeEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.countDown(() => {
            this.gamePhase = GamePhase.ACTING;
            this.enableCardDraggable();
            if (this.#timeEvent) this.#timeEvent.remove();
          });
        },
        callbackScope: this,
        loop: true
      });
    });
  }

  private startHousePlay(delay: number): void {
    this.time.delayedCall(delay, () => {
      this.#housePlayTimeEvent = this.time.addEvent({
        delay: this.lobbyScene
          ? (3 - this.lobbyScene.level) * 1500
          : 4500,
        callback: this.playHouseTurn,
        callbackScope: this,
        loop: true
      });
    });
  }

  private startDealer(): void {
    this.time.delayedCall(7000, () => {
      this.#houseDealTimeEvent = this.time.addEvent({
        delay: 5000,
        callback: this.playHouse,
        callbackScope: this,
        loop: true
      });
    });
  }

  private createDropZones(): void {
    // NOTE: 前回のゲームで作成したものが残っている可能性があるので初期化する
    this.#dropZones = [];
    const xOffset = {
      player: GAME.CARD.WIDTH,
      house: -GAME.CARD.WIDTH
    };

    this.players.forEach((player) => {
      const dropZone = this.add
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

      Phaser.Display.Align.In.Center(
        dropZone,
        this.gameZone as GameObject,
        xOffset[player.playerType as 'player' | 'house']
      );

      this.#dropZones.push(dropZone);
    });
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
        if (!this.canDropCard(card, dropZone)) {
          card.returnToOrigin();
          return;
        }

        card.setPosition(dropZone.x, dropZone.y);
        card.disableInteractive();

        this.#dropZones.forEach(
          (dropCardZone: Zone, index: number) => {
            if (dropCardZone === dropZone) {
              this.#dropCardRanks[index] =
                card.getRankNumber('speed');
            }
          }
        );

        this.players.forEach((player, index) => {
          if (player.playerType === 'player') {
            player.removeCardFromHand(card);
            this.handOutCard(
              this.#playerDecks[index] as Deck,
              player as SpeedPlayer,
              card.input.dragStartX,
              this.playerHandZones[index].y,
              false
            );
          }
        });
      }
    );
  }

  private playHouseTurn(): void {
    if (!this.isPlayerStagnant(this.players[1])) {
      this.putDownCardFromHand();
    }
  }

  private playHouse(): void {
    if (!this.isGameStagnant()) return;

    this.#housePlayTimeEvent?.remove();
    this.dealLeadCards();
    this.startHousePlay(2000);
  }

  private disableCardDraggable(): void {
    this.players.forEach((player) => {
      if (player.playerType === 'player') {
        player.hand.forEach((card) =>
          card.disableInteractive()
        );
      }
    });
  }

  private enableCardDraggable(): void {
    this.players.forEach((player) => {
      if (player.playerType === 'player') {
        player.hand.forEach((card) =>
          card.setInteractive()
        );
      }
    });
  }

  protected resetAndShuffleDeck(): void {
    this.#playerDecks = [
      new Deck(
        this,
        this.playerHandZones[0].x +
          GAME.CARD.WIDTH * 2 +
          STYLE.GUTTER_SIZE * 2,
        this.playerHandZones[0].y,
        ['Hearts', 'Diamonds']
      ),
      new Deck(
        this,
        this.playerHandZones[1].x -
          GAME.CARD.WIDTH * 2 -
          STYLE.GUTTER_SIZE * 2,
        this.playerHandZones[1].y,
        ['Spades', 'Clubs']
      )
    ];

    this.#playerDecks.forEach((deck) => {
      deck.shuffle();
    });
  }

  private canDropCard(card: Card, dropZone: Zone): boolean {
    let canDropCard = false;

    this.#dropZones.forEach(
      (cardDropZone: Zone, index: number) => {
        if (dropZone === cardDropZone) {
          canDropCard =
            canDropCard ||
            PlayScene.isNextRank(
              this.#dropCardRanks[index],
              card.getRankNumber('speed')
            );
        }
      }
    );
    return canDropCard;
  }

  private static isNextRank(
    rankNum1: number,
    rankNum2: number
  ): boolean {
    const diff = Math.abs(rankNum1 - rankNum2);
    return diff === 1 || diff === 12;
  }

  private isGameStagnant(): boolean {
    let isGameStagnant = true;
    this.players.forEach((player) => {
      isGameStagnant =
        isGameStagnant && this.isPlayerStagnant(player);
    });
    return isGameStagnant;
  }

  /**
   * プレイヤーが台札に出せるカードを持っているかどうかを示す真偽値
   */
  private isPlayerStagnant(player: SpeedPlayer): boolean {
    let isPlayerContinuable = false;
    player.hand.forEach((card: Card) => {
      this.#dropZones.forEach((dropZone: Zone) => {
        isPlayerContinuable =
          isPlayerContinuable ||
          this.canDropCard(card, dropZone);
      });
    });
    return !isPlayerContinuable;
  }

  private createDeckSizeTexts(): void {
    // NOTE: 前回のゲームで作成したものが残っている可能性があるので初期化する
    this.#deckSizeTexts = [];

    this.players.forEach((player, index) => {
      const deckSizeText = this.add.text(
        0,
        200,
        '',
        STYLE.DECK_SIZE
      );

      if (player.playerType === 'player') {
        Phaser.Display.Align.In.BottomRight(
          deckSizeText,
          this.playerHandZones[index] as Zone,
          20,
          0
        );
      } else {
        Phaser.Display.Align.In.BottomLeft(
          deckSizeText,
          this.playerHandZones[index] as Zone,
          70,
          0
        );
      }

      this.#deckSizeTexts.push(deckSizeText);
    });
  }

  private setDeckSizeTexts(): void {
    this.#playerDecks.forEach((deck, index) => {
      if (!deck.isEmpty()) {
        this.#deckSizeTexts[index].setText(
          `${deck.getSize()} 枚`
        );
      } else {
        this.#deckSizeTexts[index].setText('');
      }
    });
  }

  private dealInitialCards() {
    this.dealLeadCards();
    this.dealInitialHandCards();
  }

  private dealInitialHandCards(): void {
    let count = 0;
    this.#timeEvent = this.time.addEvent({
      delay: 200,
      callback: () => {
        const xOffset = {
          player:
            -2 * (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE) +
            count * (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE),
          house:
            2 * (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE) -
            count * (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE)
        };

        this.players.forEach((player, index) => {
          this.handOutCard(
            this.#playerDecks[index] as Deck,
            player as SpeedPlayer,
            this.playerHandZones[index].x +
              xOffset[
                player.playerType as 'player' | 'house'
              ],
            this.playerHandZones[index].y,
            true
          );
        });
        count += 1;
      },
      callbackScope: this,
      repeat: 3
    });

    this.time.delayedCall(1500, () => {
      this.players.forEach((player) => {
        player.hand.forEach((card) => {
          card.playFlipOverTween();
        });
      });
      this.disableCardDraggable();
    });
  }

  public handOutCard(
    deck: Deck,
    player: SpeedPlayer,
    toX: number,
    toY: number,
    isFaceDown: boolean
  ): void {
    const card: Card | undefined = deck.drawOne();

    if (!card) return;

    if (!isFaceDown) {
      card.setFaceUp();
    }

    if (player.playerType === 'player') {
      card.setDraggable();
    }

    player.addCardToHand(card);

    this.children.bringToTop(card);
    card.playMoveTween(toX, toY);
    this.setDeckSizeTexts();
  }

  /**
   * 台札にカードを補充する関数。
   * 山札が空の場合は、手札から補充する。
   */
  private dealLeadCards(): void {
    this.players.forEach((player, index) => {
      let card: Card | undefined;
      if (this.#playerDecks[index].isEmpty()) {
        card = player.hand.pop();
      } else {
        card = this.#playerDecks[index].drawOne();
      }

      if (!card) return;

      this.#dropCardRanks[index] =
        card.getRankNumber('speed');
      this.children.bringToTop(card);
      card.playMoveTween(
        this.#dropZones[index].x,
        this.#dropZones[index].y
      );

      if (card.isFaceDown) {
        this.time.delayedCall(1500, () => {
          card?.playFlipOverTween();
        });
      }
    });

    this.setDeckSizeTexts();
  }

  private putDownCardFromHand(): void {
    const house: SpeedPlayer = this.players[1];
    const { card, dropZoneIndex } =
      this.getAvailableCardFromHand(house);

    if (!card) return;
    // NOTE: if (!dropZoneIndex) とすると、dropZoneIndex = 0の時もTrueとなってしまうので、if (dropZoneIndex === undefined)としている。
    if (dropZoneIndex === undefined) return;

    this.children.bringToTop(card);
    this.#dropCardRanks[dropZoneIndex] =
      card.getRankNumber('speed');
    card.playMoveTween(
      this.#dropZones[dropZoneIndex].x,
      this.#dropZones[dropZoneIndex].y
    );

    this.handOutCard(
      this.#playerDecks[1] as Deck,
      house as SpeedPlayer,
      card.x,
      card.y,
      false
    );
  }

  /**
   * 手札から台札に出すことができるカードと台札のインデックスを取得する
   * @param player プレイヤー
   * @returns カードと台札のインデックス
   */
  private getAvailableCardFromHand(player: SpeedPlayer): {
    card: Card | undefined;
    dropZoneIndex: number | undefined;
  } {
    for (let i = 0; i < player.hand.length; i += 1) {
      const card = player.hand[i];
      for (
        let dropZoneIndex = 0;
        dropZoneIndex < this.#dropCardRanks.length;
        dropZoneIndex += 1
      ) {
        if (
          PlayScene.isNextRank(
            card.getRankNumber('speed'),
            this.#dropCardRanks[dropZoneIndex]
          )
        ) {
          player.removeCardFromHand(card);
          return { card, dropZoneIndex };
        }
      }
    }
    return { card: undefined, dropZoneIndex: undefined };
  }

  private deriveGameResult(): GameResult | undefined {
    let result: GameResult | undefined;
    const player = this.players[0];
    const playerHandScore = player.getHandScore();
    const house = this.players[1];
    const houseHandScore = house.getHandScore();

    if (playerHandScore === 0 && houseHandScore === 0) {
      result = GameResult.TIE;
      this.gamePhase = GamePhase.END_OF_GAME;
      return result;
    }

    if (playerHandScore === 0) {
      result = GameResult.WIN;
      this.gamePhase = GamePhase.END_OF_GAME;
      return result;
    }

    if (houseHandScore === 0) {
      result = GameResult.LOSS;
      this.gamePhase = GamePhase.END_OF_GAME;
      return result;
    }

    result = undefined; // still playing
    this.gamePhase = GamePhase.ACTING;
    return result;
  }

  public payOut(result: GameResult): Result {
    if (!this.lobbyScene?.money) {
      return {
        gameResult: result,
        winAmount: 0
      };
    }

    const winAmount = {
      [GameResult.WIN]: this.lobbyScene.bet,
      [GameResult.LOSS]: -this.lobbyScene.bet,
      [GameResult.TIE]: 0
    };

    this.lobbyScene.money += winAmount[result];
    this.setMoneyText(this.lobbyScene.money);
    this.setBetText(this.lobbyScene.bet);

    return {
      gameResult: result,
      winAmount: winAmount[result]
    };
  }

  public playGameResultSound(result: string): void {
    if (result === GameResult.WIN) {
      this.winGameSound?.play();
    } else {
      this.lossGameSound?.play();
    }
  }
}
