import { Game as GameType } from 'phaser';
import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import initPhaser from '../api/initPhaser';

// TODO: Sceneのインポート以外を共通化する
const Game = () => {
  const user = useUser();
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    const importScenes = async () => {
      const { default: PlayScene } = await import(
        '../../games/poker/scenes/PlayScene'
      );

      const { default: LobbyScene } = await import(
        '../../games/poker/scenes/LobbyScene'
      );

      const { default: PreloadScene } = await import(
        '../../games/poker/scenes/PreloadScene'
      );

      const Scene: Array<any> = [
        PreloadScene,
        LobbyScene,
        PlayScene
      ];

      return Scene;
    };

    const initPhaserAsync = async () => {
      const Scenes = await importScenes();
      initPhaser(
        'poker',
        true,
        user ? user.id : '',
        setGame,
        Scenes
      );
    };

    initPhaserAsync();
  }, []);

  return (
    <div id="game-content" key="game-content">
      {/* this is where the game canvas will be rendered */}
    </div>
  );
};

export default Game;
