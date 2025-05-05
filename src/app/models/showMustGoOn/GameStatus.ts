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

export interface StockFace {
    pinceGauche: boolean;
    pinceDroite: boolean;
    centreGauche: boolean;
    centreDroite: boolean;
    tiroirHaut: boolean;
    tiroirBas: boolean;
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
    faceAvantStock: StockFace;
    faceArriereStock: StockFace;
}
