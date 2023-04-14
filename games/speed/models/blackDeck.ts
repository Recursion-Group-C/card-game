import Phaser from 'phaser';
import Deck from '../../common/Factories/deckImage';

const SUIT_CHOICES = ['Spades', 'Clubs'];

export default class BlackDeck extends Deck {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, SUIT_CHOICES);
  }
}
