/* eslint-disable  */
import ImageUtility from '@/games/blackjack/utility/ImageUtility';
import game from '../../common/constants/game';
import style from '../../common/constants/style';
import BaseScene from '../../common/scenes/BaseScene';
import GameResult from '../constants/gameResult';
import WarTable from '../models/warTable';
import BetScene from './BetScene';
import Text = Phaser.GameObjects.Text;
import Texture = Phaser.Textures.Texture;
import Image = Phaser.GameObjects.Image;
import Zone = Phaser.GameObjects.Zone;

export default class MainScene extends BaseScene {
  private atlasTexture: Texture | undefined;

  //   private CARD_MARGIN: number = 10;

  private dealerScoreText: Text | undefined;

  private playerScoreText: Text | undefined;

  private textWar: Text | undefined;

  private textSurrender: Text | undefined;

  private moneyText: Text | undefined;

  private betText: Text | undefined;

  private cardImages: Image[] | undefined;

  private gameZone: Zone | undefined;

  private stayButton: Image | undefined;

  private warButton: Image | undefined;

  private surrenderButton: Image | undefined;

  private playerHandZone: Zone | undefined;

  private dealerHandZone: Zone | undefined;

  private faceDownImage: Image | undefined;

  private CARD_FLIP_TIME = 600;

  private warTable: WarTable | undefined;

  private betScene: BetScene | undefined;

  private initBet: number | undefined;

  constructor(config: any) {
    super('PlayScene', config);
    this.warTable = new WarTable(
      'betting',
      [1, 5, 10, 25, 50]
    );
  }

  create(): void {
    this.betScene = <BetScene>this.scene.get('BetScene');

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
      game.card.width,
      game.card.height
    );
    Phaser.Display.Align.To.BottomLeft(
      this.playerHandZone as Zone,
      this.playerScoreText as Phaser.GameObjects.GameObject,
      0,
      style.gutter_size
    );
    this.dealerHandZone = this.add.zone(
      0,
      0,
      game.card.width,
      game.card.height
    );
    Phaser.Display.Align.To.BottomLeft(
      this.dealerHandZone as Zone,
      this.dealerScoreText as Phaser.GameObjects.GameObject,
      0,
      style.gutter_size
    );

    this.initBet = this.betScene?.bet as number;

    console.log(this.warTable?.players[1].bet);
    this.betScene!.money -= this.betScene!.bet;
    this.updateMoneyText();
    this.dealInitialCards();
  }

  /**
   * ゲームの初期カードを配布する関数。
   * プレイヤー0、1の順番でカードを配り、カードの配布が完了したら比較処理を行う。
   */
  private async dealInitialCards() {
    await this.handOutCardAsync(0, false);
    await this.handOutCardAsync(1, false);

    this.warTable?.compareCards();
    console.log(this.warTable?.players[1].gameStatus);

    if (this.warTable?.players[1].gameStatus === 'win') {
      this.endHand(GameResult.WIN);
      this.warTable.clearPlayerHandsAndBets();
    } else if (
      this.warTable?.players[1].gameStatus === 'lose'
    ) {
      this.endHand(GameResult.LOSE);
      this.warTable.clearPlayerHandsAndBets();
    } else {
      // 引き分け処理
      //   this.endHand(GameResult.TIE);
      this.warTable?.clearPlayerHandsAndBets();
      this.setUpWarButton();
      this.setUpSurrenderButton();
    }
  }

  /**
   * 指定したプレイヤーにカードを配布する非同期関数。
   * 指定したプレイヤーにカードを配布し、500ミリ秒待機した後に処理を完了する。
   * @param playerIndex カードを配布するプレイヤーのインデックス
   * @param isFaceUp カードを表向きにするかどうかを指定するフラグ
   */
  private async handOutCardAsync(
    playerIndex: number,
    isFaceUp: boolean
  ) {
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );
    this.handOutCard(playerIndex, isFaceUp);
  }

  private setUpNewGame() {
    // this.setUpHitButton();
    this.setUpDealerScoreText();
    this.setUpPlayerScoreText();
  }

  private setUpWarButton(): void {
    this.warButton = this.add
      .image(
        this.gameZone!.width * 0.33,
        this.gameZone!.height * 0.5,
        'yellowChip'
      )
      .setScale(1.2 * 1);
    this.textWar = this.add.text(
      this.gameZone!.width * 0.33,
      this.gameZone!.height * 0.5,
      'War',
      style.text
    );
    Phaser.Display.Align.In.Center(
      this.textWar,
      this.warButton
    );
    this.warButton.setInteractive();
    this.setUpHoverStyles(this.warButton);

    this.warButton?.on('pointerdown', async () => {
      this.warButton?.destroy();
      this.textWar?.destroy();
      this.surrenderButton?.destroy();
      this.textSurrender?.destroy();

      this.setUpButtons();
      await this.handOutCardAsync(0, false);
      await this.handOutCardAsync(1, false);

      this.warTable?.compareCards();

      if (this.warTable?.players[1].gameStatus === 'win') {
        this.endHand(GameResult.WAR_WIN);
      } else if (
        this.warTable?.players[1].gameStatus === 'lose'
      ) {
        this.endHand(GameResult.LOSE);
      } else {
        this.endHand(GameResult.WAR_TIE);
      }
      this.warTable?.clearPlayerHandsAndBets();
    });
  }

  private setUpSurrenderButton(): void {
    this.surrenderButton = this.add
      .image(
        this.gameZone!.width * 0.66,
        this.gameZone!.height * 0.5,
        'yellowChip'
      )
      .setScale(1.2 * 1);
    this.textSurrender = this.add.text(
      this.gameZone!.width * 0.33,
      this.gameZone!.height * 0.5,
      'Surrender',
      style.text
    );
    Phaser.Display.Align.In.Center(
      this.textSurrender,
      this.surrenderButton
    );
    this.surrenderButton.setInteractive();
    this.setUpHoverStyles(this.surrenderButton);
    this.surrenderButton.on('pointerdown', () => {
      this.endHand(GameResult.SURRENDER);
      this.warTable?.clearPlayerHandsAndBets();
    });
  }

  private setUpButtons(): void {
    let whiteChip = this.add
      .image(200, 300, 'whiteChip')
      .setScale(this.betScene?.scale);
    whiteChip.setInteractive();
    whiteChip.setDataEnabled();
    whiteChip.data.set('value', 1);
    this.setUpHoverStyles(whiteChip);
    let add1 = this.add.text(175, 375, '1', style.text);

    let redChip = this.add
      .image(400, 300, 'redChip')
      .setScale(this.betScene?.scale);
    let add25 = this.add.text(360, 375, '25', style.text);
    redChip.setInteractive();
    redChip.setDataEnabled();
    redChip.data.set('value', 25);
    this.setUpHoverStyles(redChip);
    let blueChip = this.add
      .image(600, 300, 'blueChip')
      .setScale(this.betScene?.scale);
    blueChip.setInteractive();
    blueChip.setDataEnabled();
    blueChip.data.set('value', 100);
    this.setUpHoverStyles(blueChip);
    let add100 = this.add.text(550, 375, '100', style.text);
    this.data.set('money', 1000);
    let chips: Image[] = new Array<Image>();
    chips.push(whiteChip);
    chips.push(redChip);
    chips.push(blueChip);
    let clearButton = this.add
      .image(10, 500, 'yellowChip')
      .setScale(1.2 * this.betScene?.scale);
    let clearText = this.add.text(
      0,
      575,
      'Clear',
      style.text
    );
    let dealButton = this.add
      .image(30, 500, 'orangeChip')
      .setScale(1.2 * this.betScene?.scale);
    let dealText = this.add.text(0, 575, 'Bet', style.text);

    Phaser.Display.Align.In.BottomCenter(
      clearButton as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      -300,
      -(40 * this.betScene?.scale)
    );
    Phaser.Display.Align.In.BottomCenter(
      dealButton as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      300,
      -(40 * this.betScene?.scale)
    );
    Phaser.Display.Align.In.Center(
      redChip as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      0
    );
    Phaser.Display.Align.In.Center(
      blueChip as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      0
    );
    Phaser.Display.Align.In.Center(
      whiteChip as Image,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      0
    );
    clearButton.setInteractive();
    dealButton.setInteractive();
    this.setUpHoverStyles(clearButton);
    this.setUpHoverStyles(dealButton);
    clearButton.on(
      'pointerdown',
      () => {
        console.log(this.warTable?.players[1].bet);
        this.betScene!.bet = this.initBet as number;
        this.updateBetText();
      },
      this
    );
    dealButton.on(
      'pointerdown',
      () => {
        this.endHand(GameResult.WIN);
        this.warTable?.clearPlayerHandsAndBets();
      },
      this
    );

    const buttons: Image[] = new Array<Image>();
    ImageUtility.spaceOutImagesEvenlyHorizontally(
      buttons,
      this.scene
    );
    ImageUtility.spaceOutImagesEvenlyHorizontally(
      chips as Image[],
      this.scene as Phaser.Scenes.ScenePlugin
    );
    Phaser.Display.Align.In.Center(add1, whiteChip);
    Phaser.Display.Align.In.Center(add25, redChip);
    Phaser.Display.Align.In.Center(add100, blueChip);
    Phaser.Display.Align.In.Center(clearText, clearButton);
    Phaser.Display.Align.In.Center(dealText, dealButton);
    this.setUpBetButtonHandlers(chips);
  }

  private setUpBetButtonHandlers(buttons: Image[]) {
    buttons.forEach((button) => {
      button.on(
        'pointerdown',
        function (this: MainScene) {
          this.addChip(button.data.get('value'));
        },
        this
      );
    }, this);
  }

  private addChip(value: number) {
    this.betScene!.bet += value;
    if (this.betScene!.bet > this.betScene!.money)
      this.betScene!.bet = this.betScene!.money;
    let betText: Text = this.add.text(0, 0, '', style.text);

    this.updateBetText();
  }

  private setUpHoverStyles(image: Image) {
    image.on(
      'pointerover',
      function (this: any) {
        // thisの型指定できていない
        image.setScale(1.4 * 1);
      },
      this
    );
    image.on(
      'pointerout',
      function (this: any) {
        image.setScale(1 * 1);
      },
      this
    );
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

  private setUpMoneyText(): void {
    this.moneyText = this.add.text(0, 0, '', style.text);
    this.betText = this.add.text(0, 0, '', style.text);

    this.updateMoneyText();
    this.updateBetText();
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

  private updateBetText() {
    this.betText?.setText('Bet: $' + this.betScene?.bet);
    Phaser.Display.Align.To.BottomLeft(
      this.betText as Text,
      this.moneyText as Phaser.GameObjects.GameObject
    );
  }

  private setUpDealerScoreText(): void {
    this.dealerScoreText = this.add.text(
      0,
      200,
      '',
      style.text
    );
    // this.setDealerScoreText();
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
      style.text
    );
    // this.setPlayerScoreText();e
    Phaser.Display.Align.In.BottomCenter(
      this.playerScoreText,
      this.gameZone as Phaser.GameObjects.GameObject,
      0,
      -20
    );
  }

  private handOutCard(
    playerIndex: number,
    faceDownCard: boolean
  ) {
    let card = this.warTable?.getDeck().drawOne();
    // let card = new Card('H', '10');
    let cardImage: Image;

    if (!faceDownCard) {
      this.warTable!.players[playerIndex].addCardToHand(
        card!
      );
      cardImage = this.add.image(
        0,
        0,
        game.card.atlas_key,
        card!.getAtlasFrame()
      );
    } else {
      this.warTable!.players[playerIndex].addCardToHand(
        card!
      );
      cardImage = this.add.image(0, 0, 'cardBack');
      this.faceDownImage = cardImage;
    }

    let xOffset =
      (this.warTable!.players[playerIndex].hand.length -
        1) *
      50;
    if (playerIndex === 1) {
      // Player
      this.createCardTween(
        cardImage,
        this.playerHandZone!.x + xOffset,
        this.playerHandZone!.y - 350
      );
      //   this.setPlayerScoreText();
    } else {
      // House
      this.createCardTween(
        cardImage,
        this.dealerHandZone!.x + xOffset,
        this.dealerHandZone!.y,
        350
      );
      //   this.setDealerScoreText();
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

  private endHand(result: GameResult) {
    this.payout(result, 0);

    setTimeout(() => {
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
    }, 1000);
  }

  /**
   * ゲーム結果に応じて払い戻しを行う関数。
   * @param result ゲームの勝敗結果
   * @param additionalBet Warで追加されたベット額
   */
  private payout(
    result: GameResult,
    additionalBet: number
  ) {
    if (
      result === GameResult.WIN ||
      result === GameResult.WAR_TIE
    ) {
      this.betScene!.money += this.betScene!.bet * 2;
    } else if (result === GameResult.SURRENDER) {
      this.betScene!.money += this.betScene!.bet / 2;
    } else if (result === GameResult.WAR_WIN) {
      this.betScene!.money +=
        (this.betScene!.bet + additionalBet) * 2;
    } else {
      // プレイヤーが敗北した場合、ベット額を減算する
      //   this.betScene!.money -=
      //     this.betScene!.bet + additionalBet;
    }

    // 払い戻し後の所持金を画面に反映する
    this.updateMoneyText();

    // ハイスコアの更新を行う
    // let highScore = localStorage.getItem(
    //   HIGH_SCORE_STORAGE
    // );
    // if (
    //   !highScore ||
    //   this.betScene!.money > new Number(highScore).valueOf()
    // ) {
    //   localStorage.setItem(
    //     HIGH_SCORE_STORAGE,
    //     new String(this.betScene!.money).valueOf()
    //   );
    // }
  }
}
