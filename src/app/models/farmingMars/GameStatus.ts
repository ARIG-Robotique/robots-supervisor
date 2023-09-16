import { Point } from '../Point';

export enum Team {
    BLEU = 'BLEU',
    JAUNE = 'JAUNE',
}

export enum TypePlante {
    FRAGILE = 'FRAGILE',
    RESISTANTE = 'RESISTANTE',
}

export enum DistribPot {
    L1 = 'L1',
    L2 = 'L2',
    LB = 'LB',
    R1 = 'R1',
    R2 = 'R2',
    RB = 'RB',
}

export enum AireDepose {
    L1 = 'L1',
    L2 = 'L2',
    L3 = 'L3',
    R1 = 'R1',
    R2 = 'R2',
    R3 = 'R3',
}

export enum Jardiniere {
    LH = 'LH',
    L1 = 'L1',
    L2 = 'L2',
    RH = 'RH',
    R1 = 'R1',
    R2 = 'R2',
}

export interface PlanteEnPot {
    type: TypePlante;
    pot: boolean;
    pt?: Point;
}

export type PanneauSolaire = Record<Team, boolean>;
export interface GameStatus {
    distribsPlantes: number[]; // 6 élements à partir du haut en sens trigo
    distribsPots: Record<DistribPot, number>;
    airesDepose: Record<AireDepose, PlanteEnPot[]>;
    jardinieres: Record<Jardiniere, PlanteEnPot[]>;
    plantes: PlanteEnPot[];
    panneaux: PanneauSolaire[]; // 9 élements de gauche à droite
}
