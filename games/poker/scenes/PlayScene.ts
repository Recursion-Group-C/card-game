import STYLE from '@/games/common/constants/style';
import Button from '../../common/Factories/button';
import Card from '../../common/Factories/cardImage';
import Deck from '../../common/Factories/deckImage';
import Table from '../../common/Factories/tableScene';
import GAME from '../../common/constants/game';
import GameResult from '../constants/gameResult';
import PokerPlayer from '../models/pokerPlayer';
import GameStatus from '../constants/gameStatus';
import DealerButton from '../models/dealerButton';

import Zone = Phaser.GameObjects.Zone;
import Pot from '../models/pot';
import PlayerAction from '../constants/playerAction';
import PlayerBettingStatus from '../models/playerBettingStatus';

// プレイヤーが支払うアンティの金額
const ANTE_AMOUNT = 20;

export default class PlayScene extends Table {
  private pot: Pot | undefined;

  private raiseButton: Button | undefined;

  private callButton: Button | undefined;

  private foldButton: Button | undefined;

  private checkButton: Button | undefined;

  private changeHandButton: Button | undefined;

  private dealerButton: DealerButton | undefined;

  private player: PokerPlayer;

  private playerMoney: number;

  private playerBet: number;

  /**
   * ベッティングラウンドでの現在の最低ベット額
   */
  private currentBetAmount: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: any) {
    super('PlayScene', config);
    this.players = [
      new PokerPlayer(
        'player',
        0,
        0,
        GameStatus.FIRST_BETTING,
        'Player',
        0
      ),
      new PokerPlayer(
        'cpu',
        0,
        0,
        GameStatus.FIRST_BETTING,
        'IORI',
        0
      )
    ];

    this.player = this.players[0] as PokerPlayer;
    this.playerMoney = GAME.PLAYER.CHIPS;
    this.playerBet = 0;
    this.currentBetAmount = 0;
  }

  create(): void {
    super.create();
    this.createPot();
    this.resetAndShuffleDeck(0, -600);

    this.createPlayerNameTexts();
    this.createPlayerHandZones(
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );

    this.dealInitialCards();
    this.createDealerButton(this.playerHandZones[0]);

    this.time.delayedCall(2000, () => {
      this.PlayAnte();
      this.createActionPanel();
    });
  }

  /**
   * ゲームの初期カードを配布する関数。
   * プレイヤー0、1の順番でカードを配り、カードの配布が完了したら比較処理を行う。
   */
  private dealInitialCards(): void {
    this.time.delayedCall(500, () => {
      this.players.forEach((player, index) => {
        if (player.playerType === 'player') {
          for (let i = 0; i < 5; i += 1) {
            this.handOutCard(
              this.deck as Deck,
              player as PokerPlayer,
              this.playerHandZones[index].x -
                (GAME.CARD.WIDTH + 10) * 2 +
                i * (GAME.CARD.WIDTH + 10),
              this.playerHandZones[index].y,
              true
            );
          }
        } else if (player.playerType === 'cpu') {
          for (let i = 0; i < 5; i += 1) {
            this.handOutCard(
              this.deck as Deck,
              player as PokerPlayer,
              this.playerHandZones[index].x -
                (GAME.CARD.WIDTH + 10) * 2 +
                i * (GAME.CARD.WIDTH + 10),
              this.playerHandZones[index].y,
              true
            );
          }
        }
      });
    });

    this.time.delayedCall(1500, () => {
      this.player.hand.forEach((card) => {
        if (card.isFaceDown) {
          card.playFlipOverTween();
        }
      });
    });
  }

  /**
   * デッキから1枚カードを引き、指定された位置に配る関数
   * @param deck - カードを引く元となるDeck
   * @param player - カードを配る先のPokerPlayer
   * @param toX - カードを配る先のx座標
   * @param toY - カードを配る先のy座標
   * @param isFaceDown - カードを裏向きにする場合はtrue、表向きにする場合はfalse
   * @returns なし
   */
  handOutCard(
    deck: Deck,
    player: PokerPlayer,
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

  private createPot(): void {
    this.pot = new Pot(
      this,
      this.config.width / 2,
      this.config.height / 2,
      GAME.TABLE.WHITE_CHIP_KEY,
      0
    );
  }

  private createDealerButton(playerHandZone: Zone): void {
    this.dealerButton = new DealerButton(
      this,
      playerHandZone.x - 300,
      playerHandZone.y + 150,
      GAME.TABLE.YELLOW_CHIP_KEY
    );
  }

  private createActionPanel(): void {
    this.createRaiseButton();

    if (this.currentBetAmount === 0) {
      this.createCheckButton();
    } else this.createCallButton();

    this.createFoldButton();
  }

  private destroyActionPanel(): void {
    this.raiseButton?.destroy();
    this.callButton?.destroy();
    this.checkButton?.destroy();
    this.foldButton?.destroy();
  }

  private createRaiseButton(): void {
    this.raiseButton = new Button(
      this,
      this.config.width * 0.95,
      this.config.height * 0.9,
      GAME.TABLE.YELLOW_CHIP_KEY,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'RAISE'
    );

    this.raiseButton.setClickHandler(() => {
      this.addRaiseAmount();
      this.playerBet += this.currentBetAmount;
      this.playerMoney -= this.playerBet;
      this.player.addBet(this.playerBet);
      this.player.gameStatus = GameStatus.CHANGE_CARD;

      // TODO: チップアニメーション追加
      this.time.delayedCall(500, () => {
        this.setMoneyText(this.playerMoney);
        this.setBetText(this.playerBet);
        this.pot?.setAmount(this.currentBetAmount);
        this.destroyActionPanel();

        this.nextPlayerTurnOnFirstBettingRound(1);
      });
    });
  }

  /**
   * raiseによってcurrentBetAmountを増加させる。
   */
  private addRaiseAmount(): void {
    const raiseAmount = this.currentBetAmount + 100;
    this.currentBetAmount = raiseAmount;
  }

  private createCallButton(): void {
    this.callButton = new Button(
      this,
      this.config.width * 0.87,
      this.config.height * 0.9,
      GAME.TABLE.YELLOW_CHIP_KEY,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'CALL'
    );

    this.callButton.setClickHandler(() => {
      this.playerBet += this.currentBetAmount;
      this.playerMoney -= this.playerBet;
      this.player.gameStatus = GameStatus.CHANGE_CARD;

      // TODO: チップアニメーション追加
      this.time.delayedCall(500, () => {
        this.setMoneyText(this.playerMoney);
        this.setBetText(this.playerBet);
        this.pot?.setAmount(this.currentBetAmount);
        this.destroyActionPanel();

        this.nextPlayerTurnOnFirstBettingRound(1);
      });
    });
  }

  private createCheckButton(): void {
    this.checkButton = new Button(
      this,
      this.config.width * 0.87,
      this.config.height * 0.9,
      GAME.TABLE.YELLOW_CHIP_KEY,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'CHECK'
    );

    this.checkButton.setClickHandler(() => {
      this.player.gameStatus = GameStatus.CHANGE_CARD;
      // TODO: チップアニメーション追加
      this.time.delayedCall(500, () => {
        this.destroyActionPanel();
        this.nextPlayerTurnOnFirstBettingRound(1);
      });
    });
  }

  private createFoldButton(): void {
    this.foldButton = new Button(
      this,
      this.config.width * 0.79,
      this.config.height * 0.9,
      GAME.TABLE.YELLOW_CHIP_KEY,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'FOLD'
    );

    this.foldButton.setClickHandler(() => {
      this.player.gameStatus = GameStatus.FOLDED;
      this.player.hand.forEach((card) => {
        card.playMoveTween(this.config.width / 2, -600);
      });
      this.nextPlayerTurnOnFirstBettingRound(1);
    });
  }

  // TODO: チップアニメーション追加
  private PlayAnte(): void {
    this.players.forEach((player) => {
      if (player.playerType === 'player') {
        this.playerMoney -= ANTE_AMOUNT;
        this.playerBet += ANTE_AMOUNT;
        this.setMoneyText(this.playerMoney);
        this.setBetText(this.playerBet);
      }

      this.pot?.setAmount(ANTE_AMOUNT);
    });
  }

  /**
   * 1巡目のベッティングラウンド
   * @param playerIndex
   * @returns
   */
  private nextPlayerTurnOnFirstBettingRound(
    playerIndex: number
  ): void {
    // TODO: ネスト浅くする
    if (this.isFirstBettingEnd()) {
      if (!this.hasEnoughPlayers()) {
        // ノーコンテスト
        if (this.player.gameStatus === GameStatus.FOLDED) {
          this.noContest(GameResult.LOSS);
        }
        this.noContest(GameResult.WIN);
        return;
      }

      this.nextPlayerTurnOnChangeHandRound(playerIndex);
      return;
    }

    let currentPlayerIndex = playerIndex;
    if (playerIndex > this.players.length - 1)
      currentPlayerIndex = 0;

    if (
      this.players[currentPlayerIndex].playerType ===
      'player'
    ) {
      this.createActionPanel();
    } else {
      this.cpuBettingAction(currentPlayerIndex);
    }
  }

  /**
   * ハンド交換を行うラウンド
   */
  private nextPlayerTurnOnChangeHandRound(
    playerIndex: number
  ): void {
    if (this.isChangeHandRoundEnd()) {
      this.currentBetAmount = 0;
      this.clearPlayersBet();
      this.nextPlayerTurnOnSecondBettingRound(playerIndex);
      return;
    }

    let currentPlayerIndex = playerIndex;
    if (playerIndex > this.players.length - 1)
      currentPlayerIndex = 0;

    if (
      this.players[currentPlayerIndex].playerType ===
      'player'
    ) {
      // カード交換処理
      this.createChageHandButton();
      this.enableHandSelection();
    } else {
      this.cpuChangeHand(playerIndex);
    }
  }

  private clearPlayersBet(): void {
    this.players.forEach((player) => {
      player.clearBet();
    });
  }

  /**
   * 2巡目のベッティングラウンド
   * @param playerIndex
   */
  private nextPlayerTurnOnSecondBettingRound(
    playerIndex: number
  ): void {
    if (this.isSecondBettingEnd()) {
      // TODO: 役名を表示する
      console.log(this.compareAllHands());
    }

    let currentPlayerIndex = playerIndex;
    if (playerIndex > this.players.length - 1)
      currentPlayerIndex = 0;

    if (
      this.players[currentPlayerIndex].playerType ===
      'player'
    ) {
      this.createActionPanel();
    } else {
      this.cpuBettingAction(currentPlayerIndex);
    }
  }

  /**
   * 現在のプレイヤー数が2人以上かどうかを判定する
   *
   * @remarks
   * フォールドしたプレイヤーはプレイヤー数のカウントから除外される
   *
   * @returns プレイヤー数が2人以上の場合は`true`、それ以外の場合は`false`を返す。
   */
  private hasEnoughPlayers(): boolean {
    return (
      this.players.filter(
        (player) => player.gameStatus !== GameStatus.FOLDED
      ).length >= 2
    );
  }

  /**
   * 全員のベッティングが終了しているかどうかを判定する
   *
   * @privateRemarks
   * 全員がcurrentBetAmountと同じベット額がどうかの判定。
   * @returns 全員のベッティングが終了している場合は true、そうでない場合は false
   */
  private isFirstBettingEnd(): boolean {
    return this.players.every(
      (player) =>
        player.gameStatus !== GameStatus.FIRST_BETTING &&
        player.bet === this.currentBetAmount
    );
  }

  /**
   * すべてのプレイヤーの手札交換が終了したかどうかを判定
   */
  private isChangeHandRoundEnd(): boolean {
    let isEnd = true;
    this.players.forEach((player) => {
      if (player.gameStatus === GameStatus.CHANGE_CARD) {
        isEnd = false;
      }
    });
    return isEnd;
  }

  private isSecondBettingEnd(): boolean {
    return this.players.every(
      (player) =>
        player.gameStatus !== GameStatus.SECOND_BETTING &&
        player.bet === this.currentBetAmount
    );
  }

  // TODO: 難易度調整
  private cpuBettingAction(playerIndex: number): void {
    const decisionValues = Object.values(PlayerAction);
    const decisionIndex = Math.floor(
      Math.random() * decisionValues.length
    );
    let decisionValue = decisionValues[decisionIndex];
    if (
      this.currentBetAmount !== 0 &&
      decisionValue === PlayerAction.CHECK
    ) {
      decisionValue = PlayerAction.CALL;
    }

    if (decisionValue === PlayerAction.FOLD) {
      this.players[playerIndex].gameStatus =
        GameStatus.FOLDED;
      this.createCpuBettingStatus(PlayerAction.FOLD);
      this.players[playerIndex].hand.forEach((card) => {
        card.playMoveTween(this.config.width / 2, -600);
      });
    }
    if (decisionValue === PlayerAction.RAISE) {
      this.addRaiseAmount();
      this.players[playerIndex].addBet(
        this.currentBetAmount
      );
      this.pot?.setAmount(this.currentBetAmount);
      this.createCpuBettingStatus(PlayerAction.RAISE);
    }
    if (decisionValue === PlayerAction.CALL) {
      this.players[playerIndex].addBet(
        this.currentBetAmount
      );
      this.pot?.setAmount(this.currentBetAmount);
      this.createCpuBettingStatus(PlayerAction.CALL);
    }

    // playerのstatus変更
    if (
      this.players[playerIndex].gameStatus ===
      GameStatus.FIRST_BETTING
    ) {
      this.players[playerIndex].gameStatus =
        GameStatus.CHANGE_CARD;
    } else {
      // dfsa
      this.players[playerIndex].gameStatus =
        GameStatus.SECOND_BETTING;
    }

    // 現在のベット額を表示
    const nextPlayerIndex = playerIndex + 1;
    this.nextPlayerTurnOnFirstBettingRound(nextPlayerIndex);
  }

  private cpuChangeHand(playerIndex: number): void {
    const selectedCards: Card[] = [];

    this.players[playerIndex].gameStatus =
      GameStatus.SECOND_BETTING;
    // カードをランダムに選ぶ処理
    this.players[playerIndex].hand.forEach((card) => {
      const randamNum = Math.random();
      if (randamNum > 0.5) selectedCards.push(card);
    });

    if (selectedCards.length === 0) return;

    selectedCards.forEach((card) => {
      this.players[playerIndex].removeCardFromHand(card);
      card.setOriginalPosition();
      card.playMoveTween(this.config.width / 2, -600);
    });

    this.time.delayedCall(500, () => {
      selectedCards.forEach((card) => {
        this.handOutCard(
          this.deck as Deck,
          this.player as PokerPlayer,
          card.originalPositionX as number,
          card.originalPositionY as number,
          true
        );
      });

      const nextPlayerIndex = playerIndex + 1;
      this.nextPlayerTurnOnChangeHandRound(nextPlayerIndex);
    });
  }

  private createCpuBettingStatus(status: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cpuBettingStatus = new PlayerBettingStatus(
      this,
      this.playerHandZones[1].x + 300,
      this.playerHandZones[1].y - 150,
      GAME.TABLE.RED_CHIP_KEY,
      status
    );

    if (status === PlayerAction.RAISE) {
      cpuBettingStatus.setAmount(
        PlayerAction.RAISE,
        this.currentBetAmount
      );
    }
    if (status === PlayerAction.CALL) {
      cpuBettingStatus.setAmount(
        PlayerAction.CALL,
        this.currentBetAmount
      );
    }
  }

  private createChageHandButton(): void {
    this.changeHandButton = new Button(
      this,
      this.config.width * 0.1,
      this.config.height * 0.9,
      GAME.TABLE.ORANGE_CHIP_KEY,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'CHANGE'
    );

    // カード交換処理
    this.changeHandButton.setClickHandler(() => {
      this.disableHandSelection();
      this.changeHandButton?.destroy();
      this.player.gameStatus = GameStatus.SECOND_BETTING;

      const selectedCards: Card[] = [];
      this.player.hand.forEach((card) => {
        if (card.isMoveUp()) {
          card.playMoveTween(this.config.width / 2, -600);
          selectedCards.push(card);
        }
      });

      selectedCards.forEach((card) => {
        this.player.removeCardFromHand(card);
      });

      this.time.delayedCall(500, () => {
        selectedCards.forEach((card) => {
          this.handOutCard(
            this.deck as Deck,
            this.player as PokerPlayer,
            card.originalPositionX as number,
            card.originalPositionY as number,
            true
          );
        });
      });

      this.time.delayedCall(1000, () => {
        this.player.hand.forEach((card) => {
          if (card.isFaceDown) {
            card.playFlipOverTween();
          }
          this.nextPlayerTurnOnChangeHandRound(1);
        });
      });
    });
  }

  /**
   * ハンドを選択可能にする
   */
  private enableHandSelection(): void {
    this.player.hand.forEach((card) => {
      card.enableClick();
    });
  }

  /**
   * ハンドを選択不可にする。
   */
  private disableHandSelection(): void {
    this.player.hand.forEach((card) => {
      card.disableClick();
    });
  }

  /**
   * 参加プレイヤーの手札をランクの高い順にソートし、最も強い手役を持つプレイヤーを選択する。
   * 強さが同じ場合は高いランクのカードで決定する。
   * @returns 勝利したプレイヤーの配列
   */
  private compareAllHands(): PokerPlayer[] {
    const players = (this.players as PokerPlayer[]).filter(
      (player) => player.gameStatus !== GameStatus.FOLDED
    );
    const sortedPlayers = players.sort((a, b) => {
      const aRank = a.getHandRank();
      const bRank = b.getHandRank();

      if (aRank > bRank) {
        return -1;
      }
      if (aRank < bRank) {
        return 1;
      }
      const aHighCard = a.getHandRank();
      const bHighCard = b.getHandRank();

      if (aHighCard > bHighCard) {
        return -1;
      }
      if (aHighCard < bHighCard) {
        return 1;
      }
      return 0;
    });

    const maxRank = sortedPlayers[0].getHandRank();
    const winners = sortedPlayers.filter(
      (player) => player.getHandRank() === maxRank
    );

    return winners;
  }

  private noContest(result: GameResult): void {
    this.destroyActionPanel();
    this.payOut(result);
    const noContestText = this.add
      .text(
        this.config.width / 2,
        this.config.height / 2,
        'No Contest!',
        STYLE.TEXT
      )
      .setOrigin(0.5)
      .setDepth(10);

    // 初期化
    this.resetRound();

    this.time.delayedCall(3000, () => {
      noContestText.destroy();
      this.dealInitialCards();
      this.createDealerButton(this.playerHandZones[0]);
      console.log(this.playerBet);
      this.PlayAnte();
    });

    this.time.delayedCall(4000, () => {
      this.createActionPanel();
    });

    // this.dealCards();
  }

  // private showWinnigPlayer(players: PokerPlayer[]): void {
  //   const winners = this.compareAllHands();
  //   winners.forEach(() => {

  //   })
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  payOut(result: GameResult) {
    // TODO
    if (result === GameResult.WIN) {
      this.playerMoney += this.pot?.getAmount() as number;
    }
    if (result === GameResult.TIE) {
      this.playerMoney +=
        (this.pot?.getAmount() as number) / 2;
    }
    if (result === GameResult.LOSS) {
      this.playerMoney -= this.playerBet;
    }
    this.setMoneyText(this.playerMoney);

    const highScore = localStorage.getItem(
      GAME.STORAGE.WAR_HIGH_SCORE_STORAGE
    );
    if (
      !highScore ||
      this.playerMoney > Number(highScore)
    ) {
      localStorage.setItem(
        GAME.STORAGE.WAR_HIGH_SCORE_STORAGE,
        String(this.playerMoney)
      );
    }
  }

  private resetRound(): void {
    this.pot?.clear();
    this.currentBetAmount = 0;
    this.dealerButton?.destroy();
    this.playerBet = 0;
    this.setBetText(0);
    this.clearPlayersBet();

    this.players.forEach((player) => {
      // eslint-disable-next-line no-param-reassign
      player.gameStatus = GameStatus.FIRST_BETTING;
      player.clearBet();
      player.hand.forEach((card) => card.destroy());
      player.clearHand();
    });

    this.resetAndShuffleDeck(0, -600);
  }

  playGameResultSound(result: string): void {
    if (result === GameResult.WIN) {
      this.winGameSound?.play();
    } else {
      this.lossGameSound?.play();
    }
  }
}
