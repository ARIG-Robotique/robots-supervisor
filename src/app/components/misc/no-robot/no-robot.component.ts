import { Component } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconDefinition, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

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
                <div class="col-6"><img class="d-block m-auto" src="assets/logo.png" /></div>
                <div class="col-6"><img class="d-block m-auto" src="assets/coupe.png" /></div>
            </div>

            <div class="row">
                <div class="col-3"><img class="d-block m-auto" src="assets/3d/nerell.png" /></div>
                <div class="col-3"><img class="d-block m-auto" src="assets/3d/odin.png" /></div>
                <div class="col-3"><img class="d-block m-auto" src="assets/3d/elfa.png" /></div>
                <div class="col-3"><img class="d-block m-auto" src="assets/3d/sauron.png" /></div>
            </div>
        </div>

        <div class="mt-3">
            <button class="btn btn-secondary" (click)="loadIcons()">Icones</button>

            <ul class="list-group" style="flex-direction: row; flex-wrap: wrap;">
                <li class="list-group-item d-flex" style="width: 25%" *ngFor="let icon of icons">
                    <fa-icon [icon]="icon" size="2x"></fa-icon>
                    <span class="ml-3">{{ icon | json }}</span>
                </li>
            </ul>
        </div>
    `,
})
export class NoRobotComponent {
    icons: [IconPrefix, IconName][] = [];

    constructor(private library: FaIconLibrary) {}

    loadIcons() {
        if (this.icons.length === 0) {
            const definitions = (this.library as any).definitions as {
                [prefix: string]: { [name: string]: IconDefinition };
            };

            for (const [prefix, icons] of Object.entries(definitions)) {
                for (const name of Object.keys(icons)) {
                    this.icons.push([prefix, name] as any);
                }
            }
        } else {
            this.icons.length = 0;
        }
    }
}
