import {Robot} from './Robot';

export interface RobotUI extends Robot {
  copying: boolean;
  message: string;
}
