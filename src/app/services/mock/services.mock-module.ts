import { NgModule } from '@angular/core';
import { AsservissementService } from '../asservissement.service';
import { CapteursService } from '../capteurs.service';
import { CodeursService } from '../codeurs.service';
import { ExecsService } from '../execs.service';
import { MouvementsService } from '../mouvements.service';
import { RobotsService } from '../robots.service';
import { ServosService } from '../servos.service';
import { AsservissementMockService } from './asservissement.mock-service';
import { CapteursMockService } from './capteurs.mock-service';
import { CodeursMockService } from './codeurs.mock-service';
import { ExecsMockService } from './execs.mock-service';
import { MouvementsMockService } from './mouvements.mock-service';
import { RobotsMockService } from './robots.mock-service';
import { ServosMockService } from './servos.mock-service';

@NgModule({
  providers: [
    {provide: AsservissementService, useClass: AsservissementMockService},
    {provide: CapteursService, useClass: CapteursMockService},
    {provide: CodeursService, useClass: CodeursMockService},
    {provide: ExecsService, useClass: ExecsMockService},
    {provide: MouvementsService, useClass: MouvementsMockService},
    {provide: RobotsService, useClass: RobotsMockService},
    {provide: ServosService, useClass: ServosMockService},
  ],
})
export class ServicesMockModule {

}
