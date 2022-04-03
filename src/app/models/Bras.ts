export type BRAS = 'bas' | 'haut';

export type ConfigBras = {
  x: number;
  y: number;
  r1: number;
  r2: number;
  r3: number;
  a1Min: number;
  a1Max: number;
  preferA1Min: boolean
  a2Min: number;
  a2Max: number;
  a3Min: number;
  a3Max: number;
};

export type AnglesBras = {
  a1: number,
  a2: number,
  a3: number,
  a1Error?: boolean;
  a2Error?: boolean;
  a3Error?: boolean;
};

export type PointBras = {
  x: number;
  y: number;
  a: number;
};

export type CurrentBras = AnglesBras & PointBras & {
  state: string;
};

export type Bras<T> = { bas: T, haut: T, };

export type AllConfigBras = {
  bas: ConfigBras;
  haut: ConfigBras;
  statesBas: string[];
  statesHaut: string[];
  transitionsBas: Array<{ [K: string]: string }>;
  transitionsHaut: Array<{ [K: string]: string }>;
};
