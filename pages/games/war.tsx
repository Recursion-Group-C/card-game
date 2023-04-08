import React, { useState, useEffect } from 'react';
import { Game as GameType } from 'phaser';

const WarGame = () => {
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    const initPhaser = async () => {
      const Phaser = await import('phaser');

      const { default: BetScene } = await import(
        '../../games/war/scenes/BetScene'
      );
      const { default: MainScene } = await import(
        '../../games/war/scenes/MainScene'
      );

      const phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'game-content',
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [BetScene, MainScene],
        backgroundColor: '#26723B'
      });
      setGame(phaserGame);
    };
    initPhaser();
  }, []);

  return (
    <div id="game-content" key="game-content">
      {/* this is where the game canvas will be rendered */}
    </div>
  );
};

export default WarGame;
