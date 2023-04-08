export default class Card {
  private suit: string;

  private value: string;

  private faceDown = false;

  constructor(suit: string, value: string) {
    this.suit = suit;
    this.value = value;
  }

  public getSuit(): string {
    return this.suit;
  }

  public getValue(): string {
    return !this.faceDown ? this.value : '0';
  }

  /*
   *function to get image of card from card atlas
   * In the form of cardSpadesA.png
   */
  public getAtlasFrame(): string {
    return !this.faceDown
      ? `card-${this.suit}-${this.value}.png`
      : '';
  }

  public setFaceDown(faceDown: boolean) {
    this.faceDown = faceDown;
  }

  public getFaceDown(): boolean {
    return this.faceDown;
  }
}
