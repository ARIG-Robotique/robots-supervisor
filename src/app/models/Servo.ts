export interface ServoPosition {
  name: string;
  value: number;
}

export interface ServoConfig {
  id: number;
  name: string;
  currentSpeed: number;
  currentPosition: number;
  positions: ServoPosition[];
}

export interface ServoGroup {
  id: number;
  name: string;
  servos: ServoConfig[];
  batch: ServoPosition[];
}

export type Servos = ServoGroup[];
