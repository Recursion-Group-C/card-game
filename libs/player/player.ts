/* eslint no-underscore-dangle: 0 */
import Card from '../card';
import GameDecision from '../gameDecision';
import game from '../../const/game';

export default abstract class Player {
  private readonly _name: string; // if a player has logged in, use the player name fetched from the DB, otherwise use "Player"

  private readonly _playerType: string; // player, house, ai

  private _chips: number; // if a player has logged in, use the player's deposit fetched from the DB, otherwise use constant amount.

  private _bet: number;

  private _winAmount: number;

  private _gameStatus: string;

  private _hand: Array<Card> = [];

  constructor(
    playerType: string,
    bet: number,
    winAmount: number,
    gameStatus: string,
    name = 'Player',
    chips: number = game.player.chips
  ) {
    this._name = name;
    this._playerType = playerType;
    this._chips = chips;
    this._bet = bet;
    this._winAmount = winAmount;
    this._gameStatus = gameStatus;
  }

  get name(): string {
    return this._name;
  }

  get playerType(): string {
    return this._playerType;
  }

  get chips(): number {
    return this._chips;
  }

  set chips(chips: number) {
    this._chips = chips;
  }

  get bet(): number {
    return this._bet;
  }

  set bet(bet: number) {
    this._bet = bet;
  }

  get winAmount(): number {
    return this._winAmount;
  }

  set winAmount(winAmount: number) {
    this._winAmount = winAmount;
  }

  get gameStatus(): string {
    return this._gameStatus;
  }

  set gameStatus(gameStatus: string) {
    this._gameStatus = gameStatus;
  }

  get hand(): Array<Card> {
    return this._hand;
  }

  // Array cannot simply use setter, so I create addCardToHand function instead of setter
  addCardToHand(card: Card) {
    this._hand.push(card);
  }

  abstract promptPlayer(userData: number): GameDecision;

  abstract getHandScore(): number;
}

