import { Injectable, Signal, WritableSignal } from '@angular/core';

interface State<T, K extends keyof T> {
  object: T | Signal<T>;
  property: K | null;
  oldValue: T[K] | any;
}

@Injectable({
  providedIn: 'root',
})
export class ValuesModifierService {
  private readonly storage: Map<number, State<any, any>> = new Map();

  update<T, K extends keyof T>(
    obj: T | Signal<T>,
    prop: K | null,
    value: T[K] | T[K][]
  ): number {
    const index = this.getRandomIndex();

    let state: Partial<State<T, K>> = {
      object: obj,
      property: prop,
    };

    state.oldValue = this._update(obj, prop, value);

    // @ts-ignore
    this.storage.set(index, state);

    return index;
  }

  restore(index: number): boolean {
    const state = this.storage.get(index);
    this.storage.delete(index);

    if (!state) {
      return false;
    }

    const { object, property, oldValue } = state;

    const value = this._update(object, property, oldValue);

    return value !== null;
  }

  private _update<T, K extends keyof T>(
    obj: T | Signal<T>,
    prop: K | null,
    value: T[K] | T[K][]
  ): any {
    let oldValue: any;

    if (prop === null && this.isWritableSignal(obj)) {
      oldValue = obj();
      obj.set(value as any);
      return oldValue;
    }

    if (prop === null) {
      return null;
    }

    if (this.isWritableSignal(obj)) {
      oldValue = obj()[prop];
      obj.update((current) => ({
        ...current,
        [prop]: value,
      }));
      return oldValue;
    } else if (this.isSignal(obj)) {
      oldValue = obj()[prop];
      // @ts-ignore
      obj()[prop] = value;
      return oldValue;
    } else {
      oldValue = obj[prop];
      // @ts-ignore
      obj[prop] = value;
      return oldValue;
    }
  }

  private isSignal = <T>(obj: T | Signal<T>): obj is Signal<T> =>
    typeof obj === 'function';

  private isWritableSignal = <T>(
    obj: T | Signal<T>
  ): obj is WritableSignal<T> =>
    this.isSignal(obj) &&
    'set' in obj &&
    typeof (obj as WritableSignal<T>).set === 'function';

  private getRandomIndex() {
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(10000);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }
}
