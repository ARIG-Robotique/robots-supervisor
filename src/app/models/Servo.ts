export interface ServoPosition {
  name: string;
  value: number;
  speed: number;
}

export interface Servo {
  id: number;
  name: string;
  currentSpeed: number;
  currentPosition: number;
  positions: { [name: string]: ServoPosition };
}

export interface ServoGroup {
  id: number;
  name: string;
  servos: Servo[];
  batch: string[];
}

export type Servos = ServoGroup[];
