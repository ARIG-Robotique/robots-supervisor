import { NgModule } from '@angular/core';
import { AsservissementService } from './asservissement.service';
import { CapteursService } from './capteurs.service';
import { CodeursService } from './codeurs.service';
import { ExecsService } from './execs.service';
import { MouvementsService } from './mouvements.service';
import { RobotsService } from './robots.service';
import { ServosService } from './servos.service';
import { StrategyService } from './strategy.service';

@NgModule({
  providers: [
    AsservissementService,
    CapteursService,
    CodeursService,
    ExecsService,
    MouvementsService,
    RobotsService,
    ServosService,
    StrategyService,
  ],
})
export class ServicesModule {

}
