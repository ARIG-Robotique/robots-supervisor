export interface Capteurs {
    numerique: { [K: string]: boolean };
    analogique: { [K: string]: number };
    text: { [K: string]: string };
    couleurs: { [K: string]: string };
}
