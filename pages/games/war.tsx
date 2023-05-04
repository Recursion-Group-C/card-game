import { useUser } from '@supabase/auth-helpers-react';
import { Game as GameType } from 'phaser';
import { useEffect, useState } from 'react';
import initPhaser from '../api/initPhaser';

const Game = () => {
  const user = useUser();
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    const importScenes = async () => {
      const { default: PlayScene } = await import(
        '@/games/war/scenes/PlayScene'
      );

      const { default: BetScene } = await import(
        '@/games/common/scenes/BetScene'
      );

      const { default: PreloadScene } = await import(
        '@/games/common/scenes/PreloadScene'
      );

      const Scenes: Array<any> = [
        PreloadScene,
        BetScene,
        PlayScene
      ];
      return Scenes;
    };

    const initPhaserAsync = async () => {
      const Scenes = await importScenes();
      initPhaser(
        'war',
        false,
        user ? user.id : '',
        setGame,
        Scenes
      );
    };
    initPhaserAsync();
  }, [user]);

  return (
    <div id="game-content" key="game-content">
      {/* this is where the game canvas will be rendered */}
    </div>
  );
};

export default Game;
