import { Injectable, signal } from '@angular/core';
import { ModalType } from './modat-type.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  callback = signal<((a: any) => void) | undefined>(undefined);
  params = signal<any[]>([]);
  private _currentModal = signal<ModalType | undefined>(undefined);
  currentModal = this._currentModal.asReadonly();

  openModal(modalType: ModalType, callback?: (a: any) => void, ...params: any) {
    this.callback.set(callback);
    this.params.set(params);
    this._currentModal.set(modalType);
  }

  closeModal() {
    this._currentModal.set(undefined);
  }
}
