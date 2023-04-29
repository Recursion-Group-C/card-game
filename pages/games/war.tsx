import { Game as GameType } from 'phaser';
import { useEffect, useState } from 'react';

const WarGame = () => {
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');

      const { default: PlayScene } = await import(
        '@/games/war/scenes/PlayScene'
      );

      const { default: BetScene } = await import(
        '@/games/common/scenes/BetScene'
      );

      const { default: PreloadScene } = await import(
        '@/games/common/scenes/PreloadScene'
      );

      const CONFIG = {
        width: 1920,
        height: 920,
        game: 'war'
      };

      const Scenes: Array<any> = [
        PreloadScene,
        BetScene,
        PlayScene
      ];
      const createScene = (Scene: any) => new Scene(CONFIG);
      const initScenes = () => Scenes.map(createScene);

      const config = {
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.FIT,
          parent: 'game-content',
          autoCenter: Phaser.Scale.CENTER_BOTH,
          min: {
            width: 720,
            height: 345
          },
          max: {
            width: 1920,
            height: 920
          }
        },
        parent: 'game-content',
        ...CONFIG,
        backgroundColor: '#2A303C',
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

export default WarGame;
