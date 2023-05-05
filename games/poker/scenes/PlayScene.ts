/* eslint-disable class-methods-use-this */
import STYLE from '@/games/common/constants/style';
import Button from '../../common/Factories/button';
import Card from '../../common/Factories/cardImage';
import Deck from '../../common/Factories/deckImage';
import Table from '../../common/Factories/tableScene';
import GAME from '../../common/constants/game';
import GameResult from '../constants/gameResult';
import GameStatus from '../constants/gameStatus';
import { HAND_RANK_MAP } from '../constants/handRank';
import PlayerAction from '../constants/playerAction';
import DealerButton from '../models/dealerButton';
import PokerPlayer from '../models/pokerPlayer';
import Pot from '../models/pot';

import Text = Phaser.GameObjects.Text;
import Zone = Phaser.GameObjects.Zone;
// import PlayerBettingStatus from '../models/playerBettingStatus';

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

  private cpuBettingStatus: Text | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: any) {
    super('PlayScene', GAME.TABLE.SPEED_TABLE_KEY, config);
    this.players = [
      new PokerPlayer(
        'player',
        0,
        0,
        GameStatus.FIRST_BETTING,
        this.config.userName,
        0
      ),
      new PokerPlayer(
        'cpu',
        0,
        0,
        GameStatus.FIRST_BETTING,
        'CPU',
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
    this.createBackButton();
    this.createPlayerNameTexts();
    this.createPlayerHandZones(
      GAME.CARD.WIDTH,
      GAME.CARD.HEIGHT
    );

    this.dealInitialCards();
    // this.createDealerButton(this.playerHandZones[0]);

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
      GAME.TABLE.RED_CHIP_KEY,
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
      this.config.width * 0.85,
      this.config.height * 0.7,
      GAME.TABLE.BUTTON,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'RAISE'
    );

    this.raiseButton.setClickHandler(() => {
      this.addRaiseAmount();
      this.playerBet += this.currentBetAmount;
      this.playerMoney -= this.playerBet;
      this.player.addBet(this.currentBetAmount);

      // TODO: チップアニメーション追加
      this.time.delayedCall(500, () => {
        this.setMoneyText(this.playerMoney);
        this.setBetText(this.playerBet);
        this.pot?.setAmount(this.currentBetAmount);
        this.destroyActionPanel();
        console.log(this.player.gameStatus);
        if (
          this.player.gameStatus ===
          GameStatus.SECOND_BETTING
        ) {
          this.nextPlayerTurnOnSecondBettingRound(1);
        } else {
          this.nextPlayerTurnOnFirstBettingRound(1);
        }
        this.player.gameStatus = PlayerAction.RAISE;
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
      this.config.width * 0.85,
      this.config.height * 0.8,
      GAME.TABLE.BUTTON,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'CALL'
    );

    this.callButton.setClickHandler(() => {
      this.playerBet += this.currentBetAmount;
      this.playerMoney -= this.playerBet;
      this.player.gameStatus = PlayerAction.CALL;

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
      this.config.width * 0.85,
      this.config.height * 0.8,
      GAME.TABLE.BUTTON,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'CHECK'
    );

    this.checkButton.setClickHandler(() => {
      // TODO: チップアニメーション追加
      this.time.delayedCall(500, () => {
        this.destroyActionPanel();
        if (
          this.player.gameStatus ===
          GameStatus.SECOND_BETTING
        ) {
          this.player.gameStatus = PlayerAction.CHECK;
          this.nextPlayerTurnOnSecondBettingRound(1);
        } else {
          this.player.gameStatus = PlayerAction.CHECK;
          this.nextPlayerTurnOnFirstBettingRound(1);
        }
      });
    });
  }

  private createFoldButton(): void {
    this.foldButton = new Button(
      this,
      this.config.width * 0.85,
      this.config.height * 0.9,
      GAME.TABLE.BUTTON,
      GAME.TABLE.BUTTON_CLICK_SOUND_KEY,
      'FOLD'
    );

    this.foldButton.setClickHandler(() => {
      this.player.gameStatus = PlayerAction.FOLD;
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
   * @param playerIndex 次の手番のプレイヤーのindex
   */
  private nextPlayerTurnOnFirstBettingRound(
    playerIndex: number
  ): void {
    console.log('ファーストベッティング');
    // ノーコンテスト
    console.log(this.currentBetAmount);
    if (!this.hasEnoughPlayers()) {
      this.clearPlayersBet();
      this.cpuBettingStatus?.destroy();
      if (this.player.gameStatus === PlayerAction.FOLD) {
        this.noContest(GameResult.LOSS);
        return;
      }
      this.noContest(GameResult.WIN);
      return;
    }

    // ハンド交換へ
    if (this.isFirstBettingEnd()) {
      this.clearPlayersBet();
      this.cpuBettingStatus?.destroy();

      // 全員のstatus変更
      this.players.forEach((player) => {
        // eslint-disable-next-line no-param-reassign
        player.gameStatus = GameStatus.CHANGE_CARD;
      });
      this.nextPlayerTurnOnChangeHandRound(0);

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
      this.cpuFirstBettingAction(1);
    }
  }

  /**
   * ハンド交換を行うラウンド
   * @param playerIndex 次の手番のプレイヤーのindex
   */
  private nextPlayerTurnOnChangeHandRound(
    playerIndex: number
  ): void {
    let currentPlayerIndex = playerIndex;
    if (playerIndex > this.players.length - 1)
      currentPlayerIndex = 0;

    console.log('changeHand', playerIndex);
    // 2巡目へ
    if (this.isChangeHandRoundEnd()) {
      this.currentBetAmount = 0;
      this.clearPlayersBet();
      console.log('呼び出し');
      this.nextPlayerTurnOnSecondBettingRound(0);
      return;
    }

    if (
      this.players[currentPlayerIndex].playerType ===
      'player'
    ) {
      // カード交換処理
      this.createChageHandButton();
      this.enableHandSelection();
    } else {
      this.cpuChangeHand(1);
    }
  }

  private clearPlayersBet(): void {
    this.players.forEach((player) => {
      player.clearBet();
    });
  }

  /**
   * 2巡目のベッティングラウンド
   * @param playerIndex 次の手番のプレイヤーのindex
   */
  private nextPlayerTurnOnSecondBettingRound(
    playerIndex: number
  ): void {
    console.log('セカンドベッティング');
    if (this.isSecondBettingEnd()) {
      // TODO: 役名を表示する

      const winPlayers = this.compareAllHands();
      let result = GameResult.LOSS;
      if (winPlayers.length >= 2) {
        result = GameResult.TIE;
      }
      if (winPlayers.includes(this.player)) {
        result = GameResult.WIN;
      }
      this.showdown(result);
      return;
    }

    let currentPlayerIndex = playerIndex;
    if (playerIndex > this.players.length - 1)
      currentPlayerIndex = 0;

    console.log(currentPlayerIndex);

    if (
      this.players[currentPlayerIndex].playerType ===
      'player'
    ) {
      this.createActionPanel();
    } else {
      this.cpuSecondBettingAction(1);
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
        (player) => player.gameStatus !== PlayerAction.FOLD
      ).length >= 2
    );
  }

  /**
   * 全員のベッティングが終了しているかどうかを判定する
   *
   * @returns 全員のベッティングが終了している場合は true
   */
  private isFirstBettingEnd(): boolean {
    let isEnd = true;
    // eslint-disable-next-line consistent-return
    this.players.forEach((player) => {
      if (player.gameStatus === GameStatus.FIRST_BETTING) {
        isEnd = false;
      }

      if (player.gameStatus === PlayerAction.CHECK) {
        if (player.bet === 0) {
          isEnd = false;
        }
      }

      if (player.gameStatus === PlayerAction.CALL) {
        isEnd = player.bet === this.currentBetAmount;
      }

      if (player.gameStatus === PlayerAction.RAISE) {
        if (
          player.bet !== 0 &&
          player.bet === this.currentBetAmount
        ) {
          isEnd = true;
        } else {
          isEnd = false;
        }
      }
    });
    return isEnd;
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
      console.log(isEnd, player.gameStatus, player.name);
    });
    return isEnd;
  }

  private isSecondBettingEnd(): boolean {
    let isEnd = true;
    // eslint-disable-next-line consistent-return
    this.players.forEach((player) => {
      console.log(player.gameStatus);
      if (player.gameStatus === GameStatus.SECOND_BETTING) {
        isEnd = false;
        return isEnd;
      }

      if (player.gameStatus === PlayerAction.CHECK) {
        if (player.bet === 0) {
          isEnd = false;
        }
      }

      if (player.gameStatus === PlayerAction.CALL) {
        isEnd = player.bet === this.currentBetAmount;
      }

      if (player.gameStatus === PlayerAction.RAISE) {
        if (
          player.bet !== 0 &&
          player.bet === this.currentBetAmount
        ) {
          isEnd = true;
        } else {
          isEnd = false;
        }
      }
    });

    return isEnd;
  }

  // TODO: 難易度調整
  private cpuFirstBettingAction(index: number): void {
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

    decisionValue = PlayerAction.CALL;

    // if (decisionValue === PlayerAction.FOLD) {
    //   this.players[playerIndex].gameStatus =
    //     PlayerAction.FOLD;
    //   this.createCpuBettingStatus(PlayerAction.FOLD);
    //   this.players[playerIndex].hand.forEach((card) => {
    //     card.playMoveTween(this.config.width / 2, -600);
    //   });
    // }
    // if (decisionValue === PlayerAction.RAISE) {
    //   this.addRaiseAmount();
    //   this.players[playerIndex].addBet(
    //     this.currentBetAmount
    //   );
    //   this.pot?.setAmount(this.currentBetAmount);
    //   this.createCpuBettingStatus(PlayerAction.RAISE);
    // }
    if (decisionValue === PlayerAction.CALL) {
      const betAmount =
        this.currentBetAmount - this.players[index].bet;
      this.players[index].addBet(betAmount);
      this.pot?.setAmount(betAmount);
      this.createCpuBettingStatus(PlayerAction.CALL);
      this.players[index].gameStatus = PlayerAction.CALL;
    }

    this.time.delayedCall(1000, () => {
      this.nextPlayerTurnOnFirstBettingRound(0);
    });
  }

  private cpuSecondBettingAction(index: number): void {
    const decisionValue = PlayerAction.CALL;
    this.cpuBettingStatus?.destroy();

    if (decisionValue === PlayerAction.CALL) {
      const betAmount =
        this.currentBetAmount - this.players[index].bet;
      this.players[index].addBet(betAmount);
      this.pot?.setAmount(betAmount);
      this.createCpuBettingStatus(PlayerAction.CALL);
      this.players[index].gameStatus = PlayerAction.CALL;
    }

    this.nextPlayerTurnOnSecondBettingRound(0);
  }

  private cpuChangeHand(playerIndex: number): void {
    const selectedCards: Card[] = [];
    console.log(playerIndex);
    this.players[1].gameStatus = GameStatus.SECOND_BETTING;
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
          this.players[playerIndex] as PokerPlayer,
          card.originalPositionX as number,
          card.originalPositionY as number,
          true
        );
      });

      // const nextPlayerIndex = playerIndex + 1;

      this.nextPlayerTurnOnChangeHandRound(0);
    });
  }

  private createCpuBettingStatus(status: string): void {
    let tmpStr = '';
    if (status === PlayerAction.RAISE)
      tmpStr = `RAISE: ${this.currentBetAmount}`;
    else if (status === PlayerAction.CALL)
      tmpStr = `CALL: ${this.currentBetAmount}`;
    else if (status === PlayerAction.CHECK)
      tmpStr = `CHECK: ${this.currentBetAmount}`;
    else tmpStr = `FOLD`;

    console.log(tmpStr);

    this.cpuBettingStatus = this.add
      .text(
        this.playerHandZones[1].x,
        this.playerHandZones[1].y,
        tmpStr,
        STYLE.NAME_TEXT
      )
      .setOrigin(0.5)
      .setDepth(10);
  }

  private createChageHandButton(): void {
    this.changeHandButton = new Button(
      this,
      this.config.width * 0.1,
      this.config.height * 0.9,
      GAME.TABLE.BUTTON,
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

      this.time.delayedCall(1500, () => {
        this.player.hand.forEach((card) => {
          if (card.isFaceDown) {
            card.playFlipOverTween();
          }
        });
        this.nextPlayerTurnOnChangeHandRound(1);
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
      (player) => player.gameStatus !== PlayerAction.FOLD
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

  /**
   * ノーコンテンスト時の処理
   * @param result プレイヤーの勝敗結果
   */
  private noContest(result: GameResult): void {
    this.destroyActionPanel();
    this.payOut(result);
    const noContestText = this.add
      .text(
        this.config.width / 2,
        this.config.height / 2,
        result,
        STYLE.NAME_TEXT
      )
      .setOrigin(0.5)
      .setDepth(10);

    // 初期化
    this.resetRound();

    this.time.delayedCall(3000, () => {
      noContestText.destroy();
      this.dealInitialCards();
      // this.createDealerButton(this.playerHandZones[0]);
      console.log(this.playerBet);
      this.PlayAnte();
    });

    this.time.delayedCall(4000, () => {
      this.createActionPanel();
    });

    // this.dealCards();
  }

  /**
   * ショーダウン時の処理
   *
   * @param result プレイヤーの勝敗結果
   * @remark
   * 各プレイヤーの役名と、勝敗結果を表示する。
   * その後、次のラウンドへ移行
   * @privateRemark
   * TODO: cpuのカードを表向きにする
   */
  private showdown(result: GameResult): void {
    this.destroyActionPanel();
    this.payOut(result);
    const handRanks: Text[] = [];

    this.playerHandZones.forEach((handZone, index) => {
      const player = this.players[index] as PokerPlayer;
      const handRankText = this.getKeyByValue(
        HAND_RANK_MAP,
        player.getHandRank()
      );

      const handRank = this.add
        .text(
          handZone.x,
          handZone.y,
          handRankText,
          STYLE.NAME_TEXT
        )
        .setOrigin(0.5)
        .setDepth(10);

      handRanks.push(handRank);
    });

    const resultText = this.add
      .text(
        this.config.width / 2,
        this.config.height / 2,
        result,
        STYLE.NAME_TEXT
      )
      .setOrigin(0.5)
      .setDepth(10);

    this.resetRound();

    this.time.delayedCall(3000, () => {
      handRanks.forEach((handRank) => {
        handRank.destroy();
      });
      resultText.destroy();
      this.dealInitialCards();
      // this.createDealerButton(this.playerHandZones[0]);
      console.log(this.playerBet);
      this.PlayAnte();
    });

    this.time.delayedCall(4000, () => {
      this.createActionPanel();
    });
  }

  // eslint-disable-next-line consistent-return
  getKeyByValue(
    map: Map<string, number>,
    value: number
  ): string {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of map.entries()) {
      if (val === value) {
        return key;
      }
    }
    return '';
  }

  payOut(result: GameResult): number {
    let winAmount = 0;
    if (result === GameResult.WIN) {
      winAmount = this.pot?.getAmount() as number;
      this.playerMoney += winAmount;
    }
    if (result === GameResult.TIE) {
      winAmount = (this.pot?.getAmount() as number) / 2;
      this.playerMoney += winAmount;
    }
    if (result === GameResult.LOSS) {
      winAmount -= this.playerBet;
      // this.playerMoney -= this.playerBet;
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
    return winAmount;
  }

  private resetRound(): void {
    this.pot?.clear();
    this.currentBetAmount = 0;
    this.dealerButton?.destroy();
    this.playerBet = 0;
    this.setBetText(0);
    this.clearPlayersBet();
    this.cpuBettingStatus?.destroy();

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
