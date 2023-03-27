import Image = Phaser.GameObjects.Image;
import ScenePlugin = Phaser.Scenes.ScenePlugin;

export class ImageUtility{
    static spaceOutImagesEvenlyHorizontally(images: Image[], scene: ScenePlugin){
        for(let i: number =0; i < images.length; i++){
            images[i].setX(new Number(scene.manager.game.config.width).valueOf() * (i+1)/(images.length+1));
        }
    }
}
