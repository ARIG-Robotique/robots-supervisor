import {Point} from './Point';

interface ConfigElfa {
  JAUNE: Point;
  BLEU: Point;
}

export interface Table {

  name: string;
  width: number;
  height: number;
  imageRatio: number;

  elfa?: ConfigElfa;

}
