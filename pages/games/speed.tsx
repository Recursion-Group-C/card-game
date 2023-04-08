import { Game as GameType } from 'phaser';
import { useEffect, useState } from 'react';
import BaseScene from '../../games/speed/scenes/BaseScene';

const Game = () => {
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');

      const { default: PlayScene } = await import(
        '../../games/speed/scenes/PlayScene'
      );

      const { default: BetScene } = await import(
        '../../games/speed/scenes/BetScene'
      );

      const { default: PreloadScene } = await import(
        '../../games/speed/scenes/PreloadScene'
      );

      const SHARED_CONFIG = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      const Scenes: Array<BaseScene> = [
        PreloadScene,
        BetScene,
        PlayScene
      ];
      const createScene = (Scene: BaseScene) =>
        new Scene(SHARED_CONFIG);
      const initScenes = () => Scenes.map(createScene);

      const config = {
        type: Phaser.AUTO,
        parent: 'game-content',
        ...SHARED_CONFIG,
        backgroundColor: '#26723B',
        physics: {
          arcade: {
            debug: true
          }
        },
        scene: initScenes()
      };

      const phaserGame = new Phaser.Game(config);
      setGame(phaserGame);
    }
    initPhaser();
  }, []);

  return (
    <div id="game-content" key="game-content">
      {/* this is where the game canvas will be rendered */}
    </div>
  );
};

export default Game;
