import {Point} from './Point';
import {Rect} from './Rect';

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

  targetX?: number;
  targetY?: number;
  targetAngle?: number;
  targetMvt?: Mouvement;

  trajetAtteint?: boolean;
  trajetEnApproche?: boolean;

  pointsLidar?: Point[];
  pointsCapteurs?: Point[];
  collisions?: Rect[];

}
