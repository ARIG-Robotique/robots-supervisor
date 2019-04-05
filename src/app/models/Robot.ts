import {Execs} from './Execs';
import {Servo} from "./Servo";

export interface Robot {
  id?: number;
  host?: string;
  execs: Execs[];
  simulateur: boolean;
  checked: boolean;
  infos: any;

  capteurs: any;
  servos: Servo[];
  mouvements: any;
}
