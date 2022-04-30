import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AppToastService {
    toasts: any[] = [];

    show(text: string, options: any = {}) {
      this.toasts.push({ text, ...options });
    }

    success(text: string) {
        this.show(text, { classname: 'bg-success' });
    }

    error(text: string) {
        this.show(text, { classname: 'bg-danger' });
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
