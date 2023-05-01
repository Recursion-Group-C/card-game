import { Database } from '@/utils/database.types';
import {
  useSupabaseClient,
  useUser
} from '@supabase/auth-helpers-react';
import { Game as GameType } from 'phaser';
import { useEffect, useState } from 'react';

const Game = () => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');
      const CONFIG = {
        width: 1920,
        height: 920,
        game: 'blackjack',
        userName: 'Player'
      };

      const { default: PlayScene } = await import(
        '@/games/blackjack/scenes/PlayScene'
      );

      const { default: BetScene } = await import(
        '@/games/common/scenes/BetScene'
      );

      const { default: PreloadScene } = await import(
        '@/games/common/scenes/PreloadScene'
      );

      if (user) {
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username`)
          .eq('id', user.id)
          .single();
        if (data) {
          CONFIG.userName = data.username ?? 'Player';
        }

        if (error && status !== 406) {
          throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
        }
      }
      console.log(CONFIG);

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
  }, [user]);

  return (
    <div id="game-content" key="game-content">
      {/* this is where the game canvas will be rendered */}
    </div>
  );
};

export default Game;
