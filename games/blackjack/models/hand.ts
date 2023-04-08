import Card from './card';

export default class Hand {
  private cards: Array<Card> = [];

  constructor() {
    this.emptyHand();
  }

  public receiveCard(card: Card) {
    this.cards.push(card);
  }

  public receiveCardFaceDown(card: Card) {
    card.setFaceDown(true);
    this.cards.push(card);
  }

  public emptyHand() {
    this.cards = [];
  }

  /*
  Scoring algorithm: number cards are scored as their value, face cards as 10, Ace as 11 or 1.
  For simplicity, Ace will count as 11 unless that will put the value over 21, where it will switch to 1
   */
  public getBlackjackScore(): number {
    let score = 0;
    let aces = 0;
    const faceCards: string[] = ['J', 'Q', 'K'];
    const ace = 'A';

    this.cards.forEach((card: Card) => {
      const value: string = card.getValue();
      if (faceCards.includes(value)) score += 10;
      else if (ace === value) aces += 1;
      else score += Number(value);
    });

    for (let i = 0; i < aces; i += 1) {
      if (score + 11 > 21) score += 1;
      else score += 11;
    }
    return score > 0 ? score : 0;
  }

  public getCards(): Card[] | undefined {
    return this.cards;
  }
}
