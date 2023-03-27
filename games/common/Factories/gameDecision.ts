/* eslint no-underscore-dangle: 0 */
export default class GameDecision {
  private _action: string;

  private _amount: number;

  constructor(action: string, amount: number) {
    this._action = action;
    this._amount = amount;
  }

  get action(): string {
    return this._action;
  }

  set action(action: string) {
    this._action = action;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(amount: number) {
    this._amount = amount;
  }
}
