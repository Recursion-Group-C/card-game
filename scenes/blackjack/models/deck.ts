import {Card} from "./card";
/**
 * Created by sean on 5/30/2018.
 */
export class Deck {
  private cards: Card[] | undefined;
  constructor(){
    this.resetShuffleDeck();
  }

  public resetShuffleDeck(){
    this.cards = new Array<Card>();
    this.createFullUnshuffledDeck();
    this.shuffleDeck();
  }

  public drawCard(): Card | undefined {
    return this.cards!.pop();
  }

  public getDeckSize(): number {
    return this.cards!.length;
  }

  private createFullUnshuffledDeck(){
    this.constructSuit('Clubs');
    this.constructSuit('Diamonds');
    this.constructSuit('Hearts');
    this.constructSuit('Spades');
  }

  private constructSuit(suit: string){
    this.cards!.push(new Card(suit,'2'));
    this.cards!.push(new Card(suit,'3'));
    this.cards!.push(new Card(suit,'4'));
    this.cards!.push(new Card(suit,'5'));
    this.cards!.push(new Card(suit,'6'));
    this.cards!.push(new Card(suit,'7'));
    this.cards!.push(new Card(suit,'8'));
    this.cards!.push(new Card(suit,'9'));
    this.cards!.push(new Card(suit,'10'));
    this.cards!.push(new Card(suit,'J'));
    this.cards!.push(new Card(suit,'Q'));
    this.cards!.push(new Card(suit,'K'));
    this.cards!.push(new Card(suit,'A'));
  }

  private shuffleDeck(){
    for (let i = this.cards!.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards![i];
      this.cards![i] = this.cards![j];
      this.cards![j] = temp;
    }
  }
}
