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
  minSpeed: number;
  maxSpeed: number;
  positions: ServoPos[];
}

export interface ServosResponse {
  key: string,
  value: Servo[][]
}

export interface ServoGroup {
  name: string,
  servos: ServoPair[]
}

export interface ServoPair {
  left: Servo,
  right: Servo
}
