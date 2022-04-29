import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AppToastService {
    toasts: any[] = [];

    show(text: string, options: any = {}) {
      this.toasts.push({ text, ...options });
    }

    success(text: string) {
        this.show(text, { classname: 'bg-success text-light' });
    }

    error(text: string) {
        this.show(text, { classname: 'bg-danger text-light' });
    }

    info(text: string) {
        this.show(text, { classname: 'bg-info' });
    }
  
    remove(toast) {
      this.toasts = this.toasts.filter(t => t !== toast);
    }
  
    clear() {
      this.toasts.splice(0, this.toasts.length);
    }
}
