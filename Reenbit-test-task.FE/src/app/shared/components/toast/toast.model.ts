export type ToastType =
  | 'info'
  | 'success'
  | 'error'
  | 'warning'
  | 'new-message';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
  params?: any[];
}
