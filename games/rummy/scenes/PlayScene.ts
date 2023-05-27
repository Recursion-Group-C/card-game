import { Result } from '@/games/common/types/game';
import Card from '../../common/Factories/cardImage';
import Deck from '../../common/Factories/deckImage';
import GAME from '../../common/constants/game';
import STYLE from '../../common/constants/style';
import GamePhase from '../constants/gamePhase';
import GameResult from '../constants/gameResult';
import RummyPlayer from '../models/rummyPlayer';

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

  private meldZone: Zone | undefined;

  private meldZoneEach: Zone[] = [];

  private meldZoneEachCounter = 0; // 新しいcardが追加されたら、増える。

  private frontDeckZone: Zone | undefined;

  private backDeckZone: Zone | undefined;

  private isPlayerTurn = false; // 初期状態ではハウスのターンとします

  private houseFlag = false;

  private playerFlag = false;

  private deckBack: Deck[] = [];

  private deckFront: Card[] = [];

  private meldZoneSameRank: Card[][] = [[], []];

  private meldZoneConsecutiveRanks: Card[][] = [[], []];

  private arrayCardsPutOnMeldZone: Card[][] = [];

  private meldZoneContainer!: Phaser.GameObjects.Container;

  private turnText: Text | undefined;

  private deckBackCardX = 850;

  private deckBackCardY = 550;

  private deckFrontCardX = 1050;

  private deckFrontCardY = 550;

  constructor(config: any) {
    super('PlayScene', GAME.TABLE.RUMMY_TABLE_KEY, config);
  }

  create(): void {
    super.create();
    this.gamePhase = GamePhase.BETTING;
    this.players = [
      new RummyPlayer(
        'player',
        0,
        0,
        'bet',
        this.config.userName,
        0
      ),
      new RummyPlayer('house', 0, 0, 'bet', 'House', 0)
    ];

    this.createPlayerNameTexts();
    this.createPlayerHandZones(
      GAME.CARD.WIDTH * 5 + STYLE.GUTTER_SIZE * 4,
      GAME.CARD.HEIGHT
    );
    this.createMeldZone(); // meldzone

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

    this.createDeck();
    this.createDropZones(this.deckFront); // frontDeckZone
    this.descriptionFromDeckToHandOfPlayerAndHouse();

    // start

    this.startGame();
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

  private createMeldZone() {
    const screenWidth = this.cameras.main.width; // 画面の幅を取得
    const screenHeight = this.cameras.main.height; // 画面の高さを取得
    const zoneWidth = screenWidth; // ゾーンの幅を画面の幅と同じに設定
    const zoneHeight = 190; // ゾーンの高さを指定（例えば190）
    const zoneY = screenHeight / 2 - zoneHeight / 2 - 100; // ゾーンのY座標を真ん中より少し上に設定

    // ゾーンの可視化用のグラフィックスオブジェクトを作成
    const graphics = this.add.graphics();

    // ゾーンの位置とサイズを表す長方形を描画
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(0, zoneY, zoneWidth, zoneHeight);

    this.meldZone = this.add
      .zone(0, zoneY, zoneWidth, zoneHeight)
      .setInteractive();

    for (let i = 0; i < 13; i += 1) {
      const meldZoneAt = this.add
        .zone(
          GAME.CARD.WIDTH * i,
          zoneY,
          GAME.CARD.WIDTH,
          GAME.CARD.HEIGHT
        )
        .setInteractive();
      // 可視化
      // ゾーンの可視化用のグラフィックスオブジェクトを作成
      const graphics1 = this.add.graphics();

      // ゾーンの位置とサイズを表す長方形を描画
      graphics1.lineStyle(2, 0xffff);
      graphics1.strokeRect(
        GAME.CARD.WIDTH * i,
        zoneY,
        GAME.CARD.WIDTH,
        GAME.CARD.HEIGHT
      );
      this.add.existing(graphics1);

      // 配列に追加
      this.meldZoneEach?.push(meldZoneAt);
    }

    const meldNameText = this.add.text(
      screenWidth / 2,
      zoneY + zoneHeight / 2,
      'MeldZone!!',
      { fontSize: '100px' }
    );

    meldNameText.setOrigin(0.5); // テキストの原点を中央に設定

    Phaser.Display.Align.In.Center(
      this.meldZone,
      meldNameText as Phaser.GameObjects.Text,
      0,
      STYLE.GUTTER_SIZE
    );

    this.meldZoneContainer = this.add.container(0, zoneY);
  }

  private createDropZones(card: Card[]) {
    const curr = card[0];
    const zoneX = curr.x;
    const zoneY = curr.y;
    this.frontDeckZone = this.add.zone(
      zoneX + 127,
      zoneY - 95,
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );

    this.backDeckZone = this.add.zone(
      this.deckBackCardX - GAME.CARD.WIDTH / 2,
      this.deckBackCardY - GAME.CARD.HEIGHT / 2,
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );

    // ゾーンの可視化用のグラフィックスオブジェクトを作成
    const graphics = this.add.graphics();
    const graphics2 = this.add.graphics();

    // ゾーンの位置とサイズを表す長方形を描画
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(
      zoneX + 127,
      zoneY - 95,
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );
    this.add.existing(graphics);
    this.frontDeckZone.setInteractive();
    this.frontDeckZone.on('pointerdown', () => {
      console.log('Zone clicked!');
    });

    graphics2.lineStyle(2, 0xff0000);
    graphics2.strokeRect(
      this.deckBackCardX - GAME.CARD.WIDTH / 2,
      this.deckBackCardY - GAME.CARD.HEIGHT / 2,
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );
    this.add.existing(graphics2);
    this.backDeckZone.setInteractive();
    this.backDeckZone.on('pointerdown', () => {
      console.log('Zone2 clicked!');
    });
  }

  private createDeck() {
    this.deckBack = [
      new Deck(
        this,
        this.deckBackCardX,
        this.deckBackCardY,
        ['Hearts', 'Diamonds', 'Spades', 'Clubs']
      )
    ];
    this.deckBack?.forEach((deck) => {
      deck.shuffle();
      console.log(deck);
      const curr = deck.drawOne();
      console.log(deck);
      if (curr) this.deckFront.push(curr);
      this.deckFront.forEach((card) => {
        card.playMoveTween(
          this.deckFrontCardX,
          this.deckFrontCardY
        );
        card.playFlipOverTween();
      });
    });
  }

  private descriptionFromDeckToHandOfPlayerAndHouse() {
    this.players.forEach((player, index) => {
      this.deckBack?.forEach((deck) => {
        if (player.playerType === 'player') {
          this.createHands(deck, index, player);
        } else {
          this.createHands(deck, index, player);
        }
      });
    });
  }

  // game starting
  private async startGame() {
    await this.delay(4000);
    if (
      this.players[0].hand.length < 1 ||
      this.players[1].hand.length < 1
    ) {
      console.log('ゲーム終了');
      await this.showTurnLog();
    }

    if (this.isPlayerTurn) {
      console.log('player Turn !!!');
      console.log(this.arrayCardsPutOnMeldZone);
      await this.showTurnLog();

      await this.playerTurn().then(() => {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.startGame();
      });
    } else {
      console.log('house Turn !!!');
      console.log(this.arrayCardsPutOnMeldZone);
      await this.showTurnLog();

      await this.houseTurn().then(() => {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.startGame();
      });
    }
  }

  // 手札作成関数
  private createHands(
    deck: Deck,
    index: number,
    player: RummyPlayer
  ) {
    if (player.playerType === 'player') {
      console.log(index);
      for (let i = 0; i < 10; i += 1) {
        const currCard = deck.drawOne();
        if (currCard) {
          player.addCardToHand(currCard);
          currCard.playMoveTween(
            this.playerHandZones[index].x -
              (GAME.CARD.WIDTH + 10) * 2 +
              i * (GAME.CARD.WIDTH + 10) -
              350,
            this.playerHandZones[index].y + 50
          );
          currCard.playFlipOverTween();
        }
      }
    } else {
      console.log(index);
      for (let i = 0; i < 10; i += 1) {
        const currCard = deck.drawOne();
        if (currCard) {
          player.addCardToHand(currCard);
          currCard.playMoveTween(
            this.playerHandZones[index].x -
              (GAME.CARD.WIDTH + 10) * 2 +
              i * (GAME.CARD.WIDTH + 10) -
              350,
            this.playerHandZones[index].y - 50
          );
        }
      }
    }
  }

  // TODO: playerTurn と houseTurnの間隔を合わせる
  private async showTurnLog() {
    if (this.turnText) this.turnText.destroy();
    if (
      this.players[0].hand.length <= 0 ||
      this.players[1].hand.length <= 0
    ) {
      const message = 'ゲーム終了!!!';
      this.turnText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        message,
        { fontSize: '100px', color: '#000' }
      );

      this.turnText.setOrigin(0.5);
      return new Promise((resolve) => {
        this.time.delayedCall(5000, resolve);
      });
    }

    const message = this.isPlayerTurn
      ? 'Player turn!!'
      : 'House turn!!';

    this.turnText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      message,
      { fontSize: '100px', color: '#000' }
    );

    this.turnText.setOrigin(0.5);
    return new Promise((resolve) => {
      this.time.delayedCall(5000, resolve);
    });
  }

  private async playerTurn() {
    // TODO: player hand 2 playermeld 3 捨てる作業
    console.log('playerTurn!!');
    if (this.deckBack.length < 1) {
      this.resetDeckFromDeckFront();
    }
    let counter = 0;
    this.addPutOnHand(
      this.players[0],
      this.deckFront[this.deckFront.length - 1]
    );

    // meldZoneにカードを置けるかチェック
    const [sameRankCards, consecutiveRankCards] =
      this.findMeldAbleCard(this.players[0].hand);

    console.log(sameRankCards);
    console.log(consecutiveRankCards);

    // 追跡用
    if (sameRankCards)
      this.meldZoneSameRank.push(...sameRankCards);
    if (consecutiveRankCards)
      this.meldZoneConsecutiveRanks.push(
        ...consecutiveRankCards
      );

    if (
      sameRankCards.length > 0 ||
      consecutiveRankCards.length > 0
    ) {
      this.playerFlag = true;
    } else {
      this.playerFlag = false;
    }

    await this.delay(3000);

    if (this.playerFlag) {
      console.log('meldZoneへ');
      counter = 1;
      await this.cardPutOnMeldZone(this.players[0]);
      // インクリメント
      this.meldZoneEachCounter += 1;
      console.log('drawします');
      await this.delay(3000);
    } else {
      // meldZoneにカードを置けない場合、手札から1枚捨てる
      console.log('カードはなかったため、捨てる作業へ');
      await this.delay(3000);
      await this.cardPutOnDeckFront(this.players[0]);

      this.resetHandsMove(this.players[0]);
    }

    // TODO: プレイヤーターンに移行するかどうか判定
    if (counter === 1) {
      // ループさせる
      await this.playerTurn();
    }
  }

  private async playerDeckDraw() {
    return new Promise<void>((resolve) => {
      this.backDeckZone
        ?.setInteractive()
        .on('pointerdown', () => {
          this.deckBack.forEach((deck) => {
            const card = deck.drawOne();
            card?.playMoveTween(
              this.playerHandZones[0].x -
                (GAME.CARD.WIDTH + 10) * 2 +
                this.players[0].hand.length -
                1 * (GAME.CARD.WIDTH + 10) -
                350,
              this.playerHandZones[0].y - 50
            );
            card?.playFlipOverTween();
            if (card) this.players[0].addCardToHand(card);
            this.resetHandsMove(this.players[0]);
            resolve();
          });
        });
      this.frontDeckZone
        ?.setInteractive()
        .on('pointerdown', () => {
          const card = this.deckFront.pop();
          card?.playMoveTween(
            this.playerHandZones[0].x -
              (GAME.CARD.WIDTH + 10) * 2 +
              this.players[0].hand.length -
              1 * (GAME.CARD.WIDTH + 10) -
              350,
            this.playerHandZones[0].y - 50
          );
          if (card) this.players[0].addCardToHand(card);
          this.resetHandsMove(this.players[0]);
          resolve();
        });
    });
  }

  private checkIfCardCanBePutOnMeldZone(): boolean {
    const playerHand: Card[] = this.players[0].hand;
    const rankCounts: Record<string, number> = {};
    playerHand.forEach((card) => {
      if (rankCounts[card.rank]) rankCounts[card.rank] += 1;
      else rankCounts[card.rank] = 1;
    });

    const sameRankCards: Card[] = Object.keys(rankCounts)
      .map((rank) => {
        if (rankCounts[rank] >= 3) {
          return playerHand.find(
            (card) => card.rank === rank
          );
        }
        return null;
      })
      .filter((card) => card !== null) as Card[];

    const suits: string[] = Array.from(
      new Set(playerHand.map((card) => card.suit))
    );
    const consecutiveRankCards: Card[] = [];
    suits.forEach((suit) => {
      const sortedHand = playerHand
        .filter((card) => card.suit === suit)
        .sort(
          (a, b) =>
            a.getRankNumber('rummy') -
            b.getRankNumber('rummy')
        );
      let temp: Card[] = [sortedHand[0]];
      for (let i = 1; i < sortedHand.length; i += 1) {
        if (
          sortedHand[i].getRankNumber('rummy') -
            sortedHand[i - 1].getRankNumber('rummy') ===
          1
        ) {
          temp.push(sortedHand[i]);
        } else {
          consecutiveRankCards.push(
            ...temp.slice(0, Math.min(temp.length, 3))
          );
          temp = [sortedHand[i]];
        }
      }
      consecutiveRankCards.push(
        ...temp.slice(0, Math.min(temp.length, 3))
      );
    });

    const canPutOnMeldZone =
      sameRankCards.length >= 3 ||
      consecutiveRankCards.length >= 3;

    return canPutOnMeldZone;
  }

  private async houseTurn() {
    // 次にまた、houseTurn()するかどうか
    if (this.deckBack.length < 1) {
      this.resetDeckFromDeckFront();
    }
    let counter = 0;
    this.addPutOnHand(this.players[1], undefined);
    // meldZoneにカードを置けるかチェック
    const [sameRankCards, consecutiveRankCards] =
      this.findMeldAbleCard(this.players[1].hand);

    console.log(sameRankCards);
    console.log(consecutiveRankCards);

    // 追跡用
    if (sameRankCards)
      this.meldZoneSameRank.push(...sameRankCards);
    if (consecutiveRankCards)
      this.meldZoneConsecutiveRanks.push(
        ...consecutiveRankCards
      );

    if (
      sameRankCards.length > 0 ||
      consecutiveRankCards.length > 0
    ) {
      this.houseFlag = true;
    } else {
      this.houseFlag = false;
    }

    await this.delay(3000);

    if (this.houseFlag) {
      console.log('meldZoneへ');
      counter = 1;
      await this.cardPutOnMeldZone(this.players[1]);
      // インクリメント
      this.meldZoneEachCounter += 1;
      await this.delay(3000);
    } else {
      // meldZoneにカードを置けない場合、手札から1枚捨てる
      console.log('カードはなかったため、捨てる作業へ');
      await this.delay(3000);
      this.cardPutOnDeckFront(this.players[1]);
      this.resetHandsMove(this.players[1]);
    }

    // TODO: プレイヤーターンに移行するかどうか判定
    if (counter === 1) {
      // ループさせる
      await this.delay(3000);
      await this.houseTurn();
    }
  }

  // 追加したり、削除した後のreset関数
  private resetHandsMove(player: RummyPlayer) {
    if (player.playerType === 'house') {
      player.hand.forEach((card, i) => {
        this.time.delayedCall(1000, () => {
          card.playMoveTween(
            this.playerHandZones[1].x -
              (GAME.CARD.WIDTH + 10) * 2 +
              i * (GAME.CARD.WIDTH + 10) -
              350,
            this.playerHandZones[1].y - 50
          );
        });
      });
    } else {
      // player
      player.hand.forEach((card, i) => {
        this.time.delayedCall(1000, () => {
          card.playMoveTween(
            this.playerHandZones[0].x -
              (GAME.CARD.WIDTH + 10) * 2 +
              i * (GAME.CARD.WIDTH + 10) -
              350,
            this.playerHandZones[0].y + 50
          );
        });
      });
    }
  }

  private async cardPutOnDeckFront(player: RummyPlayer) {
    if (player.playerType === 'player') {
      this.enableCardDraggable();
      console.log('select card to deck!!');
      // dragの移動とhandからの削除まとめて
      await this.playerHandSelectedCard();
      this.disableCardDraggable();
      this.resetHandsMove(this.players[0]);

      await this.delay(2000);
      // eslint-disable-next-line no-else-return
    } else {
      // house
      const randomIndex = Math.floor(
        Math.random() * this.players[1].hand.length
      );
      const discardedCard =
        this.players[1].hand[randomIndex];
      if (discardedCard) {
        discardedCard.playMoveTween(
          this.deckFrontCardX,
          this.deckFrontCardY
        );
        this.deckFront.push(discardedCard);
        player.removeCardFromHand(discardedCard);
      }
    }
  }

  private playerHandSelectedCard(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.input.setDraggable(this.players[0].hand);
      this.createDropZoneEvent().then(() => {
        this.input.setDraggable(
          this.players[0].hand,
          false
        );
        resolve();
      });
    });
  }

  private canDropCard(card: Card, dropZone: Zone): boolean {
    const cardBounds = card.getBounds();
    const dropZoneBounds = dropZone.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(
      cardBounds,
      dropZoneBounds
    );
  }

  private checkIfCardOverDeck(card: Card) {
    const deckBounds = this.deckFront[0].getBounds();
    const cardBounds = card.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(
      deckBounds,
      cardBounds
    );
  }

  // メルドゾーンにおくカードを選定
  private findMeldAbleCard(hands: Card[]) {
    const meldAbleCards: Card[][][] = [[], []];

    // 同じrankが3枚以上ある場合の処理
    const rankCounts: Record<string, number> = {};
    hands.forEach((card) => {
      if (rankCounts[card.rank]) rankCounts[card.rank] += 1;
      else rankCounts[card.rank] = 1;
    });

    Object.keys(rankCounts).forEach((rank) => {
      if (rankCounts[rank] >= 3) {
        const cards = hands.filter(
          (card) => card.rank.toString() === rank.toString()
        );
        meldAbleCards[0].push([...cards]);
      }
    });

    // 同じsuitで連続するrankの組み合わせを探す
    const suits: string[] = Array.from(
      new Set(hands.map((card) => card.suit))
    );
    suits.forEach((suit) => {
      const sortedHand = hands
        .filter(
          (card) => card.suit.toString() === suit.toString()
        )
        .sort(
          (a, b) =>
            a.getRankNumber('rummy') -
            b.getRankNumber('rummy')
        );

      for (let i = 0; i < sortedHand.length - 2; i += 1) {
        const currRanks = sortedHand.slice(i, i + 3);
        const isConsecutive = currRanks.every(
          (card, index) =>
            card.getRankNumber('rummy') ===
            currRanks[0].getRankNumber('rummy') + index
        );

        if (isConsecutive) {
          meldAbleCards[1].push([...currRanks]);
        }
      }
    });

    console.log(meldAbleCards[0]);
    console.log(meldAbleCards[1]);

    return meldAbleCards.length > 0
      ? meldAbleCards
      : [[], []];
  }

  // meldZoneへ移動させる
  private async cardPutOnMeldZone(player: RummyPlayer) {
    const sameRankCards =
      this.meldZoneSameRank[
        this.meldZoneSameRank.length - 1
      ];
    const consecutiveRankCards =
      this.meldZoneConsecutiveRanks[
        this.meldZoneConsecutiveRanks.length - 1
      ];
    console.log(sameRankCards);
    console.log(consecutiveRankCards);

    if (player.playerType === 'house') {
      // houseの場合
      const cardsToMoveInSameRank: Card[] = [];
      const cardsToMoveInConsecutiveRank: Card[] = [];

      // 移動対象のカードを抽出
      player.hand.forEach((card) => {
        if (sameRankCards.flat().includes(card)) {
          cardsToMoveInSameRank.push(card);
        } else if (
          consecutiveRankCards.flat().includes(card)
        ) {
          cardsToMoveInConsecutiveRank.push(card);
        }
      });

      // カードの移動の選定
      if (cardsToMoveInSameRank.length > 0) {
        console.log('sameRankカードの移動');
        const moveCards: Card[] = [];
        cardsToMoveInSameRank.forEach((c) => {
          player.hand.forEach((card) => {
            if (c === card) {
              moveCards.push(card);
              console.log(moveCards);
            }
          });
        });
        // カードを移動
        if (moveCards.length > 0) {
          moveCards.forEach((card) => {
            card.playMoveTween(
              this.meldZoneEach[this.meldZoneEachCounter]
                .x + 70,
              this.meldZoneEach[this.meldZoneEachCounter]
                .y + 100
            );
          });
          this.arrayCardsPutOnMeldZone.push(moveCards);
        }

        // 手札から削除
        cardsToMoveInSameRank.forEach((card) =>
          player.removeCardFromHand(card)
        );
      } else if (cardsToMoveInConsecutiveRank.length > 0) {
        console.log('consecutiveRankカードの移動');
        const moveCards: Card[] = [];
        cardsToMoveInConsecutiveRank.forEach((c) => {
          player.hand.forEach((card) => {
            if (c === card) {
              moveCards.push(card);
              console.log(moveCards);
            }
          });
        });
        // カードを移動
        if (moveCards.length > 0) {
          moveCards.forEach((card) => {
            card.playMoveTween(
              this.meldZoneEach[this.meldZoneEachCounter]
                .x + 70,
              this.meldZoneEach[this.meldZoneEachCounter]
                .y + 100
            );
          });
          this.arrayCardsPutOnMeldZone.push(moveCards);
        }
        // 手札から削除
        cardsToMoveInConsecutiveRank.forEach((card: Card) =>
          player.removeCardFromHand(card)
        );
      }

      // 手札を更新
      this.resetHandsMove(player);
    } else {
      // playerの場合
      if (!this.meldZoneEach) {
        return;
      }
      let selectedCards: Card[] = [];
      const cardsToMoveInSameRank: Card[] = [];
      const cardsToMoveInConsecutiveRank: Card[] = [];
      this.enableCardDraggable();

      // 移動対象のカードを抽出
      player.hand.forEach((card) => {
        if (sameRankCards.includes(card)) {
          console.log(sameRankCards.flat());
          cardsToMoveInSameRank.push(card);
        } else if (consecutiveRankCards.includes(card)) {
          console.log(consecutiveRankCards.flat());
          cardsToMoveInConsecutiveRank.push(card);
        }
      });

      const handleCardSelection = (card: Card) => {
        if (
          cardsToMoveInSameRank.includes(card) ||
          cardsToMoveInConsecutiveRank.includes(card)
        ) {
          if (!selectedCards.includes(card)) {
            // 選択されたカードをグレー色で目立たせる
            card.setTint(0x808080);
            selectedCards.push(card);
          } else {
            // 選択を解除し、カードの色を元に戻す
            card.clearTint();
            const index = selectedCards.indexOf(card);
            if (index !== -1) {
              selectedCards.splice(index, 1);
            }
          }
        } else {
          // 選択されたカードが移動対象のカードではない場合、選択を解除し、カードの色を元に戻す
          card.clearTint();
          const index = selectedCards.indexOf(card);
          if (index !== -1) {
            selectedCards.splice(index, 1);
          }
        }

        // 3枚のカードが選択された場合、移動と手札からの削除を行う
        if (selectedCards.length === 3) {
          console.log('3つのカードを移動');
          const movePromises = selectedCards.map((c) =>
            c.playMoveTween(
              this.meldZoneEach[this.meldZoneEachCounter]
                .x + 70,
              this.meldZoneEach[this.meldZoneEachCounter]
                .y + 100
            )
          );
          console.log(movePromises);

          Promise.all(movePromises).then(() => {
            console.log('selectedCardをMeldZoneに移動');
            selectedCards.forEach((c) => {
              c.clearTint();
              c.disableInteractive();
              this.disableCardDraggable();
              player.removeCardFromHand(c);
            });
            this.arrayCardsPutOnMeldZone.push(
              selectedCards
            );
          });
        }
      };

      player.hand.forEach((card) => {
        card.on('pointerdown', () => {
          handleCardSelection(card);
        });
      });

      await new Promise<void>((resolve) => {
        const checkSelection = () => {
          if (selectedCards.length === 3) {
            // 手札を更新
            this.resetHandsMove(player);
            console.log('処理終わり');
            selectedCards = [];
            resolve();
          } else {
            console.log(checkSelection);
            setTimeout(checkSelection, 100);
          }
        };
        checkSelection();
      });
    }
  }

  private cardMoveToMeldZone(
    player: RummyPlayer,
    cards: Card[],
    meldZoneIndex: number
  ): void {
    const meldZone = this.meldZoneEach[meldZoneIndex];

    // カードをmeldZoneに移動させる処理
    cards.forEach((card) => {
      // カードの移動アニメーションや位置の調整などの実装が必要です
      card.playMoveTween(meldZone.x + 70, meldZone.y + 100);
    });

    // カードをmeldZoneに追加
    if (this.isSameRank(cards)) {
      // 同じランクのカードの場合
      this.meldZoneSameRank[meldZoneIndex].push(...cards);
    } else if (this.isConsecutiveRank(cards)) {
      // 連続するランクのカードの場合
      this.meldZoneConsecutiveRanks[meldZoneIndex].push(
        ...cards
      );
    }

    // 手札から移動したカードを削除
    player.removeCardFromHand(cards);
  }

  private isMeldAbleCard(cards: Card[]): boolean {
    // カードが選択されていない場合はmeldZoneに置けないと判定する
    if (cards.length === 0) {
      return false;
    }

    // カードのランクを取得
    const ranks = cards.map((card) => card.rank);

    // カードが同じランクか連続するランクであるかを判定するロジックを実装
    // ここでは単純に同じランクのカードか連続するランクのカードが選択されている場合にtrueを返す例としています
    // 実際の判定ロジックはゲームのルールや仕様に合わせて適切に実装してください
    const isSameRank = ranks.every(
      (rank) => rank === ranks[0]
    );
    const isConsecutiveRank = cards.every(
      (card, index) =>
        card.getRankNumber('rummy') ===
        cards[0].getRankNumber('rummy') + index
    );

    return isSameRank || isConsecutiveRank;
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

  private disableCardDraggable(): void {
    this.players.forEach((player) => {
      if (player.playerType === 'player') {
        player.hand.forEach((card) =>
          card.disableInteractive()
        );
      }
    });
  }

  private enableDeckFrontDraggable() {
    this.frontDeckZone?.setInteractive();
  }

  private enbleDeckBacDraggable() {
    this.backDeckZone?.setInteractive();
  }

  private async createDropZoneEvent() {
    return new Promise<void>((resolve) => {
      this.createCardDragStartEvent();
      this.createCardDragEvent();
      this.createCardDropEvent();

      const handleDragEnd = (
        pointer: Phaser.Input.Pointer,
        card: Card,
        dropped: boolean
      ) => {
        if (!dropped) {
          const droppedCard = card;
          droppedCard.x = droppedCard.input.dragStartX;
          droppedCard.y = droppedCard.input.dragStartY;
          this.children.bringToTop(droppedCard);
          droppedCard.playMoveTween(
            this.deckFrontCardX,
            this.deckFrontCardY
          );
          this.players[0].removeCardFromHand(droppedCard);
          this.deckFront.push(droppedCard);
        }

        this.input.off('dragend', handleDragEnd); // ハンドラを解除
        resolve();
      };

      this.input.on('dragend', handleDragEnd);
    });
  }

  private async createCardDropEvent() {
    this.input.on(
      'drop',
      (
        pointer: Phaser.Input.Pointer,
        card: Card,
        dropZone: Zone
      ) => {
        const droppedCard = card;
        droppedCard.x = dropZone.x;
        droppedCard.y = dropZone.y;

        droppedCard.input.enabled = false;
      }
    );
  }

  private addPutOnHand(
    player: RummyPlayer,
    cardFromDeck: Card | undefined
  ) {
    if (player.playerType === 'house') {
      this.deckBack.forEach((deck) => {
        const popCard = deck.drawOne();
        if (popCard) {
          this.players[1].addCardToHand(popCard);
          console.log(this.players[1].hand);
          this.time.delayedCall(1000, () => {
            popCard.playMoveTween(
              this.playerHandZones[1].x -
                (GAME.CARD.WIDTH + 10) * 2 +
                this.players[1].hand.length -
                1 * (GAME.CARD.WIDTH + 10) -
                350,
              this.playerHandZones[1].y - 50
            );
            // 挙動確認のため
            popCard.playFlipOverTween();
          });
          console.log(this.players[1].hand);
        }
      });
    } else {
      this.deckBack.forEach((deck) => {
        const popCard = deck.drawOne();
        // handに追加
        if (popCard) {
          this.players[0].addCardToHand(popCard);
          popCard.playMoveTween(
            this.playerHandZones[0].x -
              (GAME.CARD.WIDTH + 10) * 2 +
              this.players[0].hand.length -
              1 * (GAME.CARD.WIDTH + 10) -
              350,
            this.playerHandZones[0].y - 50
          );
          popCard.playFlipOverTween();
        }
      });

      this.resetHandsMove(this.players[0]);
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve(); // 非同期操作の完了を通知する
      }, ms);
    });
  }

  private resetDeckFromDeckFront() {
    this.deckFront.forEach((card) => {
      this.time.delayedCall(1000, () => {
        card.playMoveTween(
          this.deckBackCardX - GAME.CARD.WIDTH / 2,
          this.deckBackCardY - GAME.CARD.HEIGHT / 2
        );
      });
    });
    this.createDeck();
  }

  private deriveGameResult(): GameResult | undefined {
    let result: GameResult | undefined;

    if (
      this.players[0].hand.length <= 0 &&
      this.players[1].hand.length <= 0
    ) {
      result = GameResult.TIE;
      this.gamePhase = GamePhase.END_OF_GAME;
    } else if (this.players[0].hand.length <= 0) {
      result = GameResult.LOSS;
      this.gamePhase = GamePhase.END_OF_GAME;
    } else if (this.players[1].hand.length <= 0) {
      result = GameResult.WIN;
      this.gamePhase = GamePhase.END_OF_GAME;
    } else {
      result = undefined; // まだゲームが終わっていない
      this.gamePhase = GamePhase.ACTING;
    }

    return result;
  }

  payOut(result: GameResult): Result {
    let winAmount = 0;
    if (this.lobbyScene && this.lobbyScene.money) {
      if (result === GameResult.WIN) {
        winAmount = this.lobbyScene.bet;
      } else if (result === GameResult.LOSS) {
        winAmount = -this.lobbyScene.bet;
      }
      this.lobbyScene.money += winAmount;
      this.setMoneyText(this.lobbyScene.money);
      this.setBetText(this.lobbyScene.bet);
    }
    return {
      gameResult: result,
      winAmount
    };
  }

  playGameResultSound(result: string): void {
    if (result === GameResult.WIN) {
      this.winGameSound?.play();
    } else {
      this.lossGameSound?.play();
    }
  }
}
