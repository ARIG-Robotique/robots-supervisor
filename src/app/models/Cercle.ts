import {Point} from './Point';

export interface Cercle {
  type: 'CERCLE';
  centre: Point;
  rayon: number;
}
