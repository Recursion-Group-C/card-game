import Card from '../../common/Factories/cardImage';
import Chip from '../../common/Factories/chipImage';
import Deck from '../../common/Factories/deckImage';
import Table from '../../common/Factories/tableScene';

import GAME from '../../common/constants/game';
import STYLE from '../../common/constants/style';
import GamePhase from '../constants/gamePhase';
import GameResult from '../constants/gameResult';

import BlackjackPlayer from '../models/BlackjackPlayer';

import ImageUtility from '../../common/utility/ImageUtility';

import Text = Phaser.GameObjects.Text;
import Zone = Phaser.GameObjects.Zone;
import TimeEvent = Phaser.Time.TimerEvent;

export default class PlayScene extends Table {
  private playerScoreTexts: Array<Text> = [];

  private standButton: Chip | undefined;

  private hitButton: Chip | undefined;

  private doubleButton: Chip | undefined;

  private surrenderButton: Chip | undefined;

  private timeEvent: TimeEvent | undefined;

  constructor(config: any) {
    super('PlayScene', config);
  }

  create(): void {
    super.create();
    this.gamePhase = GamePhase.BETTING;
    this.players = [
      new BlackjackPlayer(
        'player',
        0,
        0,
        'ready',
        'Player',
        0
      ),
      new BlackjackPlayer(
        'house',
        0,
        0,
        'ready',
        'House',
        0
      )
    ];

    this.createPlayerNameTexts();
    this.createPlayerHandZones(
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );
    this.createPlayerScoreTexts();

    this.resetAndShuffleDeck();
    this.dealInitialCards();

    this.time.delayedCall(1500, () => {
      this.gamePhase = GamePhase.ACTING;
      this.createButtons();
    });
  }

  update(): void {
    let result: GameResult | undefined;

    if (this.gamePhase === GamePhase.ROUND_OVER) {
      result = this.deriveGameResult();
    }

    if (
      this.gamePhase === GamePhase.END_OF_GAME &&
      result
    ) {
      this.time.delayedCall(1000, () => {
        this.endHand(result as GameResult);
      });
    }
  }

  private dealInitialCards() {
    const player = this.players[0];
    const playerHandZone = this.playerHandZones[0];
    const house = this.players[1];
    const houseHandZone = this.playerHandZones[1];

    this.time.delayedCall(300, () => {
      if (this.deck) {
        this.handOutCard(
          this.deck,
          player,
          playerHandZone.x - GAME.CARD.WIDTH * 0.15,
          playerHandZone.y,
          false
        );
      }
    });

    this.time.delayedCall(600, () => {
      if (this.deck) {
        this.handOutCard(
          this.deck,
          house,
          houseHandZone.x - GAME.CARD.WIDTH * 0.15,
          houseHandZone.y,
          false
        );
      }
    });

    this.time.delayedCall(900, () => {
      if (this.deck) {
        this.handOutCard(
          this.deck,
          player,
          playerHandZone.x + GAME.CARD.WIDTH * 0.15,
          playerHandZone.y,
          false
        );
      }
    });

    this.time.delayedCall(1200, () => {
      if (this.deck) {
        this.handOutCard(
          this.deck,
          house,
          houseHandZone.x + GAME.CARD.WIDTH * 0.15,
          houseHandZone.y,
          true
        );
      }
      this.setPlayerScoreTexts(true);
    });
  }

  private createPlayerScoreTexts(): void {
    this.playerScoreTexts = []; // 前回のゲームで作成したものが残っている可能性があるので、初期化する
    this.players.forEach((player, index) => {
      const playerScoreText = this.add.text(
        0,
        200,
        '',
        STYLE.TEXT
      );

      if (player.playerType === 'player') {
        Phaser.Display.Align.To.TopCenter(
          playerScoreText as Text,
          this.playerHandZones[index] as Zone,
          0,
          0
        );
      } else if (player.playerType === 'house') {
        Phaser.Display.Align.To.BottomCenter(
          playerScoreText as Text,
          this.playerHandZones[index] as Zone,
          0,
          0
        );
      }

      this.playerScoreTexts.push(playerScoreText);
    });
  }

  private setPlayerScoreTexts(disableHouse: boolean): void {
    this.players.forEach((player, index) => {
      const playerScoreText = this.playerScoreTexts[index];

      if (player.playerType === 'player') {
        playerScoreText.setText(
          String(player.getHandScore())
        );
        Phaser.Display.Align.To.TopCenter(
          playerScoreText as Text,
          this.playerHandZones[index] as Zone,
          0,
          0
        );
      } else if (player.playerType === 'house') {
        if (!disableHouse) {
          playerScoreText.setText(
            String(player.getHandScore())
          );
        }
        Phaser.Display.Align.To.BottomCenter(
          playerScoreText as Text,
          this.playerHandZones[index] as Zone,
          0,
          0
        );
      }
    });
  }

  private createButtons(): void {
    this.createStandButton();
    this.createHitButton();
    this.createDoubleButton();
    this.createSurrenderButton();

    const buttons: Chip[] = new Array<Chip>();
    buttons.push(this.standButton as Chip);
    buttons.push(this.hitButton as Chip);
    buttons.push(this.doubleButton as Chip);
    buttons.push(this.surrenderButton as Chip);

    ImageUtility.spaceOutImagesEvenlyHorizontally(
      buttons,
      this.scene
    );
  }

  private destroyButtons(): void {
    this.hitButton?.destroy();
    this.standButton?.destroy();
    this.doubleButton?.destroy();
    this.surrenderButton?.destroy();
  }

  private createHitButton(): void {
    const buttonHeight = Number(this.config.height) / 2;
    this.hitButton = new Chip(
      this,
      0,
      buttonHeight,
      GAME.TABLE.YELLOW_CHIP_KEY,
      'Hit'
    );
    this.hitButton.setClickHandler(() => this.handleHit());
  }

  private createStandButton(): void {
    const buttonHeight = Number(this.config.height) / 2;
    this.standButton = new Chip(
      this,
      0,
      buttonHeight,
      GAME.TABLE.ORANGE_CHIP_KEY,
      'Stand'
    );
    this.standButton.setClickHandler(() =>
      this.handleStand()
    );
  }

  private createDoubleButton(): void {
    const buttonHeight = Number(this.config.height) / 2;

    this.doubleButton = new Chip(
      this,
      0,
      buttonHeight,
      GAME.TABLE.WHITE_CHIP_KEY,
      'Double'
    );
    this.doubleButton.setClickHandler(() =>
      this.handleDouble()
    );
  }

  private createSurrenderButton() {
    const buttonHeight = Number(this.config.height) / 2;

    this.surrenderButton = new Chip(
      this,
      0,
      buttonHeight,
      GAME.TABLE.BLUE_CHIP_KEY,
      'Surrender'
    );
    this.surrenderButton.setClickHandler(() =>
      this.handleSurrender()
    );
  }

  private playHouseFlipOver(): void {
    const house = this.players[1];
    house.hand.forEach((card) => {
      if (card.isFaceDown) {
        card.playFlipOverTween();
      }
    });
  }

  private handleHit(): void {
    const player = this.players[0];
    const playerHandZone = this.playerHandZones[0];
    player.gameStatus = 'hit';

    this.doubleButton?.destroy();

    this.handOutCard(
      this.deck as Deck,
      player,
      playerHandZone.x +
        GAME.CARD.WIDTH *
          (player.getHandSize() * 0.3 - 0.15),
      playerHandZone.y,
      false
    );
    this.setPlayerScoreTexts(true);

    if (player.getHandScore() > 21) {
      this.destroyButtons();
      this.playHouseFlipOver();
      this.setPlayerScoreTexts(false);
      player.gameStatus = 'bust';
      this.gamePhase = GamePhase.ROUND_OVER;
    }
  }

  private handleStand(): void {
    const player = this.players[0];

    this.playHouseFlipOver();
    this.setPlayerScoreTexts(false);
    this.destroyButtons();

    if (PlayScene.isBlackjack(player)) {
      player.gameStatus = 'blackjack';
    } else {
      player.gameStatus = 'stand';
    }

    this.time.delayedCall(1000, () =>
      this.drawCardsUntil17()
    );
  }

  private handleDouble(): void {
    const player = this.players[0];
    const playerHandZone = this.playerHandZones[0];

    this.setBetDouble();

    this.handOutCard(
      this.deck as Deck,
      player,
      playerHandZone.x +
        GAME.CARD.WIDTH *
          (player.getHandSize() * 0.3 - 0.15),
      playerHandZone.y,
      false
    );

    this.handleStand();

    if (player.getHandScore() > 21) {
      player.gameStatus = 'bust';
    }
  }

  private handleSurrender() {
    const player = this.players[0];
    const house = this.players[1];

    this.destroyButtons();
    player.gameStatus = 'surrender';
    house.gameStatus = 'stand';

    this.gamePhase = GamePhase.ROUND_OVER;
  }

  private drawCardsUntil17(): void {
    const house = this.players[1];
    const houseHandZone = this.playerHandZones[1];

    this.timeEvent = this.time.addEvent({
      delay: 800,
      callback: () => {
        const houseScore = house.getHandScore();
        if (houseScore < 17) {
          house.gameStatus = 'hit';
          this.handOutCard(
            this.deck as Deck,
            house,
            houseHandZone.x +
              GAME.CARD.WIDTH *
                (house.getHandSize() * 0.3 - 0.15),
            houseHandZone.y,
            false
          );
          this.setPlayerScoreTexts(false);
        } else {
          if (this.timeEvent) this.timeEvent.remove();
          if (house.getHandScore() > 21) {
            house.gameStatus = 'bust';
          } else if (PlayScene.isBlackjack(house)) {
            house.gameStatus = 'blackjack';
          } else {
            house.gameStatus = 'stand';
          }
          this.gamePhase = GamePhase.ROUND_OVER;
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  private static isBlackjack(
    player: BlackjackPlayer
  ): boolean {
    return (
      player.getHandSize() === 2 &&
      player.getHandScore() === 21
    );
  }

  private deriveGameResult(): GameResult | undefined {
    let result: GameResult | undefined;
    const player = this.players[0];
    const playerHandScore = player.getHandScore();
    const house = this.players[1];
    const houseHandScore = house.getHandScore();

    if (player.gameStatus === 'bust') {
      result = GameResult.BUST;
    } else if (player.gameStatus === 'blackjack') {
      if (house.gameStatus === 'blackjack') {
        result = GameResult.PUSH;
      } else {
        result = GameResult.BLACKJACK;
      }
    } else if (player.gameStatus === 'stand') {
      if (
        house.gameStatus === 'bust' ||
        playerHandScore > houseHandScore
      ) {
        result = GameResult.WIN;
      } else if (
        house.gameStatus === 'blackjack' ||
        houseHandScore > playerHandScore
      ) {
        result = GameResult.LOSS;
      } else if (houseHandScore === playerHandScore) {
        result = GameResult.PUSH;
      }
    } else if (player.gameStatus === 'surrender') {
      result = GameResult.SURRENDER;
    }
    this.gamePhase = GamePhase.END_OF_GAME;
    return result;
  }

  handOutCard(
    deck: Deck,
    player: BlackjackPlayer,
    toX: number,
    toY: number,
    isFaceDown: boolean
  ): void {
    const card: Card | undefined = deck.drawOne();

    if (card) {
      if (!isFaceDown) {
        card.setFaceUp();
      }
      player.addCardToHand(card);
      this.children.bringToTop(card);
      card.playMoveTween(toX, toY);
    }
  }

  payOut(result: GameResult) {
    if (this.betScene && this.betScene.money) {
      if (result === GameResult.WIN) {
        this.betScene.money += this.betScene.bet;
      } else if (result === GameResult.BLACKJACK) {
        this.betScene.money += this.betScene.bet * 1.5;
      } else if (result === GameResult.SURRENDER) {
        this.betScene.money -= this.betScene.bet * 0.5;
      } else if (
        result === GameResult.LOSS ||
        result === GameResult.BUST
      ) {
        this.betScene.money -= this.betScene.bet;
      }
      this.setMoneyText(this.betScene.money);

      const highScore = localStorage.getItem(
        GAME.STORAGE.BLACKJACK_HIGH_SCORE_STORAGE
      );
      if (
        !highScore ||
        this.betScene.money > Number(highScore)
      ) {
        localStorage.setItem(
          GAME.STORAGE.BLACKJACK_HIGH_SCORE_STORAGE,
          String(this.betScene.money)
        );
      }
    }
  }

  playGameResultSound(result: string): void {
    if (
      result === GameResult.WIN ||
      result === GameResult.BLACKJACK
    ) {
      this.winGameSound?.play();
    } else {
      this.lossGameSound?.play();
    }
  }
}
