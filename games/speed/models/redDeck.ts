import Phaser from 'phaser';
import Deck from '../../common/Factories/deckImage';

const SUIT_CHOICES = ['Hearts', 'Diamonds'];

export default class RedDeck extends Deck {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, SUIT_CHOICES);
  }
}
