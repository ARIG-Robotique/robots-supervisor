import { Point } from './Point';

export interface Cercle {
    type: 'CIRCLE';
    centre: Point;
    rayon: number;
}
