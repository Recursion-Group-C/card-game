import {
  User,
  SupabaseClient
} from '@supabase/supabase-js';
import { Game as GameType } from 'phaser';
import { Dispatch, SetStateAction } from 'react';

export default async function initPhaser(
  user: User | null,
  supabase: SupabaseClient,
  setGame: Dispatch<SetStateAction<GameType | undefined>>,
  Scenes: Array<any>
) {
  const Phaser = await import('phaser');
  const CONFIG = {
    width: 1920,
    height: 920,
    game: 'blackjack',
    userName: 'Player'
  };

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
