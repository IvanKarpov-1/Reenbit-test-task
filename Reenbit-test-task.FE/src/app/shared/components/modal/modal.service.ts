import { Injectable, signal } from '@angular/core';
import { ModalType } from './modat-type.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _currentModal = signal<ModalType | undefined>(undefined);
  currentModal = this._currentModal.asReadonly();

  openModal(modalType: ModalType) {
    this._currentModal.set(modalType);
  }

  closeModal() {
    this._currentModal.set(undefined);
  }
}
