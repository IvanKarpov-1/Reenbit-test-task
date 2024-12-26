import { Component, inject, input } from '@angular/core';
import { Toast } from '../toast.model';
import { NgClass } from '@angular/common';
import { ProfilePictureComponent } from '../../profile-picture/profile-picture.component';
import { ToastsService } from '../toasts.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toast',
  imports: [NgClass, ProfilePictureComponent, RouterLink],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  toast = input.required<Toast>();
  private readonly toastsService = inject(ToastsService);

  close() {
    this.toastsService.removeToast(this.toast().id);
  }
}
