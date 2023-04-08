/* eslint-disable */
/* eslint no-param-reassign: ["error", { "props": false }] */
// TODO: 山札から台札に出すカードより先に、CPUのカードが台に出されて、一番上のカードの絵柄がずれてしまうバグを修正する
// TODO: AIが1枚だけ持っていて、ゲームが停滞したときに、持ち札から台札にカードが送られない

import Card from '../../common/Factories/card';
import game from '../../common/constants/game';
import style from '../../common/constants/style';
import {
  createCardTween,
  flipOverCard,
  parseCardString,
  searchCardImage
} from '../../common/utility/utility';
import GameResult from '../constants/gameResult';
import BlackDeck from '../models/blackDeck';
import SpeedPlayer from '../models/player';
import RedDeck from '../models/redDeck';

import BaseScene from '../../common/scenes/BaseScene';

import Text = Phaser.GameObjects.Text;
import Texture = Phaser.Textures.Texture;
import Zone = Phaser.GameObjects.Zone;
import Image = Phaser.GameObjects.Image;
import GameObject = Phaser.GameObjects.GameObject;

export default class PlayScene extends BaseScene {
  private redDeck: RedDeck;

  private blackDeck: BlackDeck;

  private player: SpeedPlayer;

  private ai: SpeedPlayer;

  private faceDownImages: Array<Image> = [];

  private atlasTexture: Texture | undefined;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  private playerNameText: Text | undefined;

  private aiNameText: Text | undefined;

  private playerDeckSizeText: Text | undefined;

  private aiDeckSizeText: Text | undefined;

  private timerText: Text;

  private gameZone: Zone | undefined;

  private dropCardZone: any = {
    right: undefined,
    left: undefined
  };

  private dropCardRank = { right: 0, left: 0 };

  private playerDeckImage: Image | undefined;

  private aiDeckImage: Image | undefined;

  private playerHandZone: Zone | undefined;

  private aiHandZone: Zone | undefined;

  private timer = 3;

  private timeEvent: any;

  private DROP_CARD_ZONE_RIGHT = 'dropCardZoneRight';

  private DROP_CARD_ZONE_LEFT = 'dropCardZoneLeft';

  constructor(config: any) {
    super('PlayScene', config);

    this.redDeck = new RedDeck();
    this.blackDeck = new BlackDeck();

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

    this.timerText = this.add.text(0, 0, '');
  }

  create(): void {
    this.setUpNewGame();

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

    const width = Number(
      this.scene.manager.game.config.width
    );
    const height = Number(
      this.scene.manager.game.config.height
    );
    this.gameZone = this.add.zone(
      width * 0.5,
      height * 0.5,
      width,
      height
    );

    this.setUpAiNameText();
    this.setUpPlayerNameText();

    // create player hand zone
    this.playerHandZone = this.add.zone(
      0,
      0,
      game.card.width * 5,
      game.card.height
    );
    Phaser.Display.Align.To.TopCenter(
      this.playerHandZone as Zone,
      this.playerNameText as Text,
      0,
      style.gutter_size
    );

    // create ai hand zone
    this.aiHandZone = this.add.zone(
      0,
      0,
      game.card.width * 5,
      game.card.height
    );
    Phaser.Display.Align.To.BottomCenter(
      this.aiHandZone as Zone,
      this.aiNameText as GameObject,
      0,
      style.gutter_size
    );

    this.setUpAiDeckSizeText();
    this.setUpPlayerDeckSizeText();

    // create card drop zone
    this.dropCardZone.left = this.add
      .zone(
        0,
        0,
        game.card.width * 1.5,
        game.card.height * 1.5
      )
      .setRectangleDropZone(
        game.card.width,
        game.card.height
      )
      .setName(this.DROP_CARD_ZONE_LEFT);
    this.dropCardZone.right = this.add
      .zone(
        0,
        0,
        game.card.width * 1.5,
        game.card.height * 1.5
      )
      .setRectangleDropZone(
        game.card.width,
        game.card.height
      )
      .setName(this.DROP_CARD_ZONE_RIGHT);

    this.setUpCardDropZone(this.dropCardZone);

    this.setDeckImage(true);
    this.setDeckImage(false);
    this.dealInitialCards();

    this.timer = 3;
    this.time.delayedCall(3000, () => {
      this.setUpTimerText();
      // ゲームのカウントダウン
      this.time.addEvent({
        delay: 800,
        callback: this.countDownGame,
        callbackScope: this,
        repeat: 4
      });
    });
  }

  update(): void {
    const result = this.deriveGameResult();
    if (result !== GameResult.PLAYING) {
      this.endHand(result);
    }
  }

  private countDownGame(): void {
    if (this.timer > 0) {
      this.setTimerText(`${String(this.timer)}`);
      this.timer -= 1;
    } else if (this.timer === 0) {
      this.setTimerText('GO!!');
      Phaser.Display.Align.In.Center(
        this.timerText,
        this.gameZone as GameObject,
        0,
        -20
      );
      this.timer -= 1;
    } else {
      this.timerText?.destroy();
      this.enableCardDraggable();

      const timerEvent = this.time.addEvent({
        delay: 3000,
        callback: () => {
          if (!this.isAiStagnant()) {
            this.putDownCardFromHand();
          } else if (this.isGameStagnant()) {
            console.log('AI cannot put down card');
            this.dealLeadCards();
          }
        },
        callbackScope: this,
        loop: true
      });
    }

    Phaser.Display.Align.In.Center(
      this.timerText,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  private setTimerText(time: string): void {
    this.timerText!.setText(`${time}`);
  }

  private setUpTimerText(): void {
    this.timerText = this.add.text(0, 0, '', style.timer);
    this.setTimerText(`${String(this.timer)}`);
    Phaser.Display.Align.In.Center(
      this.timerText,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  private disableCardDraggable(): void {
    const cardImages = this.children.list.filter(
      (object: any) =>
        object.texture.key === game.card.atlas_key &&
        object.input?.draggable
    );
    for (let i = 0; i < cardImages.length; i += 1) {
      this.input.disable(cardImages[i]);
    }
  }

  private enableCardDraggable(): void {
    const cardImages = this.children.list.filter(
      (object: any) =>
        object.texture.key === game.card.atlas_key &&
        object.input?.draggable
    );
    for (let i = 0; i < cardImages.length; i += 1) {
      this.input.enable(cardImages[i]);
    }
  }

  private setUpNewGame() {
    // setup new game
    this.redDeck = new RedDeck();
    this.redDeck.shuffle();
    this.blackDeck = new BlackDeck();
    this.blackDeck.shuffle();
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

    //  Just a visual display of the drop zone. This code will be removed
    // const graphics = this.add.graphics();
    // graphics.lineStyle(2, 0x000);
    // graphics.strokeRect(
    //   dropCardZone.x - dropCardZone.width / 2,
    //   dropCardZone.y - dropCardZone.height / 2,
    //   dropCardZone.width,
    //   dropCardZone.height
    // );
  }

  private setUpCardDropZone(dropCardZone: {
    right: Zone;
    left: Zone;
  }): void {
    this.alignCardDropZone(
      dropCardZone.right,
      game.card.width
    );
    this.alignCardDropZone(
      dropCardZone.left,
      -game.card.width
    );

    this.input.on(
      'dragstart',
      (pointer: any, gameObject: any) => {
        this.children.bringToTop(gameObject);
      },
      this
    );

    this.input.on(
      'drag',
      (
        pointer: Phaser.Input.Pointer,
        gameObject: any,
        dragX: number,
        dragY: number
      ) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    );

    // 1. カードが置けるかどうか判断する
    // 2. カードが置ける場合は、ユーザーか、AIどちらのカードか判定し、置いたユーザーの手札を追加する

    this.input.on(
      'drop',
      (
        pointer: Phaser.Input.Pointer,
        gameObject: any,
        dropZone: Zone
      ) => {
        if (
          (dropZone.name === this.DROP_CARD_ZONE_RIGHT &&
            PlayScene.isNextRank(
              this.dropCardRank.right,
              Number(gameObject.name)
            )) ||
          (dropZone.name === this.DROP_CARD_ZONE_LEFT &&
            PlayScene.isNextRank(
              this.dropCardRank.left,
              Number(gameObject.name)
            ))
        ) {
          // カードが置けると判定した場合
          gameObject.x = dropZone.x;
          gameObject.y = dropZone.y;
          gameObject.input.enabled = false;

          if (dropZone.name === this.DROP_CARD_ZONE_RIGHT) {
            this.dropCardRank.right = Number(
              gameObject.name
            );
          } else {
            this.dropCardRank.left = Number(
              gameObject.name
            );
          }

          // カードを補充する
          // handからカードを削除する
          const [suit, rank] = parseCardString(
            gameObject.frame.name
          );
          this.player?.removeCardFromHand(suit, rank);

          if (this.redDeck.getDeckSize() > 0) {
            // デッキにカードが残っている場合
            this.handOutCard(
              this.redDeck,
              this.player,
              this.playerHandZone!.x + game.card.width * 2,
              this.playerHandZone!.y,
              gameObject.input.dragStartX,
              this.playerHandZone!.y,
              false
            );

            this.setPlayerDeckSizeText();
          }
          if (this.redDeck?.getDeckSize() === 0) {
            // デッキが空の場合
            this.removeDeckImage(true);
            this.removePlayerDeckSizeText();
          }

          console.log(
            `Player turn left: ${this.dropCardRank.left} right: ${this.dropCardRank.right}`
          );

          // ゲームが停滞したら、山札から台札にカードを出す
          // const dealLeadCardEvent = this.time.addEvent({
          //   delay: 2000,
          //   callback: () => {
          //     if (this.isGameStagnant()) this.dealLeadCards();
          //     else dealLeadCardEvent.remove(false);
          //   },
          //   callbackScope: this,
          //   loop: true
          // });

          // Gameのresult確認
        } else {
          // カードが置けない場合
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
      },
      dropCardZone
    );

    this.input.on(
      'dragend',
      (pointer: any, gameObject: any, dropped: boolean) => {
        if (!dropped) {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
      }
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
    let isGameContinuable = false;
    for (let i = 0; i < this.player!.hand.length; i += 1) {
      isGameContinuable =
        isGameContinuable ||
        PlayScene.isNextRank(
          this.player!.hand[i].getRankNumber('speed'),
          this.dropCardRank.right
        );
      isGameContinuable =
        isGameContinuable ||
        PlayScene.isNextRank(
          this.player!.hand[i].getRankNumber('speed'),
          this.dropCardRank.left
        );
    }
    return !isGameContinuable;
  }

  private isAiStagnant(): boolean {
    let isGameContinuable = false;
    for (let i = 0; i < this.ai!.hand.length; i += 1) {
      isGameContinuable =
        isGameContinuable ||
        PlayScene.isNextRank(
          this.ai!.hand[i].getRankNumber('speed'),
          this.dropCardRank.right
        );
      isGameContinuable =
        isGameContinuable ||
        PlayScene.isNextRank(
          this.ai!.hand[i].getRankNumber('speed'),
          this.dropCardRank.left
        );
    }
    return !isGameContinuable;
  }

  private setUpAiNameText(): void {
    this.aiNameText = this.add.text(
      0,
      200,
      'AI',
      style.text
    );
    Phaser.Display.Align.In.TopCenter(
      this.aiNameText,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  private setUpAiDeckSizeText(): void {
    this.aiDeckSizeText = this.add.text(
      0,
      200,
      '',
      style.deckSize
    );

    Phaser.Display.Align.In.BottomLeft(
      this.aiDeckSizeText,
      this.aiHandZone as Zone,
      70,
      0
    );
  }

  private setAiDeckSizeText(): void {
    this.aiDeckSizeText!.setText(
      `${this.blackDeck?.getDeckSize()} 枚`
    );
  }

  private removeAiDeckSizeText(): void {
    this.aiDeckSizeText?.destroy();
  }

  private setUpPlayerNameText(): void {
    this.playerNameText = this.add.text(
      0,
      300,
      'Player',
      style.text
    );
    Phaser.Display.Align.In.BottomCenter(
      this.playerNameText,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  private setUpPlayerDeckSizeText(): void {
    this.playerDeckSizeText = this.add.text(
      0,
      300,
      '',
      style.deckSize
    );

    Phaser.Display.Align.In.BottomRight(
      this.playerDeckSizeText,
      this.playerHandZone as Zone,
      20,
      0
    );
  }

  private setPlayerDeckSizeText(): void {
    this.playerDeckSizeText!.setText(
      `${this.redDeck?.getDeckSize()} 枚`
    );
  }

  private removePlayerDeckSizeText(): void {
    this.playerDeckSizeText?.destroy();
  }

  // 山札を表示する関数
  // TODO: 山札が0になった場合(=handが5枚以下の場合)は非表示にする
  private setDeckImage(isPlayer: boolean) {
    if (isPlayer) {
      this.playerDeckImage = this.add.image(
        this.playerHandZone!.x + game.card.width * 2,
        this.playerHandZone!.y,
        game.card.back_key
      );
    } else {
      this.aiDeckImage = this.add.image(
        this.aiHandZone!.x - game.card.width * 2,
        this.aiHandZone!.y,
        game.card.back_key
      );
    }
  }

  private removeDeckImage(isPlayer: boolean) {
    if (isPlayer) {
      this.playerDeckImage?.destroy();
    } else {
      this.aiDeckImage?.destroy();
    }
  }

  // ゲーム開始時にカードを配る関数
  // 裏返しで配って、配り終えたら裏返す
  private dealInitialCards() {
    if (this.player) {
      for (let i = 0; i < 4; i += 1) {
        this.time.delayedCall(200 * i, () => {
          if (this.player) {
            this.handOutCard(
              this.redDeck,
              this.player,
              this.playerHandZone!.x + game.card.width * 2,
              this.playerHandZone!.y,
              this.playerHandZone!.x -
                game.card.width * 2 +
                i * game.card.width,
              this.playerHandZone!.y,
              true
            );
          }
        });
      }
    }

    if (this.ai) {
      for (let i = 0; i < 4; i += 1) {
        this.time.delayedCall(200 * i, () => {
          if (this.ai) {
            this.handOutCard(
              this.blackDeck,
              this.ai,
              this.aiHandZone!.x - game.card.width * 2,
              this.aiHandZone!.y,
              this.aiHandZone!.x +
                game.card.width * 2 -
                i * game.card.width,
              this.aiHandZone!.y,
              true
            );
          }
        });
      }
    }

    // カードを裏返す
    this.time.delayedCall(1500, () => {
      const playerCardImages = this.faceDownImages.filter(
        (gameObject) =>
          gameObject?.y === this.playerHandZone?.y
      );
      for (let i = 0; i < playerCardImages.length; i += 1) {
        if (this.player) {
          this.handleFlipOver(
            this.player.hand[i],
            playerCardImages[i]
          );
        }
      }

      const aiCardImages = this.faceDownImages.filter(
        (gameObject) => gameObject?.y === this.aiHandZone?.y
      );
      for (let i = 0; i < aiCardImages.length; i += 1) {
        if (this.ai) {
          this.handleFlipOver(
            this.ai.hand[i],
            aiCardImages[i],
            false
          );
        }
      }
      this.faceDownImages = [];

      this.setAiDeckSizeText();
      this.setPlayerDeckSizeText();
      this.disableCardDraggable();
    });

    // 中央の台札をセットする
    this.dealLeadCards();
  }

  // 山札から台札にカードを裏向きに配って、裏返す
  // 山札がない場合は、手札から出す
  // TODO: デッキの数の表示を更新するタイミングを考える
  private dealLeadCards(): void {
    if (
      this.blackDeck &&
      this.blackDeck?.getDeckSize() > 0
    ) {
      this.handOutLeadCardFromDeck(
        this.blackDeck,
        this.aiHandZone!.x - game.card.width * 2,
        this.aiHandZone!.y,
        this.dropCardZone.left?.x,
        this.dropCardZone.left?.y
      );
    } else {
      this.handOutLeadCardFromHand(
        this.ai,
        this.dropCardZone.left?.x,
        this.dropCardZone.left?.y
      );
    }

    if (this.redDeck.getDeckSize() > 0) {
      this.handOutLeadCardFromDeck(
        this.redDeck,
        this.playerHandZone!.x + game.card.width * 2,
        this.playerHandZone!.y,
        this.dropCardZone.right?.x,
        this.dropCardZone.right?.y
      );
    } else {
      this.handOutLeadCardFromHand(
        this.player,
        this.dropCardZone.right?.x,
        this.dropCardZone.right?.y
      );
    }

    this.setAiDeckSizeText();
    this.setPlayerDeckSizeText();
  }

  private handleFlipOver(
    card: Card,
    faceDownImage: Image,
    isInteractive = true
  ) {
    if (card.faceDown) {
      card.faceDown = !card.faceDown;
      // 表向きのcardを作成する
      const cardFront = this.add.image(
        faceDownImage!.x,
        faceDownImage!.y,
        game.card.atlas_key,
        card!.getAtlasFrame()
      );

      if (isInteractive) {
        cardFront.setInteractive();
        this.input.setDraggable(cardFront);
      }

      cardFront.name = String(card.getRankNumber('speed'));
      cardFront.setScale(0, 1);
      flipOverCard(this, faceDownImage, cardFront);
    }
  }

  private handOutCard(
    deck: RedDeck | BlackDeck,
    player: SpeedPlayer,
    originX: number,
    originY: number,
    toX: number,
    toY: number,
    faceDownCard: boolean
  ) {
    const card: Card | undefined = deck.drawOne();
    let cardImage: Image;

    if (card) {
      if (!faceDownCard) {
        player.addCardToHand(card);
        cardImage = this.add.image(
          originX,
          originY,
          game.card.atlas_key,
          card.getAtlasFrame()
        );
        cardImage.name = String(
          card.getRankNumber('speed')
        );
        if (player.playerType === 'player') {
          cardImage.setInteractive();
          this.input.setDraggable(cardImage);
        }
      } else {
        player.addCardFaceDownToHand(card);
        cardImage = this.add.image(
          originX,
          originY,
          game.card.back_key
        );
        this.faceDownImages.push(cardImage);
      }
      createCardTween(this, cardImage, toX, toY, 350);
    }
  }

  private handOutLeadCardFromDeck(
    deck: RedDeck | BlackDeck,
    originX: number,
    originY: number,
    toX: number,
    toY: number
  ): void {
    const card: Card | undefined = deck.drawOne();

    if (card) {
      card.faceDown = true;
      if (deck.constructor === RedDeck) {
        this.dropCardRank.right =
          card.getRankNumber('speed');
      } else {
        this.dropCardRank.left =
          card.getRankNumber('speed');
      }

      const cardImage = this.add.image(
        originX,
        originY,
        game.card.back_key
      );
      this.faceDownImages.push(cardImage);
      this.children.bringToTop(cardImage);

      createCardTween(this, cardImage, toX, toY, 350);
      // カードを裏返す
      this.time.delayedCall(1500, () => {
        this.handleFlipOver(card, cardImage, false);
      });
    }
  }

  private handOutLeadCardFromHand(
    player: SpeedPlayer,
    toX: number,
    toY: number
  ): void {
    const card = player.hand[0];
    // gameObjectの中から、cardに一致するgameObjectを取得する
    const cardImage: Image | undefined = searchCardImage(
      this,
      card.suit,
      card.rank
    );
    // handからcard削除
    player.removeCardFromHand(card.suit, card.rank);
    if (cardImage) {
      this.children.bringToTop(cardImage);
      createCardTween(this, cardImage, toX, toY, 350);
    }
  }

  // CPUのhandから場にカードを出す
  private putDownCardFromHand(): void {
    let card: Card | undefined;
    let isRight = true;

    for (let i = 0; i < this.ai.hand.length; i += 1) {
      if (
        PlayScene.isNextRank(
          this.ai?.hand[i].getRankNumber('speed'),
          this.dropCardRank.left
        )
      ) {
        card = this.ai.hand[i];
        this.ai?.removeCardFromHand(card.suit, card.rank);
        this.dropCardRank.left =
          card.getRankNumber('speed');
        isRight = false;
        break;
      } else if (
        PlayScene.isNextRank(
          this.ai.hand[i].getRankNumber('speed'),
          this.dropCardRank.right
        )
      ) {
        card = this.ai.hand[i];
        this.ai?.removeCardFromHand(card.suit, card.rank);
        this.dropCardRank.right =
          card.getRankNumber('speed');
        break;
      }
    }

    let cardImage: Image | undefined;
    if (card) {
      cardImage = searchCardImage(
        this,
        card.suit,
        card.rank
      );

      if (cardImage) {
        this.children.bringToTop(cardImage);
        if (isRight)
          createCardTween(
            this,
            cardImage,
            this.dropCardZone.right?.x,
            this.dropCardZone.right.y
          );
        else
          createCardTween(
            this,
            cardImage,
            this.dropCardZone.left?.x,
            this.dropCardZone.left.y
          );
      } else {
        return;
      }

      if (
        this.blackDeck &&
        this.blackDeck.getDeckSize() > 0
      ) {
        this.handOutCard(
          this.blackDeck,
          this.ai,
          this.aiHandZone!.x - game.card.width * 2,
          this.aiHandZone!.y,
          cardImage.x,
          cardImage.y,
          false
        );

        this.setAiDeckSizeText();
      }
      if (this.blackDeck?.getDeckSize() === 0) {
        this.removeDeckImage(false);
        this.removeAiDeckSizeText();
      }
    }
  }

  private deriveGameResult(): string {
    let result;
    if (
      this.player.getHandScore() === 0 &&
      this.ai.getHandScore() === 0
    ) {
      result = GameResult.DRAW;
    } else if (this.player.getHandScore() === 0) {
      result = GameResult.WIN;
    } else if (this.ai.getHandScore() === 0) {
      result = GameResult.LOSS;
    } else {
      result = GameResult.PLAYING; // まだゲームが終わっていない
    }
    return result;
  }

  private endHand(result: string) {
    // payout

    const graphics = this.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.75 }
    });
    const square = new Phaser.Geom.Rectangle(
      0,
      0,
      Number(this.scene.manager.game.config.width),
      Number(this.scene.manager.game.config.height)
    );
    graphics.fillRectShape(square);
    const resultText: Text = this.add.text(
      0,
      0,
      result,
      style.text
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
        this.input.once(
          'pointerup',
          () => {
            this.scene.stop();
            this.scene.start('BetScene');
            console.log('Return to BetScene');
          },
          this
        );
      },
      this
    );
  }
}
