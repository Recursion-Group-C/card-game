/* eslint no-param-reassign: ["error", { "props": false }] */

import GAME from '../constants/game';
import Card from './cardImage';
import GameDecision from './gameDecision';

export default abstract class Player {
  readonly #name: string; // if a player has logged in, use the player name fetched from the DB, otherwise use "

  readonly #playerType: 'player' | 'house' | 'cpu';

  #chips: number; // if a player has logged in, use the player's deposit fetched from the DB, otherwise use constant

  #bet: number;

  #winAmount: number;

  #gameStatus: string;

  #hand: Array<Card> = [];

  constructor(
    playerType: 'player' | 'house' | 'cpu',
    bet: number,
    winAmount: number,
    gameStatus: string,
    name = 'Player',
    chips: number = GAME.PLAYER.CHIPS
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

  get playerType(): 'player' | 'house' | 'cpu' {
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

  clearHand() {
    this.#hand = [];
  }

  clearBet() {
    this.#bet = 0;
  }

  addBet(bet: number) {
    this.#bet += bet;
  }

  getHandSize(): number {
    return this.hand.length;
  }

  removeCardFromHand(card: Card): void {
    for (let i = 0; i < this.hand.length; i += 1) {
      if (
        this.hand[i].suit === card.suit &&
        this.hand[i].rank === card.rank
      ) {
        this.hand.splice(i, 1);
      }
    }
  }

  abstract promptPlayer(userData: number): GameDecision;

  abstract getHandScore(): number;
}
