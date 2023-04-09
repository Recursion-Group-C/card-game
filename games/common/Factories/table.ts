import Deck from './deck';
import Player from './player';
import game from '../constants/game';

export default abstract class Table {
  readonly #betDenominations: Array<number> = [];

  protected turnCounter: number;

  #gamePhase: string;

  #resultsLog: Array<string> = [];

  protected deck: Deck;

  abstract players: Array<Player>;

  constructor(
    gamePhase: string,
    betDenominations: Array<number> = [
      ...game.table.betDenominations
    ]
  ) {
    this.#betDenominations = betDenominations;
    this.turnCounter = 0;
    this.#gamePhase = gamePhase;
    this.deck = new Deck();
    this.deck.shuffle();
  }

  get betDenominations(): Array<number> {
    return this.#betDenominations;
  }

  get gamePhase(): string {
    return this.#gamePhase;
  }

  set gamePhase(gamePhase: string) {
    this.#gamePhase = gamePhase;
  }

  get resultsLog(): Array<string> {
    return this.#resultsLog;
  }

  // Array cannot simply use setter, so I create addLogToResultsLog function instead of setter
  addLogToResultsLog(log: string) {
    this.#resultsLog.push(log);
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

  resetAndShuffleDeck(): void {
    this.deck = new Deck();
    this.deck.shuffle();
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
