import Button from '@/games/common/Factories/button';

export default interface MenuItem {
  scene: string;
  text: string;
  level: number;
  button: Button | undefined;
}
