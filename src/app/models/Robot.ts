export interface Robot {
  id: number;
  host: string;
  name: string;
  simulateur: boolean;
}

export interface SelectedRobot extends Robot {
  main: boolean;
}
