import game from '../../common/constants/game';
import Deck from '../../common/Factories/deck';

export default class BlackDeck extends Deck {
  constructor() {
    super();
    this.cardList = this.cardList.filter(
      (card) =>
        card.suit === game.card.suitChoices[0] ||
        card.suit === game.card.suitChoices[1]
    );
  }
}
