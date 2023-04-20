/* eslint-disable */
/* eslint no-param-reassign: ["error", { "props": false }] */

import Card from '../../common/Factories/card';
import game from '../../common/constants/game';
import style from '../../common/constants/style';
import {
  createCardTween,
  flipOverCard,
  parseCardString,
  searchCardImage
} from '../../common/utility/utility';
import GameResult from '../constants/gameResult';
import BlackDeck from '../models/blackDeck';
import SpeedPlayer from '../models/rummyPlayer';
import RedDeck from '../models/rummyRedDeck';

import BaseScene from '../../common/scenes/BaseScene';

import Text = Phaser.GameObjects.Text;
import Texture = Phaser.Textures.Texture;
import Zone = Phaser.GameObjects.Zone;
import Image = Phaser.GameObjects.Image;
import GameObject = Phaser.GameObjects.GameObject;
import { Game } from 'phaser';

export default class PlayScene extends BaseScene {
  private redDeck: RedDeck;

  private blackDeck: BlackDeck;

  private player: SpeedPlayer;

  private ai: SpeedPlayer;

  private faceDownImages: Array<Image> = [];

  private atlasTexture: Texture | undefined;

  public moneyText: Text | undefined;

  public betText: Text | undefined;

  private playerNameText: Text | undefined;

  private aiNameText: Text | undefined;

  private allDeckNameText: Text | undefined;

  private playerDeckSizeText: Text | undefined;

  private aiDeckSizeText: Text | undefined;

  private timerText: Text | undefined;

  private gameZone: Zone | undefined;

  private dropCardZone: any = {
    right: undefined,
    left: undefined
  };

  private dropCardRank = { right: 0, left: 0 };

  private playerDeckImage: Image | undefined;

  private aiDeckImage: Image | undefined;

  private allDeckImage: Image | undefined; // add rummy

  private allDeckImageRight: Image | undefined;

  private playerHandZone: Zone | undefined;

  private aiHandZone: Zone | undefined;

  private allDeckZone: Zone | undefined;

  private timer = 3;

  private timeEvent: any;

  private DROP_CARD_ZONE_RIGHT = 'dropCardZoneRight';

  private DROP_CARD_ZONE_LEFT = 'dropCardZoneLeft';

  constructor(config: any) {
    super('PlayScene', config);

    this.redDeck = new RedDeck();
    this.blackDeck = new BlackDeck();

    // create player instance
    this.player = new SpeedPlayer(
      'player',
      0,
      0,
      'deal',
      'Okuma',
      100
    );

    this.ai = new SpeedPlayer(
      'ai',
      0,
      0,
      'deal',
      'AI',
      100
    );
  }

  create(): void {
    this.setUpNewGame();

    // create player instance
    this.player = new SpeedPlayer(
      'player',
      0,
      0,
      'deal',
      'Okuma',
      100
    );

    this.ai = new SpeedPlayer(
      'ai',
      0,
      0,
      'deal',
      'AI',
      100
    );

    const width = Number(
      this.scene.manager.game.config.width
    );
    const height = Number(
      this.scene.manager.game.config.height
    );
    this.gameZone = this.add.zone(
      width * 0.5,
      height * 0.5,
      width,
      height
    );

    this.setUpAiNameText();
    this.setUpPlayerNameText();
    this.setUpAllDeckNameText();

    // create player hand zone
    this.playerHandZone = this.add.zone(
      0,
      0,
      game.card.width * 5,
      game.card.height
    );
    Phaser.Display.Align.To.TopCenter(
      this.playerHandZone as Zone,
      this.playerNameText as Text,
      0,
      style.gutter_size
    );

    // create ai hand zone
    this.aiHandZone = this.add.zone(
      0,
      0,
      game.card.width * 5,
      game.card.height
    );
    Phaser.Display.Align.To.BottomCenter(
      this.aiHandZone as Zone,
      this.aiNameText as GameObject,
      0,
      style.gutter_size
    );

    this.allDeckZone = this.add.zone(
      0,
      0,
      game.card.width * 5,
      game.card.height
    );
    Phaser.Display.Align.To.TopCenter(
      this.allDeckZone as Zone,
      this.allDeckNameText as Text,
      0,
      style.gutter_size
    );

    this.dropCardZone.left = this.add
      .zone(
        0,
        0,
        game.card.width * 1.5,
        game.card.height * 1.5
      )
      .setRectangleDropZone(
        game.card.width,
        game.card.height
      )
      .setName(this.DROP_CARD_ZONE_LEFT);
    this.dropCardZone.right = this.add
      .zone(
        0,
        0,
        game.card.width * 1.5,
        game.card.height * 1.5
      )
      .setRectangleDropZone(
        game.card.width,
        game.card.height
      )
      .setName(this.DROP_CARD_ZONE_RIGHT);

    this.setAllDeckImage();
    this.dealInitialCards();
  }

  update() {}

  private setUpNewGame() {
    this.redDeck = new RedDeck();
    this.redDeck.shuffle();
    this.blackDeck = new BlackDeck();
    this.blackDeck.shuffle();
  }

  private setUpAiNameText() {
    this.aiNameText = this.add.text(
      0,
      200,
      'AI',
      style.text
    );
    Phaser.Display.Align.In.TopCenter(
      this.aiNameText,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  private setUpPlayerNameText() {
    this.playerNameText = this.add.text(
      0,
      300,
      'Player',
      style.text
    );
    Phaser.Display.Align.In.BottomCenter(
      this.playerNameText,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  private setUpAllDeckNameText() {
    this.allDeckNameText = this.add.text(
      -200,
      300,
      'Deck',
      style.text
    );
    Phaser.Display.Align.In.Center(
      this.allDeckNameText,
      this.gameZone as GameObject,
      0,
      -20
    );
  }

  private setAllDeckImage() {
    this.allDeckImage = this.add.image(
      this.allDeckZone!.x - game.card.width,
      this.allDeckZone!.y + 150,
      game.card.back_key
    );
    this.allDeckImageRight = this.add.image(
      this.allDeckZone!.x + game.card.width,
      this.allDeckZone!.y + 150,
      game.card.back_key
    );
  }

  private dealInitialCards() {}
}
