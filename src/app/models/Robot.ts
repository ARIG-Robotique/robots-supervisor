import {Execs} from './Execs';

export interface Robot {
  id?: number;
  host?: string;
  execs: Execs[];
  simulateur: boolean;
  checked: boolean;
}
