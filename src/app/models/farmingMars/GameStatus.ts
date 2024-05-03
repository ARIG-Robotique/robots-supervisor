export enum Team {
    BLEU = 'BLEU',
    JAUNE = 'JAUNE',
}

export enum TypePlante {
    AUCUNE = 'AUCUNE',
    FRAGILE = 'FRAGILE',
    RESISTANTE = 'RESISTANTE',
    INCONNU = 'INCONNU',
}

export enum StockPotsId {
    BLEU_NORD = 'BLEU_NORD',
    BLEU_MILIEU = 'BLEU_MILIEU',
    BLEU_SUD = 'BLEU_SUD',
    JAUNE_NORD = 'JAUNE_NORD',
    JAUNE_MILIEU = 'JAUNE_MILIEU',
    JAUNE_SUD = 'JAUNE_SUD',
}

export enum Emplacement {
    NORD = 'NORD',
    MILIEU = 'MILIEU',
    SUD = 'SUD',
}

export enum CouleurPanneauSolaire {
    WIP_JAUNE = 'WIP_JAUNE',
    WIP_BLEU = 'WIP_BLEU',
    JAUNE = 'JAUNE',
    BLEU = 'BLEU',
    JAUNE_ET_BLEU = 'JAUNE_ET_BLEU',
    AUCUNE = 'AUCUNE',
}

export enum ContenuBras {
    VIDE = 'VIDE',
    PLANTE_INCONNU = 'PLANTE_INCONNU',
    PLANTE_RESISTANTE = 'PLANTE_RESISTANTE',
    PLANTE_FRAGILE = 'PLANTE_FRAGILE',
    PLANTE_DANS_POT = 'PLANTE_DANS_POT',
    POT = 'POT',
    DEUX_POTS = 'DEUX_POTS',
}

export interface Plante {
    type: TypePlante;
    dansPot: boolean;
    id?: unknown;
    x?: number;
    y?: number;
}

export interface PanneauSolaire {
    color: CouleurPanneauSolaire;
}

export interface StockPots {
    id: StockPotsId;
    present: boolean;
    bloque: boolean;
}

export interface GameStatus {
    stocksPots: StockPots[];
    airesDepose: Record<Emplacement, Plante[]>;
    jardinieres: Record<Emplacement, Plante[]>;
    plantes: Plante[];
    panneaux: PanneauSolaire[];
    brasAvant: Plante[];
    brasArriere: Plante[];
    stock: Plante[];
}
