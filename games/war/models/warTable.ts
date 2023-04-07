/* eslint-disable no-param-reassign */
// import Card from '@/games/common/Factories/card';
import Table from '../../common/Factories/table';
// import Deck from '@/games/common/Factories/deck';
import game from '../../common/constants/game';
import WarPlayer from './warPlayer';

export default class WarTable extends Table {
  players: Array<WarPlayer>;

  constructor(
    gamePhase: string,
    betDenominations: Array<number> = [
      ...game.table.betDenominations
    ]
  ) {
    super(gamePhase, betDenominations);
    this.players = [
      new WarPlayer(0, 0, '', 'House', 0),
      new WarPlayer(0, 0, '', 'Player', 0)
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  assignPlayerHands(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  evaluateAndGetRoundResults(): void {
    throw new Error('Method not implemented.');
  }

  // 各ラウンドの終わりに、各プレイヤーの手札とベットをクリアにする。
  clearPlayerHandsAndBets(): void {
    this.players.forEach((player) => {
      player.clearHand();
      player.clearBet();
    });
  }

  // 現在のターンでプレイしているPlayerを返すメソッド
  getTurnPlayer(): WarPlayer {
    const currentPlayerIndex =
      this.turnCounter % this.players.length;
    return this.players[currentPlayerIndex];
  }

  compareCards(): void {
    const houseCardValue = this.players[0].getHandScore();
    const playerCardValue = this.players[1].getHandScore();
    // console.log(houseCardValue, playerCardValue);

    if (playerCardValue > houseCardValue) {
      // Player wins round
      const winAmount = this.players[1].bet * 2;
      this.players[1].winAmount += winAmount;
      this.players[1].gameStatus = 'win';
      this.players[0].gameStatus = 'lose';
    } else if (playerCardValue < houseCardValue) {
      // Player loses round
      this.players[1].gameStatus = 'lose';
      this.players[0].gameStatus = 'win';
    } else {
      // Tied round
      this.players[1].winAmount += this.players[1].bet;
      this.players[1].gameStatus = 'tie';
      this.players[0].gameStatus = 'tie';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  evaluateMove(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  haveTurn(): void {
    throw new Error('Method not implemented.');
  }
}
