import Card from './card';
import GameDecision from './gameDecision';
import game from '../constants/game';

export default abstract class Player {
  readonly #name: string; // if a player has logged in, use the player name fetched from the DB, otherwise use "

  readonly #playerType: string; // player, ho

  #chips: number; // if a player has logged in, use the player's deposit fetched from the DB, otherwise use constant

  #bet: number;

  #winAmount: number;

  #gameStatus: string;

  #hand: Array<Card> = [];

  constructor(
    playerType: string,
    bet: number,
    winAmount: number,
    gameStatus: string,
    name = 'Player',
    chips: number = game.player.chips
  ) {
    this.#name = name;
    this.#playerType = playerType;
    this.#chips = chips;
    this.#bet = bet;
    this.#winAmount = winAmount;
    this.#gameStatus = gameStatus;
  }

  get name(): string {
    return this.#name;
  }

  get playerType(): string {
    return this.#playerType;
  }

  get chips(): number {
    return this.#chips;
  }

  set chips(chips: number) {
    this.#chips = chips;
  }

  get bet(): number {
    return this.#bet;
  }

  set bet(bet: number) {
    this.#bet = bet;
  }

  get winAmount(): number {
    return this.#winAmount;
  }

  set winAmount(winAmount: number) {
    this.#winAmount = winAmount;
  }

  get gameStatus(): string {
    return this.#gameStatus;
  }

  set gameStatus(gameStatus: string) {
    this.#gameStatus = gameStatus;
  }

  get hand(): Array<Card> {
    return this.#hand;
  }

  // Array cannot simply use setter, so I create addCardToHand function instead of setter
  addCardToHand(card: Card) {
    this.#hand.push(card);
  }

  abstract promptPlayer(userData: number): GameDecision;

  abstract getHandScore(): number;
}
