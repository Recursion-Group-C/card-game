import Text = Phaser.GameObjects.Text;
import ScenePlugin = Phaser.Scenes.ScenePlugin;
import Image = Phaser.GameObjects.Image;

export class TextUtility {
  static centerTextHorizontally(
    text: Text,
    scene: ScenePlugin
  ): void {
    text.setX(
      new Number(
        scene.manager.game.config.width
      ).valueOf() *
        0.5 -
        text.displayWidth * 0.5
    );
  }

  static centerTextOnImageHorizontally(
    text: Text,
    image: Image
  ) {
    let centerX = image.x;
    text.setX(image.x - text.displayWidth * 0.5);
  }

  static spaceOutImagesEvenlyHorizontally(
    texts: Text[],
    scene: ScenePlugin
  ) {
    for (let i: number = 0; i < texts.length; i++) {
      texts[i].setX(
        (new Number(
          scene.manager.game.config.width
        ).valueOf() *
          (i + 1)) /
          (texts.length + 1)
      );
    }
  }
}
