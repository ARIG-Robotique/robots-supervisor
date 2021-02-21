import { Point } from '../Point';
import { ECouleurBouee } from './ECouleurBouee';

export interface Bouee {
  couleur: ECouleurBouee;
  pt: Point;
}
