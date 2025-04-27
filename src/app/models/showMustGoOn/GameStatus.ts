export enum Team {
    BLEU = 'BLEU',
    JAUNE = 'JAUNE',
}

export enum GradinBrutId {
    JAUNE_RESERVE = "JAUNE_RESERVE",
    JAUNE_HAUT_GAUCHE = "JAUNE_HAUT_GAUCHE",
    JAUNE_MILIEU_CENTRE = "JAUNE_MILIEU_CENTRE",
    JAUNE_BAS_GAUCHE = "JAUNE_BAS_GAUCHE",
    JAUNE_BAS_CENTRE = "JAUNE_BAS_CENTRE",

    BLEU_RESERVE = "BLEU_RESERVE",
    BLEU_HAUT_DROITE = "BLEU_HAUT_DROITE",
    BLEU_MILIEU_CENTRE = "BLEU_MILIEU_CENTRE",
    BLEU_BAS_DROITE = "BLEU_BAS_DROITE",
    BLEU_BAS_CENTRE = "BLEU_BAS_CENTRE",
}

export interface GradinBrut {
    id?: GradinBrutId;
    x?: number;
    y?: number;
    present?: boolean;
    bloque?: boolean;
}

export interface Tiroir {
    haut: boolean;
    bas: boolean;
}

export interface Tiroirs {
    avant: Tiroir;
    arriere: Tiroir;
}

export interface Pince {
    gauche: boolean;
    droite: boolean;
}

export interface Pinces {
    avant: Pince;
    arriere: Pince;
}

export interface AiresConstruction {
    grandEquipe: boolean[][];
    petitEquipe: boolean[][];
    grandAdverse: boolean[][];
    petitAdverse: boolean[][];
}

export interface GameStatus {
    gradinBrutStock: GradinBrut[];
    airesConstruction: AiresConstruction;
    tiroirs: Tiroirs;
    pinces: Pinces;
}
