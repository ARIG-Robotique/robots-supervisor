import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { AllConfigBras, AnglesBras, BRAS, Bras, CurrentBras, PointBras } from '../../models/Bras';
import { Robot } from '../../models/Robot';
import { BrasService } from '../bras.service';

function toRadians(degrees) {
  return degrees / 180 * Math.PI;
}

function toDegrees(radians) {
  return Math.round(radians / Math.PI * 180);
}

function alKashiAngleRad(a: number, b: number, c: number): number {
  return Math.acos((Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b));
}

@Injectable()
export class BrasMockService extends BrasService {

  config: AllConfigBras = {
    bas            : {
      x    : 54, y: 51,
      r1   : 64, r2: 71, r3: 35,
      a1Min: -10, a1Max: 110, preferA1Min: true,
      a2Min: -105, a2Max: 110,
      a3Min: -100, a3Max: 100,
    },
    haut           : {
      x    : 54, y: 261,
      r1   : 64, r2: 71, r3: 35,
      a1Min: -135, a1Max: 0, preferA1Min: false,
      a2Min: -90, a2Max: 90,
      a3Min: -100, a3Max: 100,
    },
    statesBas      : [
      'INIT',
      'SECU',
      'STOCK_PRISE_1',
      'STOCK_PRISE_2',
      'STOCK_PRISE_3',
      'STOCK_PRISE_4',
      'STOCK_PRISE_5',
      'STOCK_PRISE_6',
      'STOCK_DEPOSE_1',
      'STOCK_DEPOSE_2',
      'STOCK_DEPOSE_3',
      'STOCK_DEPOSE_4',
      'STOCK_DEPOSE_5',
      'STOCK_DEPOSE_6',
      'STOCK_ENTREE',
      'ECHANGE',
      'SOL_APPROCHE',
      'SOL_PRISE',
      'SOL_DEPOSE',
    ],
    statesHaut     : [
      'INIT',
      'STOCK_PRISE_1',
      'STOCK_PRISE_2',
    ],
    transitionsBas : [
      { INIT: 'STOCK_ENTREE' },
      { INIT: 'SECU' },
      { SECU: 'STOCK_ENTREE' },
      { STOCK_ENTREE: 'SECU' },
      { SECU: 'SOL_APPROCHE' },
      { SOL_APPROCHE: 'SECU' },
    ],
    transitionsHaut: [
      { INIT: 'STOCK_PRISE_1' },
      { STOCK_PRISE_1: 'STOCK_PRISE_2' },
      { STOCK_PRISE_2: 'STOCK_PRISE_1' },
    ],
  };

  bras: Bras<CurrentBras> = {
    bas : { state: 'INIT', a1: 0, a2: 0, a3: 0, x: 0, y: 0, a: 0 },
    haut: { state: 'INIT', a1: 0, a2: 0, a3: 0, x: 0, y: 0, a: 0 },
  };

  constructor(http: HttpClient) {
    super(http);
  }

  getConfig(robot: Robot): Observable<AllConfigBras> {
    return of(this.config);
  }

  getCurrent(robot: Robot): Observable<Bras<CurrentBras>> {
    return of(cloneDeep(this.bras));
  }

  setBras(robot: Robot, bras: BRAS, { x, y, a }: PointBras): Observable<boolean> {
    return this.calculerAngles(robot, bras, { x, y, a })
      .pipe(
        map(result => {
          if (!result || result.a1Error || result.a2Error || result.a3Error) {
            return false;
          } else {
            this.bras[bras] = { ...result, x, y, a, state: null };
            return true;
          }
        })
      );
  }

  setBrasByName(robot: Robot, bras: BRAS, name: string): Observable<void> {
    this.bras[bras] = { ...this.bras[bras], state: name };
    return of(null);
  }

  calculerAngles(robot: Robot, bras: BRAS, pt: PointBras): Observable<AnglesBras> {
    return of(this.calculerAnglesInternal(robot, bras, pt));
  }

  calculerAnglesInternal(robot: Robot, bras: BRAS, { x, y, a }: PointBras, enableLog = true, preferA1Min?: boolean): AnglesBras {
    const configBras = this.config[bras];

    if (preferA1Min === undefined) {
      preferA1Min = configBras.preferA1Min;
    }

    const a3Absolute = toRadians(a);

    // Calcul de l'axe du servo moteur 3
    const xTemp = x - Math.cos(a3Absolute) * configBras.r3;
    const yTemp = y - Math.sin(a3Absolute) * configBras.r3;

    // Calcul de r
    const dX = xTemp - configBras.x;
    const dY = yTemp - configBras.y;
    const r = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));

    if (r > configBras.r1 + configBras.r2) {
      console.warn(`Impossible d'atteindre le point: r=${r} r1+r2=${configBras.r1 + configBras.r2}`);
      return null;
    }

    // Calcul de alpha1 (angle du servo moteur 1)
    const alpha3 = Math.atan2(dY, dX);
    const alpha4 = alKashiAngleRad(configBras.r1, r, configBras.r2);
    let alpha1 = alpha4 + alpha3;

    // Calcul de alpha2 (angle du servo moteur 2)
    const alpha6 = alKashiAngleRad(configBras.r2, configBras.r1, r);
    let alpha2 = alpha6 - Math.PI;

    // symétrise alpha1 et alpha2
    if (preferA1Min) {
      alpha1 -= (alpha1 - alpha3) * 2;
      alpha2 *= -1;
    }

    // Calcul de alpha3 (angle du servo moteur 3)
    let a3 = toDegrees(a3Absolute - (alpha1 + alpha2));
    if (a3 < configBras.a3Min && a3 + 360 <= configBras.a3Max) {
      a3 += 360;
    }
    if (a3 > configBras.a3Max && a3 - 360 >= configBras.a3Min) {
      a3 -= 360;
    }

    const result: AnglesBras = {
      a1: toDegrees(alpha1),
      a2: toDegrees(alpha2),
      a3: a3,
    };

    result.a1Error = result.a1 < configBras.a1Min || result.a1 > configBras.a1Max;
    result.a2Error = result.a2 < configBras.a2Min || result.a2 > configBras.a2Max;
    result.a3Error = result.a3 < configBras.a3Min || result.a3 > configBras.a3Max;

    // si l'inversion entraine une erreur, on essaye sans inversion
    if (preferA1Min && (result.a1Error || result.a2Error || result.a3Error)) {
      const newResult = this.calculerAnglesInternal(robot, bras, { x, y, a }, false, false);
      if (newResult && !newResult.a1Error && !newResult.a2Error && !newResult.a3Error) {
        return newResult;
      }
    }

    if (enableLog) {
      if (result.a1Error) {
        console.warn(`Impossible d'atteindre le point: a1=${result.a1} a1Min=${configBras.a1Min} a1Max=${configBras.a1Max}`);
      }
      if (result.a2Error) {
        console.warn(`Impossible d'atteindre le point: a2=${result.a2} a2Min=${configBras.a2Min} a2Max=${configBras.a2Max}`);
      }
      if (result.a3Error) {
        console.warn(`Impossible d'atteindre le point: a3=${result.a3} a3Min=${configBras.a3Min} a3Max=${configBras.a3Max}`);
      }
    }

    return result;
  }

}
