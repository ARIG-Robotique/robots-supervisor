import {Point} from './Point';
import {Cercle} from './Cercle';
import {Rect} from './Rect';

export interface MouvementPath {
  type: 'PATH',
  path: Point[];
}

export interface MouvementRotation {
  type: 'ROTATION';
  angle: number;
  fromAngle: number;
  toAngle: number;
}

export interface MouvementTranslation {
  type: 'TRANSLATION';
  distance: number;
  fromPoint: Point;
  toPoint: Point;
}

export interface Position {
  x: number;
  y: number;
  angle: number;
  targetMvt: MouvementPath | MouvementRotation | MouvementTranslation;
  trajetAtteint: boolean;
  trajetEnApproche: boolean;
  typeAsserv: string;
  pointsLidar: Point[];
  collisions: Array<Cercle | Rect>;
  matchTime: number;
  score: number;
  action: string;
}
