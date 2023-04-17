import Card from '../../common/Factories/cardImage';
import Chip from '../../common/Factories/chipImage';
import Deck from '../../common/Factories/deckImage';
import Table from '../../common/Factories/tableScene';
import GAME from '../../common/constants/game';
import GamePhase from '../constants/gamePhase';
import GameResult from '../constants/gameResult';
import WarPlayer from '../models/WarPlayer';

export default class PlayScene extends Table {
  private warButton: Chip | undefined;

  private surrenderButton: Chip | undefined;

  constructor(config: any) {
    super('PlayScene', config);
  }

  create(): void {
    super.create();
    this.gamePhase = GamePhase.BETTING;
    this.players = [
      new WarPlayer('player', 0, 0, 'bet', 'Player', 0),
      new WarPlayer('house', 0, 0, 'bet', 'House', 0)
    ];

    this.resetAndShuffleDeck();

    this.createPlayerNameTexts();
    this.createPlayerHandZones(
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );

    this.dealInitialCards();
  }

  /**
   * ゲームの初期カードを配布する関数。
   * プレイヤー0、1の順番でカードを配り、カードの配布が完了したら比較処理を行う。
   */
  private dealInitialCards() {
    this.gamePhase = GamePhase.ACTING;
    this.dealCards();

    this.time.delayedCall(2000, () => {
      const result = this.deriveGameResult();

      if (result === GameResult.WIN) {
        this.gamePhase = GamePhase.END_OF_GAME;
        this.endHand(GameResult.WIN);
      } else if (result === GameResult.LOSS) {
        this.endHand(GameResult.LOSS);
      } else {
        if (this.canWar()) {
          this.createWarButton();
        }
        this.createSurrenderButton();
      }
    });
  }

  private createWarButton(): void {
    this.warButton = new Chip(
      this,
      this.config.width * 0.33,
      this.config.height * 0.5,
      GAME.TABLE.YELLOW_CHIP_KEY,
      'War'
    );

    this.warButton.setClickHandler(() => {
      if (this.warButton) {
        this.warButton.destroy();
      }
      if (this.surrenderButton) {
        this.surrenderButton.destroy();
      }

      this.setBetDouble();

      this.dealCards();

      this.time.delayedCall(2000, () => {
        const result = this.deriveGameResult();

        this.gamePhase = GamePhase.END_OF_GAME;
        if (result === GameResult.WIN) {
          this.endHand(GameResult.WAR_WIN);
        } else if (result === GameResult.LOSS) {
          this.endHand(GameResult.LOSS);
        } else {
          this.endHand(GameResult.WAR_TIE);
        }
      });
    });
  }

  private createSurrenderButton(): void {
    this.surrenderButton = new Chip(
      this,
      this.config.width * 0.66,
      this.config.height * 0.5,
      GAME.TABLE.YELLOW_CHIP_KEY,
      'Surrender'
    );

    this.surrenderButton.setClickHandler(() => {
      if (this.warButton) {
        this.warButton.destroy();
      }
      if (this.surrenderButton) {
        this.surrenderButton.destroy();
      }

      this.time.delayedCall(500, () => {
        this.endHand(GameResult.SURRENDER);
      });
    });
  }

  private canWar(): boolean {
    if (this.betScene) {
      return this.betScene.money >= this.betScene.bet * 2;
    }
    return false;
  }

  private dealCards(): void {
    this.time.delayedCall(500, () => {
      this.players.forEach((player, index) => {
        if (player.playerType === 'player') {
          this.handOutCard(
            this.deck as Deck,
            player as WarPlayer,
            this.playerHandZones[index].x,
            this.playerHandZones[index].y,
            false
          );
        } else if (player.playerType === 'house') {
          this.handOutCard(
            this.deck as Deck,
            player as WarPlayer,
            this.playerHandZones[index].x,
            this.playerHandZones[index].y,
            true
          );
        }
      });
    });

    this.time.delayedCall(1000, () => {
      this.players.forEach((player) => {
        player.hand.forEach((card) => {
          if (card.isFaceDown) {
            card.playFlipOverTween();
          }
        });
      });
    });
  }

  handOutCard(
    deck: Deck,
    player: WarPlayer,
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

  private deriveGameResult(): GameResult {
    let result: GameResult | undefined;
    const player = this.players[0];
    const playerHandScore = player.getHandScore();
    const house = this.players[1];
    const houseHandScore = house.getHandScore();

    if (playerHandScore > houseHandScore) {
      result = GameResult.WIN;
    } else if (playerHandScore < houseHandScore) {
      result = GameResult.LOSS;
    } else {
      result = GameResult.TIE;
    }
    return result;
  }

  payOut(result: GameResult) {
    if (this.betScene && this.betScene.money) {
      if (
        result === GameResult.WIN ||
        result === GameResult.WAR_TIE
      ) {
        this.betScene.money += this.betScene.bet * 2;
      } else if (result === GameResult.WAR_WIN) {
        this.betScene.money += this.betScene.bet * 1.5; // 最初の賭金は返却、追加分は2倍の配当
      } else if (result === GameResult.SURRENDER) {
        this.betScene.money -= this.betScene.bet * 0.5;
      } else {
        this.betScene.money -= this.betScene.bet;
      }
      this.setMoneyText(this.betScene.money);

      const highScore = localStorage.getItem(
        GAME.STORAGE.WAR_HIGH_SCORE_STORAGE
      );
      if (
        !highScore ||
        this.betScene.money > Number(highScore)
      ) {
        localStorage.setItem(
          GAME.STORAGE.WAR_HIGH_SCORE_STORAGE,
          String(this.betScene.money)
        );
      }
    }
  }

  playGameResultSound(result: string): void {
    if (
      result === GameResult.WIN ||
      result === GameResult.WAR_WIN ||
      result === GameResult.WAR_TIE
    ) {
      this.winGameSound?.play();
    } else {
      this.lossGameSound?.play();
    }
  }
}
