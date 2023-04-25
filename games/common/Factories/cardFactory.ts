import Scene = Phaser.Scene;
import GAME from '../constants/game';

export default class CardFactory {
  constructor(
    scene: Scene,
    textureUrl: string,
    atlasUrl: string
  ) {
    scene.load.atlasXML(
      GAME.CARD.ATLAS_KEY,
      textureUrl,
      atlasUrl
    );
  }
}
