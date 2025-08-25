import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, ComponentRef, createComponent, Injectable, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-md shadow-lg transition-opacity duration-300"
      [ngClass]="{ 'opacity-0': fadeOut }"
    >
      {{ message }}
    </div>
  `
})
export class ToastComponent implements OnDestroy {
  message: string = '';
  fadeOut: boolean = false;
  private timeout: any;

  constructor() {}

  show(message: string, duration: number = 3000): void {
    this.message = message;
    this.fadeOut = false;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.fadeOut = true;

      setTimeout(() => {
        if (this.onDestroy) {
          this.onDestroy();
        }
      }, 300);
    }, duration);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  onDestroy: () => void = () => {};
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastRef: ComponentRef<ToastComponent> | null = null;

  constructor(private appRef: ApplicationRef) {}

  show(message: string, duration: number = 3000): void {
    // Remove existing toast if any
    this.hide();

    // Create and attach new toast component
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.appRef.injector
    });

    // Add to DOM
    document.body.appendChild(componentRef.location.nativeElement);
    this.appRef.attachView(componentRef.hostView);

    // Store reference
    this.toastRef = componentRef;

    // Set up cleanup
    componentRef.instance.onDestroy = () => {
      this.hide();
    };

    // Show toast with message
    componentRef.instance.show(message, duration);
  }

  private hide(): void {
    if (this.toastRef) {
      this.appRef.detachView(this.toastRef.hostView);
      this.toastRef.location.nativeElement.remove();
      this.toastRef.destroy();
      this.toastRef = null;
    }
  }
}
