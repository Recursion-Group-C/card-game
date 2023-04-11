/* eslint-disable */

import {
  CARD_ATLAS_KEY,
  CARD_HEIGHT,
  CARD_WIDTH,
  CardFactory
} from '../Factories/cardFactory';
import Deck from '../models/deck';
import Hand from '../models/hand';
import {
  GUTTER_SIZE,
  HIGH_SCORE_STORAGE,
  textStyle
} from '../constants/constants';

import BaseScene from '../../common/scenes/BaseScene';
import BetScene from '../../common/scenes/BetScene';

import updateBetDoubleText from './BetScene';
import GameResult from '../models/gameResult';
import Text = Phaser.GameObjects.Text;
import Texture = Phaser.Textures.Texture;
import Image = Phaser.GameObjects.Image;
import Zone = Phaser.GameObjects.Zone;

export default class PlayScene extends BaseScene {
  private dealerHand: Hand | undefined;

  private playerHand: Hand | undefined;

  private deck: Deck | undefined;

  private atlasTexture: Texture | undefined;

  private CARD_MARGIN: Number = 10;

  private dealerScoreText: Text | undefined;

  private playerScoreText: Text | undefined;

  private textHit: Text | undefined;

  private textStay: Text | undefined;

  private textDouble: Text | undefined;

  private textSurrender: Text | undefined;

  private moneyText: Text | undefined;

  private cardImages: Image[] | undefined;

  private betScene: BetScene | undefined;

  private stayButton: Image | undefined;

  private hitButton: Image | undefined;

  private doubleButton: Image | undefined;

  private surrenderButton: Image | undefined;

  private playerHandZone: Zone | undefined;

  private dealerHandZone: Zone | undefined;

  private faceDownImage: Image | undefined;

  private gamePhase: string = 'default';

  private CARD_FLIP_TIME = 600;

  constructor(config: any) {
    super('PlayScene', config);
  }

  create(): void {
    this.createGameZone();

    this.setUpMoneyText();
    this.setUpNewGame();

    this.playerHandZone = this.add.zone(
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );
    Phaser.Display.Align.To.TopLeft(
      this.playerHandZone as Zone,
      this.playerScoreText as Phaser.GameObjects.GameObject,
      0,
      GUTTER_SIZE
    );
    this.dealerHandZone = this.add.zone(
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );
    Phaser.Display.Align.To.BottomLeft(
      this.dealerHandZone as Zone,
      this.dealerScoreText as Phaser.GameObjects.GameObject,
      0,
      GUTTER_SIZE
    );
    this.dealInitialCards();
  }

  private dealInitialCards() {
    setTimeout(
      this.handOutCard.bind(this),
      1,
      this.playerHand,
      false
    );
    setTimeout(
      this.handOutCard.bind(this),
      500,
      this.dealerHand,
      false
    );
    setTimeout(
      this.handOutCard.bind(this),
      1000,
      this.playerHand,
      false
    );
    setTimeout(
      this.handOutCard.bind(this),
      1500,
      this.dealerHand,
      true
    );
    setTimeout(this.checkForBlackJack.bind(this), 1500);
  }

  private checkForBlackJack() {
    if (
      this.playerHand?.getBlackjackScore() === 21 &&
      this.gamePhase !== 'Surrender'
    ) {
      this.endHand(GameResult.BLACKJACK);
    }
  }

  private createCardTween(
    image: Image,
    x: number,
    y: number,
    duration: number = 500
  ) {
    this.tweens.add({
      targets: image,
      x: x,
      y: y,
      duration: duration,
      ease: 'Linear'
    });
  }

  private flipOverCard(cardBack: Image, cardFront: Image) {
    this.tweens.add({
      targets: cardBack,
      scaleX: 0,
      duration: this.CARD_FLIP_TIME / 2,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: cardFront,
      scaleX: 1,
      duration: this.CARD_FLIP_TIME / 2,
      delay: this.CARD_FLIP_TIME / 2,
      ease: 'Linear'
    });
  }

  private setUpMoneyText(): void {
    this.moneyText = this.add.text(0, 0, '', textStyle);
    let betText = this.add.text(0, 0, '', textStyle);

    this.updateMoneyText();
    this.updateBetText(betText);
  }

  private updateMoneyText(): void {
    this.moneyText!.setText(
      'Money: $' + this.betScene?.money
    );
    Phaser.Display.Align.In.TopRight(
      this.moneyText! as Phaser.GameObjects.GameObject,
      this.gameZone as Phaser.GameObjects.GameObject,
      -20,
      -20
    );
  }

  private updateBetText(text: Text) {
    text.setText('Bet: $' + this.betScene?.bet);
    Phaser.Display.Align.To.BottomLeft(
      text,
      this.moneyText as Phaser.GameObjects.GameObject
    );
  }

  private setUpDealerScoreText(): void {
    this.dealerScoreText = this.add.text(
      0,
      200,
      '',
      textStyle
    );
    this.setDealerScoreText();
    Phaser.Display.Align.In.TopCenter(
      this.dealerScoreText,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -20
    );
  }

  private setUpPlayerScoreText(): void {
    this.playerScoreText = this.add.text(
      0,
      300,
      '',
      textStyle
    );
    this.setPlayerScoreText();
    Phaser.Display.Align.In.BottomCenter(
      this.playerScoreText,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -20
    );
  }

  private setUpHitButton(): void {
    this.hitButton = this.add
      .image(
        this.gameZone!.width * 0.33,
        this.gameZone!.height * 0.5,
        'yellowChip'
      )
      .setScale(1.2 * this.betScene!.scale);
    this.textHit = this.add.text(
      this.gameZone!.width * 0.33,
      this.gameZone!.height * 0.5,
      'Hit',
      textStyle
    );
    Phaser.Display.Align.In.Center(
      this.textHit,
      this.hitButton
    );
    this.hitButton.setInteractive();
    this.setUpHoverStyles(this.hitButton);
    this.setUpClickHandler(this.hitButton, this.handleHit);
  }

  private setUpStayButton(): void {
    this.stayButton = this.add
      .image(
        this.gameZone!.width * 0.66,
        this.gameZone!.height * 0.5,
        'orangeChip'
      )
      .setScale(1.2 * this.betScene!.scale);
    this.textStay = this.add.text(
      this.gameZone!.width * 0.66,
      this.gameZone!.height * 0.5,
      'Stay',
      textStyle
    );
    Phaser.Display.Align.In.Center(
      this.textStay,
      this.stayButton
    );
    this.stayButton.setInteractive();
    this.setUpHoverStyles(this.stayButton);
    this.setUpClickHandler(
      this.stayButton,
      this.handleStay
    );
  }

  private setUpDoubleButton(): void {
    this.gamePhase = 'Double';
    this.doubleButton = this.add
      .image(
        this.gameZone!.width * 0.15,
        this.gameZone!.height * 0.5,
        'whiteChip'
      )
      .setScale(1.2 * this.betScene?.scale);
    this.textDouble = this.add.text(
      this.gameZone!.width * 0.15,
      this.gameZone!.height * 0.5,
      'Double',
      textStyle
    );
    Phaser.Display.Align.In.Center(
      this.textDouble,
      this.doubleButton
    );
    this.doubleButton.setInteractive();
    this.setUpHoverStyles(this.doubleButton);
    this.setUpClickHandler(
      this.doubleButton,
      this.handleDouble
    );
  }

  private setUpSurrenderButton() {
    this.gamePhase = 'Surrender';
    this.surrenderButton = this.add
      .image(
        this.gameZone!.width * 0.84,
        this.gameZone!.height * 0.5,
        'blueChip'
      )
      .setScale(1.2 * this.betScene?.scale);
    this.textSurrender = this.add.text(
      this.gameZone!.width * 0.84,
      this.gameZone!.height * 0.5,
      'Surrender',
      textStyle
    );
    Phaser.Display.Align.In.Center(
      this.textSurrender,
      this.surrenderButton
    );
    this.surrenderButton.setInteractive();
    this.setUpHoverStyles(this.surrenderButton);
    this.setUpClickHandler(
      this.surrenderButton,
      this.handleSurrender
    );
  }

  private setUpHoverStyles(image: Image) {
    image.on(
      'pointerover',
      function (this: any) {
        // thisの型指定できていない
        image.setScale(1.4 * this.betScene.scale);
      },
      this
    );
    image.on(
      'pointerout',
      function (this: any) {
        image.setScale(1 * this.betScene.scale);
      },
      this
    );
  }

  private setUpNewGame() {
    this.deck = new Deck();
    this.dealerHand = new Hand();
    this.playerHand = new Hand();
    this.setUpHitButton();
    this.setUpStayButton();
    this.setUpDoubleButton();
    this.setUpSurrenderButton();
    this.setUpDealerScoreText();
    this.setUpPlayerScoreText();
  }

  private setUpClickHandler(
    image: Image,
    handlerFunction: Function
  ) {
    let mainScene: MainScene = this;
    image.on('pointerdown', function () {
      handlerFunction(mainScene);
    });
  }

  private handleHit(mainScene: MainScene): void {
    mainScene.handOutCard(
      mainScene.playerHand as Hand,
      false
    );
    mainScene.setPlayerScoreText();
    if (mainScene.playerHand!.getBlackjackScore() > 21) {
      mainScene.textHit!.destroy();
      mainScene.textStay!.destroy();
      mainScene.endHand(GameResult.BUST);
    }
  }

  private handleStay(mainScene: MainScene): void {
    mainScene.textStay!.destroy();
    mainScene.textHit!.destroy();
    mainScene.handleFlipOver(mainScene);
    setTimeout(
      mainScene.drawCardsUntil17,
      mainScene.CARD_FLIP_TIME,
      mainScene
    );
  }

  private handleDouble(mainScene: MainScene): void {
    mainScene.handOutCard(
      mainScene.playerHand as Hand,
      false
    );
    mainScene.setPlayerScoreText();
    if (mainScene.playerHand!.getBlackjackScore() > 21) {
      mainScene.textHit!.destroy();
      mainScene.textStay!.destroy();
      mainScene.endHand(GameResult.BUST);
    }
    // mainScene.textStay!.destroy();
    // mainScene.textHit!.destroy();
    mainScene.handleFlipOver(mainScene);
    setTimeout(
      mainScene.drawCardsUntil17,
      mainScene.CARD_FLIP_TIME,
      mainScene
    );
  }

  private handleSurrender(mainScene: MainScene) {
    mainScene.handOutCard(
      mainScene.playerHand as Hand,
      false
    );
    // mainScene.textStay!.destroy();
    // mainScene.textHit!.destroy();
    mainScene.endHand(GameResult.SURRENDER);
    mainScene.handleFlipOver(mainScene);
    setTimeout(
      mainScene.drawCardsUntil17,
      mainScene.CARD_FLIP_TIME,
      mainScene
    );
  }

  private drawCardsUntil17(mainScene: MainScene) {
    let dealerScore: number =
      mainScene.dealerHand!.getBlackjackScore();
    let playerScore: number =
      mainScene.playerHand!.getBlackjackScore();
    let result: unknown = null;
    if (
      dealerScore < 17 &&
      this.gamePhase !== 'Surrender'
    ) {
      mainScene.handOutCard(
        mainScene.dealerHand as Hand,
        false
      );
      setTimeout(
        mainScene.drawCardsUntil17,
        500,
        mainScene
      );
      return;
    }
    result = mainScene.deriveGameResult(
      dealerScore,
      playerScore,
      result as GameResult
    );
    setTimeout(
      mainScene.endHand.bind(mainScene),
      1000,
      result
    );
  }

  private deriveGameResult(
    dealerScore: number,
    playerScore: number,
    result: GameResult
  ) {
    if (this.gamePhase === 'Surrender') {
      result = GameResult.LOSS;
    } else {
      if (
        dealerScore > 21 ||
        (playerScore < 22 && playerScore > dealerScore)
      ) {
        result = GameResult.WIN;
      } else if (dealerScore === playerScore) {
        result = GameResult.PUSH;
      } else {
        result = GameResult.LOSS;
      }
      return result;
    }
  }

  private handleFlipOver(mainScene: MainScene) {
    mainScene.dealerHand!.getCards()!.forEach((card) => {
      if (card.getFaceDown()) {
        card.setFaceDown(false);
        let cardFront = mainScene.add.image(
          mainScene.faceDownImage!.x,
          mainScene.faceDownImage!.y,
          CARD_ATLAS_KEY,
          card.getAtlasFrame()
        );
        cardFront.setScale(0, 1);
        mainScene.flipOverCard(
          mainScene.faceDownImage as Image,
          cardFront
        );
      }
    });
    mainScene.setDealerScoreText();
  }

  private handOutCard(hand: Hand, faceDownCard: boolean) {
    let card = this.deck!.drawCard();
    let cardImage: Image;
    if (!faceDownCard) {
      hand.receiveCard(card!);
      cardImage = this.add.image(
        0,
        0,
        CARD_ATLAS_KEY,
        card!.getAtlasFrame()
      );
    } else {
      hand.receiveCardFaceDown(card!);
      cardImage = this.add.image(0, 0, 'cardBack');
      this.faceDownImage = cardImage;
    }
    let xOffset = (hand.getCards()!.length - 1) * 50;
    if (hand === this.playerHand) {
      this.createCardTween(
        cardImage,
        this.playerHandZone!.x + xOffset,
        this.playerHandZone!.y
      );
      this.setPlayerScoreText();
    } else {
      this.createCardTween(
        cardImage,
        this.dealerHandZone!.x + xOffset,
        this.dealerHandZone!.y,
        350
      );
      this.setDealerScoreText();
    }
  }

  private setDealerScoreText() {
    this.dealerScoreText!.setText(
      this.dealerHand!.getBlackjackScore() > 0
        ? 'Dealer Score: ' +
            this.dealerHand!.getBlackjackScore()
        : 'Dealer Score: 0'
    );
  }

  private setPlayerScoreText() {
    this.playerScoreText!.setText(
      this.playerHand!.getBlackjackScore() > 0
        ? 'Your Score: ' +
            this.playerHand!.getBlackjackScore()
        : 'Your Score: 0'
    );
  }

  private endHand(result: GameResult) {
    this.payout(result, this.gamePhase);
    this.payout(result, this.gamePhase);
    let graphics = this.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.75 }
    });
    let square = new Phaser.Geom.Rectangle(
      0,
      0,
      new Number(
        this.scene.manager.game.config.width
      ).valueOf(),
      new Number(
        this.scene.manager.game.config.height
      ).valueOf()
    );
    graphics.fillRectShape(square);
    let resultText: Text = this.add.text(
      0,
      0,
      <string>result,
      textStyle
    );
    resultText.setColor('#ffde3d');
    resultText.setStroke('#000000', 10);
    resultText.setFontSize(100);
    Phaser.Display.Align.In.LeftCenter(
      resultText,
      this.gameZone as Phaser.GameObjects.GameObject
    );
    this.input.once(
      'pointerdown',
      function (this: any) {
        //thisの型指定できていない
        this.input.once(
          'pointerup',
          function (this: any) {
            this.scene.start('BetScene');
          },
          this
        );
      },
      this
    );
  }

  //payout()を実装する　また、handleDouble()でhandlestay()の中身を使えるように

  private payout(result: GameResult, gamePhase: string) {
    if (gamePhase === 'Double') {
      if (result === GameResult.WIN) {
        this.betScene!.money += this.betScene!.bet * 2;
        // } else if (result === GameResult.BLACKJACK) {
        //   this.betScene!.money += Math.floor(
        //     this.betScene!.bet * 1.5
        //   );
      } else {
        this.betScene!.money -= this.betScene!.bet * 2;
      }
      this.updateMoneyText();
      let highScore = localStorage.getItem(
        HIGH_SCORE_STORAGE
      );
      if (
        !highScore ||
        this.betScene!.money >
          new Number(highScore).valueOf()
      ) {
        localStorage.setItem(
          HIGH_SCORE_STORAGE,
          new String(this.betScene!.money).valueOf()
        );
      }
    } else if (gamePhase === 'Surrender') {
      // 半分にするlogic
      this.betScene!.money -= this.betScene!.bet / 2;

      this.updateMoneyText();
      let highScore = localStorage.getItem(
        HIGH_SCORE_STORAGE
      );
      if (
        !highScore ||
        this.betScene!.money >
          new Number(highScore).valueOf()
      ) {
        localStorage.setItem(
          HIGH_SCORE_STORAGE,
          new String(this.betScene!.money).valueOf()
        );
      }
    } else {
      if (result === GameResult.WIN) {
        this.betScene!.money += this.betScene!.bet;
      } else if (result === GameResult.BLACKJACK) {
        this.betScene!.money += Math.floor(
          this.betScene!.bet * 1.5
        );
      } else {
        this.betScene!.money -= this.betScene!.bet;
      }
      this.updateMoneyText();
      let highScore = localStorage.getItem(
        HIGH_SCORE_STORAGE
      );
      if (
        !highScore ||
        this.betScene!.money >
          new Number(highScore).valueOf()
      ) {
        localStorage.setItem(
          HIGH_SCORE_STORAGE,
          new String(this.betScene!.money).valueOf()
        );
      }
    }
  }
}
