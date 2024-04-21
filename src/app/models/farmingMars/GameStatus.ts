
export enum Team {
    BLEU = 'BLEU',
    JAUNE = 'JAUNE',
}

export enum TypePlante {
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
    JAUNE_SUD = 'JAUNE_SUD'
}

export enum Emplacement {
    NORD = 'NORD',
    MILIEU = 'MILIEU',
    SUD = 'SUD',
}

export enum CouleurPanneauSolaire {
    TEMP_JAUNE = 'TEMP_JAUNE',
    TEMP_BLEU = 'TEMP_BLEU',
    JAUNE = 'JAUNE',
    BLEU = 'BLEU',
    JAUNE_ET_BLEU = 'JAUNE_ET_BLEU',
    AUCUNE = 'AUCUNE'
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
export interface GameStatus {
    stocksPots: Record<StockPotsId, boolean>;
    airesDepose: Record<Emplacement, Plante[]>;
    jardinieres: Record<Emplacement, Plante[]>;
    plantes: Plante[];
    panneaux: PanneauSolaire[]; // 9 élements de gauche à droite
}
