/* eslint no-underscore-dangle: 0 */
import Deck from './deck';
import Player from './player';
import game from '../constants/game';

export default abstract class Table {
  private readonly _betDenominations: Array<number> = [];

  protected turnCounter: number;

  private _gamePhase: string;

  private _resultsLog: Array<string> = [];

  protected deck: Deck;

  abstract players: Array<Player>;

  constructor(
    gamePhase: string,
    betDenominations: Array<number> = [
      ...game.table.betDenominations
    ]
  ) {
    this._betDenominations = betDenominations;
    this.turnCounter = 0;
    this._gamePhase = gamePhase;
    this.deck = new Deck();
    this.deck.shuffle();
  }

  get betDenominations(): Array<number> {
    return this._betDenominations;
  }

  get gamePhase(): string {
    return this._gamePhase;
  }

  set gamePhase(gamePhase: string) {
    this._gamePhase = gamePhase;
  }

  get resultsLog(): Array<string> {
    return this._resultsLog;
  }

  // Array cannot simply use setter, so I create addLogToResultsLog function instead of setter
  addLogToResultsLog(log: string) {
    this._resultsLog.push(log);
  }

  isFirstPlayer(): boolean {
    return (
      this.turnCounter % (this.players.length + 1) ===
      this.players.length
    );
  }

  isLastPlayer(): boolean {
    return (
      this.turnCounter % (this.players.length + 1) ===
      this.players.length
    );
  }

  // Deal the Cards at the beginning of the game
  abstract assignPlayerHands(): void;

  // Reset Players' hands and bets at the end of each round
  abstract clearPlayerHandsAndBets(): void;

  abstract getTurnPlayer(): Player;

  abstract evaluateAndGetRoundResults(): void;

  abstract evaluateMove(player: Player): void;

  abstract haveTurn(): void;
}
