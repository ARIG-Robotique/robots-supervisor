import {Point} from './Point';
import {Cercle} from './Cercle';

interface Mouvement {
  type: string;

  // PATH
  path?: Point[];

  // ROTATION
  angle?: number;
  fromAngle?: number;
  toAngle?: number;

  // TRANSLATION
  distance?: number;
  fromPoint?: Point;
  toPoint?: Point;
}

export interface RobotPosition {

  x: number;
  y: number;
  angle: number;

  matchTime?:number;

  targetX?: number;
  targetY?: number;
  targetAngle?: number;
  targetMvt?: Mouvement;

  trajetAtteint?: boolean;
  trajetEnApproche?: boolean;

  pointsLidar?: Point[];
  pointsCapteurs?: Point[];
  collisions?: Cercle[];

}
