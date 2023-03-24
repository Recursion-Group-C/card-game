import Phaser, {Scene} from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private star?: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private bombs?: Phaser.Physics.Arcade.Group;
  private gameOver: boolean = false;


  constructor() {
    super('testscene')
  }

  preload() {
    this.load.image("sky", "img/sky.png");
    this.load.image('ground', 'img/platform.png');
    this.load.image('star', 'img/star.png');
    this.load.image('bomb', 'img/bomb.png');
    this.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();
    const ground = this.platforms.create(400, 568, 'ground') as Phaser.Physics.Arcade.Sprite

    ground
      .setScale(2)
      .refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.star = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 11, y: 0, stepX: 70 }
    });

    this.star.children.iterate(c => {
      const child = c as Phaser.Physics.Arcade.Image;
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    })

    this.physics.add.collider(this.star, this.platforms);
    this.physics.add.overlap(this.player, this.star, this.handleCollectStar as ArcadePhysicsCallback | undefined, undefined, this);

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      // fill: '#000'
    });

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(this.player, this.bombs, this.handleHitBombs as ArcadePhysicsCallback | undefined, undefined, this);
  }

  private handleHitBombs = (player: Phaser.GameObjects.GameObject, b: Phaser.Physics.Arcade.Image) => {
    this.physics.pause();
    this.player?.setTint(0xff0000);
    this.player?.anims.play('turn');
    this.gameOver = true;
  }

  private handleCollectStar = (player: Phaser.GameObjects.GameObject, s: Phaser.Physics.Arcade.Image) => {
    const star = s as Phaser.Physics.Arcade.Image;
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText?.setText(`Score: ${this.score}`);

    if (this.star?.countActive(true) === 0) {
      this.star?.children.iterate(c => {
        const child = c as Phaser.Physics.Arcade.Image;
        child.enableBody(true, child.x, 0, true, true);
      });

      if (this.player) {
        const x = this.player.x < 400
          ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }


    }


  }

  update() {
    if (!this.cursors) {
      return
    }

    if (this.cursors.left?.isDown) {
      this.player?.setVelocityX(-160);
      this.player?.anims.play('left', true);
    }
    else if (this.cursors.right?.isDown) {
      this.player?.setVelocityX(160);
      this.player?.anims.play('right', true);
    }
    else {
      this.player?.setVelocityX(0);
      this.player?.play('turn');
    }

    if (this.cursors.up?.isDown && this.player?.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
