import { ECouleurBouee } from './ECouleurBouee';
import { EDirectionGirouette } from './EDirectionGirouette';

export interface GameStatus {
  bouees: boolean[];
  grandPort: ECouleurBouee[];
  grandChenalVert: ECouleurBouee[];
  grandChenalRouge: ECouleurBouee[];
  petitPort: ECouleurBouee[];
  petitChenalVert: ECouleurBouee[];
  petitChenalRouge: ECouleurBouee[];
  pincesAvant: ECouleurBouee[];
  pincesArriere: ECouleurBouee[];
  phare: boolean;
  mancheAAir1: boolean;
  mancheAAir2: boolean;
  girouette: EDirectionGirouette;
  couleursEcueilCommunEquipe: ECouleurBouee[];
  couleursEcueilCommunAdverse: ECouleurBouee[];
}
