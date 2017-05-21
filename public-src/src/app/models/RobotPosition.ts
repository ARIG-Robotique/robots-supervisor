import {Point} from './Point';

export interface RobotPosition {

  x: number;
  y: number;
  angle: number;

  targetX?: number;
  targetY?: number;
  targetAngle?: number;

  trajetAtteint?: boolean;
  trajetEnApproche?: boolean;

  pointsLidar?: Point[];
  pointsCapteurs?: Point[];

}
