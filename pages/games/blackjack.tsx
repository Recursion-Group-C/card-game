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
        '@/games/blackjack/scenes/PlayScene'
      );

      const { default: LobbyScene } = await import(
        '@/games/common/scenes/LobbyScene'
      );

      const { default: PreloadScene } = await import(
        '@/games/common/scenes/PreloadScene'
      );

      const Scenes: Array<any> = [
        PreloadScene,
        LobbyScene,
        PlayScene
      ];
      return Scenes;
    };

    const initPhaserAsync = async () => {
      const Scenes = await importScenes();
      initPhaser(
        'blackjack',
        false,
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
