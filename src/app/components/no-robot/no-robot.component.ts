import { Component } from '@angular/core';

@Component({
  selector: 'arig-no-robot',
  template: `
    <div class="container">
      <div class="alert alert-danger mt-3" role="alert">
        Sélectionner au moins un robot dans la barre de navigation.
      </div>
    </div>
  `,
})
export class NoRobotComponent {

}
