import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
  protected config;

  constructor(key: string, config: any) {
    super(key);
    this.config = config;
  }

  // create() {
  // TODO: どのシーンでも使用できる盤面の画像をaddする
  // }
}
