import { NgModule } from '@angular/core';
import { AsservissementService } from '../asservissement.service';
import { BrasService } from '../bras.service';
import { CapteursService } from '../capteurs.service';
import { CodeursService } from '../codeurs.service';
import { ExecsService } from '../execs.service';
import { IOService } from '../io.service';
import { MouvementsService } from '../mouvements.service';
import { RobotsService } from '../robots.service';
import { ServosService } from '../servos.service';
import { StrategyService } from '../strategy.service';
import { AsservissementMockService } from './asservissement.mock-service';
import { BrasMockService } from './bras.mock-service';
import { CapteursMockService } from './capteurs.mock-service';
import { CodeursMockService } from './codeurs.mock-service';
import { ExecsMockService } from './execs.mock-service';
import { IOMockService } from './io.mock-service';
import { MouvementsMockService } from './mouvements.mock-service';
import { RobotsMockService } from './robots.mock-service';
import { ServosMockService } from './servos.mock-service';
import { StrategyMockService } from './strategy.mock-service';

@NgModule({
    providers: [
        { provide: AsservissementService, useClass: AsservissementMockService },
        { provide: CapteursService, useClass: CapteursMockService },
        { provide: BrasService, useClass: BrasMockService },
        { provide: CodeursService, useClass: CodeursMockService },
        { provide: ExecsService, useClass: ExecsMockService },
        { provide: IOService, useClass: IOMockService },
        { provide: MouvementsService, useClass: MouvementsMockService },
        { provide: RobotsService, useClass: RobotsMockService },
        { provide: ServosService, useClass: ServosMockService },
        { provide: StrategyService, useClass: StrategyMockService },
    ],
})
export class ServicesMockModule {}
