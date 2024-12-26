import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from './toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  private counter: number = 0;
  private readonly _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  showToast(type: ToastType, message: string, ...params: any[]): void;
  showToast(
    type: ToastType,
    message: string,
    duration: number,
    ...params: any[]
  ): void;
  showToast(
    type: ToastType,
    message: string,
    durationOrParam: number | any = 5000,
    ...params: any[]
  ): void {
    const id = this.counter++;
    let duration: number;
    if (typeof durationOrParam === 'number') {
      duration = durationOrParam;
    } else {
      duration = 5000;
      params.unshift(durationOrParam);
    }

    const toast: Toast = {
      id: id,
      type: type,
      message: message,
      params: params,
      duration: duration,
    };

    this._toasts.update((current) => [...current, toast]);

    setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id: number) {
    this._toasts.set(this._toasts().filter((toast) => toast.id !== id));
  }
}
