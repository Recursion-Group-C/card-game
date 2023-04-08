/* eslint-disable */
/* eslint no-param-reassign: ["error", { "props": false }] */

import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import Scene = Phaser.Scene;
import Zone = Phaser.GameObjects.Zone;
import GameObject = Phaser.GameObjects.GameObject;
import game from '../constants/game';
import style from '../constants/style';

function flipOverCard(
  scene: Scene,
  cardBack: Image,
  cardFront: Image
) {
  scene.tweens.add({
    targets: cardBack,
    scaleX: 0,
    duration: game.card.flip_time / 2,
    ease: 'Linear'
  });
  scene.tweens.add({
    targets: cardFront,
    scaleX: 1,
    duration: game.card.flip_time / 2,
    delay: game.card.flip_time / 2,
    ease: 'Linear'
  });
}

function createCardTween(
  scene: Scene,
  image: Image,
  x: number,
  y: number,
  duration = 500
) {
  scene.tweens.add({
    targets: image,
    x,
    y,
    duration,
    ease: 'Linear'
  });
}

function gameOver(scene: Scene, gameZone: Zone) {
  const graphics = scene.add.graphics({
    fillStyle: { color: 0x000000, alpha: 0.75 }
  });
  const square = new Phaser.Geom.Rectangle(
    0,
    0,
    Number(scene.scene.manager.game.config.width),
    Number(scene.scene.manager.game.config.height)
  );
  graphics.fillRectShape(square);
  const resultText: Text = scene.add.text(
    0,
    0,
    "You're Broke! Here's another grand on the house.",
    style.text
  );
  resultText.setColor('#ffde3d');
  Phaser.Display.Align.In.Center(
    resultText,
    gameZone as Zone
  );
  scene.input.once(
    'pointerdown',
    () => {
      scene.input.once(
        'pointerup',
        () => {
          // TODO: 状態（所持金、ベット金額）のリセット
          scene.scene.restart();
        },
        scene
      );
    },
    scene
  );
}

// 画像ファイル名（例えば、card-Hearts-10.png）を受け取り、suitとrankを返す
function parseCardString(
  cardString: string
): Array<string> {
  const parts = cardString.split(/[.-]/);
  const suit: string = parts[1];
  const rank: string = parts[2];
  return [suit, rank];
}

function searchCardImage(
  scene: Scene,
  suit: string,
  rank: string
): Image | undefined {
  const cardImages: Array<any> = scene.children.list.filter(
    (gameObject) => gameObject.type === 'Image'
  );
  const targetImages: Array<GameObject> = cardImages.filter(
    (gameObject) => {
      const [objectSuit, objectRank] = parseCardString(
        gameObject.frame.name
      );
      return objectSuit === suit && objectRank === rank;
    }
  );

  return targetImages[0] as Image;
}

export {
  flipOverCard,
  createCardTween,
  gameOver,
  parseCardString,
  searchCardImage
};
