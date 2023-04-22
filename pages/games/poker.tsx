import { Game as GameType } from 'phaser';
import { useEffect, useState } from 'react';

// TODO: Sceneのインポート以外を共通化する
const Game = () => {
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');

      const { default: PlayScene } = await import(
        '../../games/poker/scenes/PlayScene'
      );

      const { default: LobbyScene } = await import(
        '../../games/poker/scenes/LobbyScene'
      );

      const { default: PreloadScene } = await import(
        '../../games/poker/scenes/PreloadScene'
      );

      const CONFIG = {
        width: window.innerWidth,
        height: window.innerHeight,
        game: 'poker'
      };

      const Scenes: Array<any> = [
        PreloadScene,
        LobbyScene,
        PlayScene
      ];
      const createScene = (Scene: any) => new Scene(CONFIG);
      const initScenes = () => Scenes.map(createScene);

      const config = {
        type: Phaser.AUTO,
        parent: 'game-content',
        ...CONFIG,
        backgroundColor: '#26723B',
        physics: {
          arcade: {
            debug: true
          }
        },
        scene: initScenes(),
        game: 'poker'
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
