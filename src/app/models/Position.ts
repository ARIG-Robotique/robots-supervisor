import { Action } from './Action';
import { Cercle } from './Cercle';
import { Point } from './Point';
import { Rect } from './Rect';
import { GameStatus } from './sailTheWorld/GameStatus';

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
  currentAction: string;
  actions: Action[];
  gameStatus: GameStatus;
  scoreStatus: { [K: string]: number };
}
