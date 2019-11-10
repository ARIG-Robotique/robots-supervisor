export interface ServoPos {
  name: string;
  value: number;
}

export interface Servo {
  id: number;
  name: string;
  currentSpeed: number;
  currentPosition: number;
  minPosition: number;
  maxPosition: number;
  positions: ServoPos[];
}

export interface Servos {
  [group: string]: Servo[];
}

export interface ServoGroup {
  name: string;
  servos: Servo[];
}
