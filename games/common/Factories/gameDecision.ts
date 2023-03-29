export default class GameDecision {
  #action: string;

  #amount: number;

  constructor(action: string, amount: number) {
    this.#action = action;
    this.#amount = amount;
  }

  get action(): string {
    return this.#action;
  }

  set action(action: string) {
    this.#action = action;
  }

  get amount(): number {
    return this.#amount;
  }

  set amount(amount: number) {
    this.#amount = amount;
  }
}
