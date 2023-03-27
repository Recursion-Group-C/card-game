import {
  CARD_ATLAS_KEY,
  CARD_HEIGHT,
  CARD_WIDTH,
  CardFactory
} from '../Factories/cardFactory';
import { Deck } from '../models/deck';
import { Hand } from '../models/hand';
import {
  GUTTER_SIZE,
  HIGH_SCORE_STORAGE,
  textStyle
} from '../constants/constants';
import BetScene from './BetScene';
import { GameResult } from '../models/gameResult';
import Text = Phaser.GameObjects.Text;
import Texture = Phaser.Textures.Texture;
import Image = Phaser.GameObjects.Image;
import Zone = Phaser.GameObjects.Zone;

export default class MainScene extends Phaser.Scene {
  private dealerHand: Hand | undefined;
  private playerHand: Hand | undefined;
  private deck: Deck | undefined;
  private atlasTexture: Texture | undefined;
  private CARD_MARGIN: Number = 10;
  private dealerScoreText: Text | undefined;
  private playerScoreText: Text | undefined;
  private textHit: Text | undefined;
  private textStay: Text | undefined;
  private moneyText: Text | undefined;
  private cardImages: Image[] | undefined;
  private betScene: BetScene | undefined;
  private gameZone: Zone | undefined;
  private stayButton: Image | undefined;
  private hitButton: Image | undefined;
  private playerHandZone: Zone | undefined;
  private dealerHandZone: Zone | undefined;
  private faceDownImage: Image | undefined;
  private CARD_FLIP_TIME = 600;

  constructor() {
    super({
      key: 'MainScene'
    });
  }

  preload(): void {
    let cardFactory: CardFactory = new CardFactory(
      this,
      './../assets/playingCards.png',
      './../assets/playingCards.xml'
    );
    this.load.image(
      'cardBack',
      './../assets/card_back_red.png'
    );
    this.atlasTexture = this.textures.get(CARD_ATLAS_KEY);
    this.betScene = <BetScene>this.scene.get('BetScene');
    this.load.image(
      'orangeChip',
      './../assets/chipOrange.png'
    );
    this.load.image(
      'yellowChip',
      './../assets/chipYellow.png'
    );
  }

  create(): void {
    let width: number = new Number(
      this.scene.manager.game.config.width
    ).valueOf();
    let height: number = new Number(
      this.scene.manager.game.config.height
    ).valueOf();
    this.gameZone = this.add.zone(
      width * 0.5,
      height * 0.5,
      width,
      height
    );
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
    if (this.playerHand?.getBlackjackScore() === 21) {
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
    let betText: Text = this.add.text(0, 0, '', textStyle);

    this.updateMoneyText();
    this.updateBetText(betText);
  }

  private updateMoneyText(): void {
    this.moneyText?.setText(
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

  private drawCardsUntil17(mainScene: MainScene) {
    let dealerScore: number =
      mainScene.dealerHand!.getBlackjackScore();
    let playerScore: number =
      mainScene.playerHand!.getBlackjackScore();
    let result: unknown = null;
    if (dealerScore < 17) {
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
      500,
      result
    );
  }

  private deriveGameResult(
    dealerScore: number,
    playerScore: number,
    result: GameResult
  ) {
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
      'Dealer Score: ' +
        this.dealerHand!.getBlackjackScore()
    );
  }

  private setPlayerScoreText() {
    this.playerScoreText!.setText(
      'Your Score: ' + this.playerHand!.getBlackjackScore()
    );
  }

  private endHand(result: GameResult) {
    this.payout(result);
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
    resultText.setStroke('#000000', 5);
    resultText.setFontSize(60);
    Phaser.Display.Align.In.Center(
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

  private payout(result: GameResult) {
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
      this.betScene!.money > new Number(highScore).valueOf()
    ) {
      localStorage.setItem(
        HIGH_SCORE_STORAGE,
        new String(this.betScene!.money).valueOf()
      );
    }
  }
}
