import { Component } from '@angular/core';

@Component({
  selector: 'arig-no-robot',
  template: `
    <div class="container">
      <div class="alert alert-danger mt-3" role="alert">
        Sélectionner au moins un robot dans la barre de navigation.
      </div>
    </div>

    <div class="container mt-5">
      <div class="row">
        <div class="col-sm"><img class="d-block m-auto" src="assets/logo.png"></div>
        <div class="col-sm"><img class="d-block m-auto" src="assets/coupe.png"></div>
      </div>

      <div class="row">
        <div class="col-sm"><img class="d-block m-auto" src="assets/3d/nerell.png"></div>
        <div class="col-sm"><img class="d-block m-auto" src="assets/3d/odin.png"></div>
        <div class="col-sm"><img class="d-block m-auto" src="assets/3d/elfa.png"></div>
        <div class="col-sm"><img class="d-block m-auto" src="assets/3d/sauron.png"></div>
      </div>
    </div>
  `,
})
export class NoRobotComponent {

}
