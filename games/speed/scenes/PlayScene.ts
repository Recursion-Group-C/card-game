/* eslint no-param-reassign: ["error", { "props": false }] */
import Card from '../../common/Factories/cardImage';
import Deck from '../../common/Factories/deckImage';
import GAME from '../../common/constants/game';
import STYLE from '../../common/constants/style';
import GamePhase from '../constants/gamePhase';
import GameResult from '../constants/gameResult';
import SpeedPlayer from '../models/SpeedPlayer';

import Table from '../../common/Factories/tableScene';

import Text = Phaser.GameObjects.Text;
import Zone = Phaser.GameObjects.Zone;
import GameObject = Phaser.GameObjects.GameObject;
import TimeEvent = Phaser.Time.TimerEvent;

export default class PlayScene extends Table {
  // TODO: private->#に変更する
  private playerDecks: Array<Deck> = []; // player, house

  private deckSizeTexts: Array<Text> = []; // player, house

  private dropZones: Array<Zone> = []; // player, house

  private dropCardRanks: Array<number> = []; // player, house

  private timeEvent: TimeEvent | undefined;

  private housePlayTimeEvent: TimeEvent | undefined;

  private houseDealTimeEvent: TimeEvent | undefined;

  #countDownSound: Phaser.Sound.BaseSound | undefined;

  constructor(config: any) {
    super('PlayScene', GAME.TABLE.SPEED_TABLE_KEY, config);
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

    this.#countDownSound = this.scene.scene.sound.add(
      GAME.TABLE.COUNT_DOWN_SOUND_KEY,
      { volume: 0.3 }
    );

    // ゲームのカウントダウン
    this.time.delayedCall(3000, () => {
      this.createTimerText();
      if (this.#countDownSound) this.#countDownSound.play();
      this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.countDown(() => {
            this.gamePhase = GamePhase.ACTING;
            this.enableCardDraggable();
            if (this.timeEvent) this.timeEvent.remove();
          });
        },
        callbackScope: this,
        loop: true
      });
    });

    // AIの始動
    this.time.delayedCall(7000, () => {
      this.housePlayTimeEvent = this.time.addEvent({
        delay: this.betScene
          ? (3 - this.betScene.level) * 1500
          : 4500,
        callback: this.playHouseTurn,
        callbackScope: this,
        loop: true
      });
    });

    // Houseの始動（ゲーム停滞時のカード配布）
    this.time.delayedCall(7000, () => {
      this.houseDealTimeEvent = this.time.addEvent({
        delay: 5000,
        callback: this.playHouse,
        callbackScope: this,
        loop: true
      });
    });
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
        this.housePlayTimeEvent?.remove();
        this.houseDealTimeEvent?.remove();
        this.endHand(result as GameResult);
      });
    }
  }

  private createDropZones(): void {
    this.dropZones = []; // 前回のゲームで作成したものが残っている可能性があるので、初期化する
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

      if (player.playerType === 'player') {
        Phaser.Display.Align.In.Center(
          dropZone,
          this.gameZone as GameObject,
          GAME.CARD.WIDTH
        );
      } else if (player.playerType === 'house') {
        Phaser.Display.Align.In.Center(
          dropZone,
          this.gameZone as GameObject,
          -GAME.CARD.WIDTH
        );
      }

      this.dropZones.push(dropZone);
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
        if (this.canDropCard(card, dropZone)) {
          card.setPosition(dropZone.x, dropZone.y);
          card.disableInteractive();

          this.dropZones.forEach(
            (dropCardZone: Zone, index: number) => {
              if (dropCardZone === dropZone) {
                this.dropCardRanks[index] =
                  card.getRankNumber('speed');
              }
            }
          );

          this.players.forEach((player, index) => {
            if (player.playerType === 'player') {
              player.removeCardFromHand(card);
              this.handOutCard(
                this.playerDecks[index] as Deck,
                player as SpeedPlayer,
                card.input.dragStartX,
                this.playerHandZones[index].y,
                false
              );
            }
          });
        } else {
          card.returnToOrigin();
        }
      }
    );
  }

  private playHouseTurn(): void {
    if (!this.isPlayerStagnant(this.players[1])) {
      this.putDownCardFromHand();
    }
  }

  private playHouse(): void {
    if (this.isGameStagnant()) {
      // HouseのPlayを一時停止する
      this.housePlayTimeEvent?.remove();
      this.dealLeadCards();
      // HouseのPlayを再開する
      this.time.delayedCall(2000, () => {
        this.housePlayTimeEvent = this.time.addEvent({
          delay: this.betScene
            ? (3 - this.betScene.level) * 1500
            : 4500,
          callback: this.playHouseTurn,
          callbackScope: this,
          loop: true
        });
      });
    }
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

  resetAndShuffleDeck(): void {
    this.playerDecks = [
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

    this.playerDecks.forEach((deck) => {
      deck.shuffle();
    });
  }

  private canDropCard(card: Card, dropZone: Zone): boolean {
    let canDropCard = false;

    this.dropZones.forEach(
      (cardDropZone: Zone, index: number) => {
        if (dropZone === cardDropZone) {
          canDropCard =
            canDropCard ||
            PlayScene.isNextRank(
              this.dropCardRanks[index],
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

  private isPlayerStagnant(player: SpeedPlayer): boolean {
    let isPlayerContinuable = false;
    player.hand.forEach((card: Card) => {
      this.dropZones.forEach((dropZone: Zone) => {
        isPlayerContinuable =
          isPlayerContinuable ||
          this.canDropCard(card, dropZone);
      });
    });
    return !isPlayerContinuable;
  }

  private createDeckSizeTexts(): void {
    this.deckSizeTexts = []; // 前回のゲームで作成したものが残っている可能性があるので、初期化する
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
      } else if (player.playerType === 'house') {
        Phaser.Display.Align.In.BottomLeft(
          deckSizeText,
          this.playerHandZones[index] as Zone,
          70,
          0
        );
      }
      this.deckSizeTexts.push(deckSizeText);
    });
  }

  private setDeckSizeTexts(): void {
    this.playerDecks.forEach((deck, index) => {
      if (!deck.isEmpty()) {
        this.deckSizeTexts[index].setText(
          `${deck.getSize()} 枚`
        );
      } else {
        this.deckSizeTexts[index].setText('');
      }
    });
  }

  private dealInitialCards() {
    // 中央の台札をセットする
    this.dealLeadCards();

    let i = 0;
    this.timeEvent = this.time.addEvent({
      delay: 200,
      callback: () => {
        this.players.forEach((player, index) => {
          if (player.playerType === 'player') {
            this.handOutCard(
              this.playerDecks[index] as Deck,
              player as SpeedPlayer,
              this.playerHandZones[index].x -
                (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE) * 2 +
                i * (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE),
              this.playerHandZones[index].y,
              true
            );
          } else if (player.playerType === 'house') {
            this.handOutCard(
              this.playerDecks[index] as Deck,
              player as SpeedPlayer,
              this.playerHandZones[index].x +
                (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE) * 2 -
                i * (GAME.CARD.WIDTH + STYLE.GUTTER_SIZE),
              this.playerHandZones[index].y,
              true
            );
          }
        });
        i += 1;
      },
      callbackScope: this,
      repeat: 3
    });

    // カードを裏返す
    this.time.delayedCall(1500, () => {
      this.players.forEach((player) => {
        player.hand.forEach((card) => {
          card.playFlipOverTween();
        });
      });
      this.disableCardDraggable();
    });
  }

  handOutCard(
    deck: Deck,
    player: SpeedPlayer,
    toX: number,
    toY: number,
    isFaceDown: boolean
  ): void {
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

    this.setDeckSizeTexts();
  }

  // 山札から台札にカードを裏向きに配って、裏返す
  // 山札がない場合は、手札から出す
  private dealLeadCards(): void {
    this.players.forEach((player, index) => {
      let card: Card | undefined;
      if (!this.playerDecks[index].isEmpty()) {
        card = this.playerDecks[index].drawOne();
      } else {
        card = player.hand.pop();
      }

      if (card) {
        this.dropCardRanks[index] =
          card.getRankNumber('speed');
        this.children.bringToTop(card);
        card.playMoveTween(
          this.dropZones[index].x,
          this.dropZones[index].y
        );

        if (card.isFaceDown) {
          this.time.delayedCall(1500, () => {
            card!.playFlipOverTween();
          });
        }
      }
    });

    this.setDeckSizeTexts();
  }

  private putDownCardFromHand(): void {
    const house: SpeedPlayer = this.players[1];
    const [card, dropZoneIndex] =
      this.getAvailableCardFromHand(house);

    if (card && dropZoneIndex !== undefined) {
      this.children.bringToTop(card);
      this.dropCardRanks[dropZoneIndex] =
        card.getRankNumber('speed');
      card.playMoveTween(
        this.dropZones[dropZoneIndex].x,
        this.dropZones[dropZoneIndex].y
      );

      this.handOutCard(
        this.playerDecks[1] as Deck,
        house as SpeedPlayer,
        card.x,
        card.y,
        false
      );
    }
  }

  private getAvailableCardFromHand(
    player: SpeedPlayer
  ): [Card | undefined, number | undefined] {
    for (let i = 0; i < player.hand.length; i += 1) {
      const currCard = player.hand[i];
      for (
        let dropZoneIndex = 0;
        dropZoneIndex < this.dropCardRanks.length;
        dropZoneIndex += 1
      ) {
        if (
          PlayScene.isNextRank(
            currCard.getRankNumber('speed'),
            this.dropCardRanks[dropZoneIndex]
          )
        ) {
          player.removeCardFromHand(currCard);
          return [currCard, dropZoneIndex];
        }
      }
    }
    return [undefined, undefined];
  }

  deriveGameResult(): GameResult | undefined {
    let result: GameResult | undefined;
    const player = this.players[0];
    const playerHandScore = player.getHandScore();
    const house = this.players[1];
    const houseHandScore = house.getHandScore();

    if (playerHandScore === 0 && houseHandScore === 0) {
      result = GameResult.TIE;
      this.gamePhase = GamePhase.END_OF_GAME;
    } else if (playerHandScore === 0) {
      result = GameResult.WIN;
      this.gamePhase = GamePhase.END_OF_GAME;
    } else if (houseHandScore === 0) {
      result = GameResult.LOSS;
      this.gamePhase = GamePhase.END_OF_GAME;
    } else {
      result = undefined; // まだゲームが終わっていない
      this.gamePhase = GamePhase.ACTING;
    }
    return result;
  }

  payOut(result: GameResult): number {
    let winAmount = 0;
    if (this.betScene && this.betScene.money) {
      if (result === GameResult.WIN) {
        winAmount = this.betScene.bet;
      } else if (result === GameResult.LOSS) {
        winAmount = -this.betScene.bet;
      }
      this.betScene.money += winAmount;
      this.setMoneyText(this.betScene.money);
      this.setBetText(this.betScene.bet);
    }
    return winAmount;
  }

  playGameResultSound(result: string): void {
    if (result === GameResult.WIN) {
      this.winGameSound?.play();
    } else {
      this.lossGameSound?.play();
    }
  }
}
