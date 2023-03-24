import React, { useState, useEffect } from "react";

import { Game as GameType } from "phaser";

const Game = () => {
  const [game, setGame] = useState<GameType>();

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import("phaser");

      const { default: Preloader } = await import("../scenes/Preloader");
      const { default: TestScene } = await import("../scenes/TestScene");

      const phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        title: "test-game",
        parent: "game-content", // div内のkeyとidと一致させる必要がある
        width: 900,
        height: 600,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 300 },
            debug: false,
          },
        },
        scene: [Preloader, TestScene],
      });
      setGame(phaserGame);
    }
    initPhaser();
    console.log("in use effect");
  }, []);

  return (
    <>
      <h2>This is a game page</h2>
      <div id="game-content" key="game-content">
        {/* this is where the game canvas will be rendered */}
      </div>
    </>
  );
};

export default Game;
