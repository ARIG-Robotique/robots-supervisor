export interface Robot {
  id: number;
  host: string;
  name: string;
  simulateur: boolean;
  login: string;
  pwd: string;
}

export interface SelectedRobot extends Robot {
  main: boolean;
}
