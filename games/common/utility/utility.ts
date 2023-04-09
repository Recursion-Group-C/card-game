/* eslint-disable */
/* eslint no-param-reassign: ["error", { "props": false }] */

import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import Scene = Phaser.Scene;
import Zone = Phaser.GameObjects.Zone;
import GameObject = Phaser.GameObjects.GameObject;
import game from '../constants/game';
import style from '../constants/style';

/**
 * カードを裏返すアニメーションを実行する関数。
 *
 * @param {Phaser.Scene} scene - アニメーションを実行するシーン。
 * @param {Phaser.GameObjects.Image} cardBack - 裏面のカードイメージ。
 * @param {Phaser.GameObjects.Image} cardFront - 表面のカードイメージ。
 */
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

/**
 * カードを指定された座標に移動するアニメーションを実行する関数。
 *
 * @param {Phaser.Scene} scene - アニメーションを実行するシーン。
 * @param {Phaser.GameObjects.Image} image - 移動させるカードイメージ。
 * @param {number} x - X軸方向の目標座標。
 * @param {number} y - Y軸方向の目標座標。
 * @param {number} [duration=500] - アニメーションの実行時間（ミリ秒）。省略時は500ミリ秒になる。
 */
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

/**
 * ゲームオーバー時に画面上に結果を表示する関数。
 *
 * @param {Phaser.Scene} scene - シーン。
 * @param {Phaser.GameObjects.Zone} gameZone - ゲーム領域を表すゾーン。
 */
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

/**
 * 画像ファイル名から、カードのスートとランクを抽出して、配列で返す関数。
 *
 * @param {string} cardString - カードの画像ファイル名。
 * @returns {Array<string>} スートとランクの文字列が格納された配列。
 * @example const [suit, rank] = parseCardString('card-Hearts-10.png');
 */
function parseCardString(
  cardString: string
): Array<string> {
  const parts = cardString.split(/[.-]/);
  const suit: string = parts[1];
  const rank: string = parts[2];
  return [suit, rank];
}

/**
 * 指定されたスートとランクのカードイメージを検索し、返す関数。
 *
 * @param {Phaser.Scene} scene - シーン。
 * @param {string} suit - スート。
 * @param {string} rank - ランク。
 * @returns {Phaser.GameObjects.Image|undefined} 検索されたカードイメージ。見つからなかった場合はundefinedを返す。
 */
function searchCardImage(
  scene: Scene,
  suit: string,
  rank: string
): Image | undefined {
  const cardImages: Array<any> = scene.children.list.filter(
    (gameObject: any) => gameObject.type === 'Image'
  );
  const targetImages: Array<GameObject> = cardImages.filter(
    (gameObject: any) => {
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
