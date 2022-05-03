import { Point } from '../Point';

export enum CouleurEchantillon {
  ROUGE = 'ROUGE',
  VERT = 'VERT',
  BLEU = 'BLEU',
  ROCHER = 'ROCHER',
  INCONNU = 'INCONNU',
}

export enum CouleurCarreFouille {
  JAUNE = 'JAUNE',
  VIOLET = 'VIOLET',
  INTERDIT = 'INTERDIT',
  INCONNU = 'INCONNU',
}

export const COLORS_ECHANTILLON: Record<CouleurEchantillon, string> = {
  ROUGE  : '#a71f22',
  VERT   : '#40b679',
  BLEU   : '#477bbe',
  ROCHER : '#da7c48',
  INCONNU: 'gray',
};

export const COLORS_CARRE_FOUILLE: Record<CouleurCarreFouille, string> = {
  JAUNE   : 'yellow',
  VIOLET  : 'purple',
  INTERDIT: 'red',
  INCONNU : 'gray',
};

export interface Echantillon extends Point {
  color: CouleurEchantillon;
  visibleColor: CouleurEchantillon;
  angle: number;
}

export interface CarreFouille {
  x: number;
  color: CouleurCarreFouille;
  bascule: boolean;
}

export interface GameStatus {
  stock: CouleurEchantillon[];
  echantillons: Echantillon[];
  carresFouille: CarreFouille[];
  siteDeRetour: string;
  siteDeRetourAutreRobot: string;
}
