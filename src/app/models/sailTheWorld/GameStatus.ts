import { Point } from '../Point';

export enum EColor {
  ROUGE = 'ROUGE',
  VERT = 'VERT',
  BLEU = 'BLEU',
  ROCK = 'ROCK',
  UNKNOWN = 'UNKNOWN',
}

export const COLORS: Record<EColor, string> = {
  ROUGE  : '#a71f22',
  VERT   : '#40b679',
  BLEU   : '#477bbe',
  ROCK   : '#da7c48',
  UNKNOWN: 'grey',
};

export interface Echantillon extends Point {
  color: EColor;
  visibleColor: EColor;
  angle: number;
}

export interface GameStatus {
  echantillons: Echantillon[];
}
