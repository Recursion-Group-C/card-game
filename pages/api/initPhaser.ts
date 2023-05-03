import { Game as GameType } from 'phaser';
import { Dispatch, SetStateAction } from 'react';
import { fetchProfile } from '@/utils/supabase-client';

export default async function initPhaser(
  game: string,
  canGoConfig: boolean,
  userId: string,
  setGame: Dispatch<SetStateAction<GameType | undefined>>,
  Scenes: Array<any>
) {
  const Phaser = await import('phaser');
  const CONFIG = {
    width: 1920,
    height: 920,
    game,
    canGoConfig,
    userName: 'Player',
    money: 1000,
    userId
  };

  if (userId) {
    const data = await fetchProfile(userId);
    if (data) {
      CONFIG.userName = data.username ?? 'Player';
      CONFIG.money = data.money;
    }
  }

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
