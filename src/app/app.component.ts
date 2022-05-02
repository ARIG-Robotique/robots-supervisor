import { Component, HostBinding } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconDefinition, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector   : 'arig-app',
  templateUrl: './app.component.html',
})
export class AppComponent {

  @HostBinding('class')
  cssClass = 'd-flex flex-column';

  icons: [IconPrefix, IconName][] = [];

  constructor(private library: FaIconLibrary) {
  }

  loadIcons() {
    if (this.icons.length === 0) {
      const definitions = (this.library as any).definitions as { [prefix: string]: { [name: string]: IconDefinition } };

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
