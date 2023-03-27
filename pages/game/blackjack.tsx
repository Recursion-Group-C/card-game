// <reference path="../../scenes/blackjack/bindings/phaser.d.ts"/>
import React, { useState, useEffect } from 'react';
import { Game as GameType } from 'phaser';

const Game = () => {
  const [game, setGame] = useState<GameType>(); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');

      const { default: BetScene } = await import(
        '../../scenes/blackjack/scene/BetScene'
      );
      const { default: MainScene } = await import(
        '../../scenes/blackjack/scene/MainScene'
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
    }
    initPhaser();
    console.log('in use effect');
  }, []);

  return (
    <div id="game-content" key="game-content">
      {/* this is where the game canvas will be rendered */}
    </div>
  );
};

export default Game;