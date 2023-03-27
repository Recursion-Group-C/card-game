import {Card} from "./card";
/**
 * Created by sean on 5/30/2018.
 */
export class Hand{
  private cards: Card[] | undefined;

  constructor(){
    this.emptyHand();
  }

  public receiveCard(card: Card){
    this.cards!.push(card);
  }

  public receiveCardFaceDown(card: Card){
    card.setFaceDown(true);
    this.cards!.push(card);
  }

  public emptyHand(){
    this.cards = [];
  }

  /*
  Scoring algorithm: number cards are scored as their value, face cards as 10, Ace as 11 or 1.
  For simplicity, Ace will count as 11 unless that will put the value over 21, where it will switch to 1
   */
  public getBlackjackScore(): number{
    let score: number = 0;
    let aces: number = 0;
    let faceCards: string[] = ['J', 'Q', 'K'];
    let ace: string = 'A';
    this.cards!.forEach(function(card: Card) {
      let value: string = card.getValue();
      if(faceCards.includes(value)) score += 10;
      else if(ace === value) aces++;
      else score += Number(value);
    });
    for(let i = 0; i < aces ; i++){
      if(score + 11 > 21) score += 1;
      else score += 11;
    }
    return score;
  }

  public getCards(): Card[] | undefined{
    return this.cards;
  }
}
