import { Component, inject } from '@angular/core';
import { ToastsService } from '../toasts.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-toaster',
  imports: [ToastComponent],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
})
export class ToasterComponent {
  private readonly toastsService = inject(ToastsService);
  toasts = this.toastsService.toasts;
}
