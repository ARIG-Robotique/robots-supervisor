import {Table} from '../models/Table';

export const Tables: Table[] = [
  {
    name: 'officiel',
    width: 3000,
    height: 2000,
    imageRatio: 1050 / 3000,

    elfa: {
      JAUNE: {
        x: 240,
        y: 219,
        a: -16
      },
      BLEU: {
        x: 2700,
        y: 210,
        a: 0
      }
    }
  },
  {
    name: 'test',
    width: 1300,
    height: 2000,
    imageRatio: 459 / 1500
  }
];
