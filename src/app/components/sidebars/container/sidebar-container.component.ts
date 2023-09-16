import { Component, Directive, Input, TemplateRef } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AbstractComponent } from 'app/components/abstract.component';

@Directive()
export class AbstractSidebarContainer extends AbstractComponent {
    sidebarButtons: TemplateRef<any>;
}

@Component({
    selector: 'arig-sidebar-container',
    templateUrl: 'sidebar-container.component.html',
})
export class SidebarContainerComponent {
    @Input()
    sidebarButtons: TemplateRef<any>;

    constructor(private offcanvas: NgbActiveOffcanvas) {}

    close() {
        this.offcanvas.close();
    }
}
