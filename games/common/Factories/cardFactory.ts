import Scene = Phaser.Scene;
import game from '../constants/game';

export default class CardFactory {
  constructor(
    scene: Scene,
    textureUrl: string,
    atlasUrl: string
  ) {
    scene.load.atlasXML(
      game.card.atlas_key,
      textureUrl,
      atlasUrl
    );
  }
}
