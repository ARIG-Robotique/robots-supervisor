import {Execs} from './Execs';
import {Servo} from './Servo';
import {RobotPosition} from './RobotPosition';

export interface Robot {
  id?: number;
  host?: string;
  execs: Execs[];
  simulateur: boolean;
  checked: boolean;
  dir: string;
  name: string;
  login: string;
  pwd: string;

  infos: any;
  capteurs: any;
  servos: Servo[];
  mouvements: any;
  team: string;

  position: RobotPosition;
}
