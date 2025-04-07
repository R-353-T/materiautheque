import { Injectable, signal, Signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class HeaderService {
  readonly isLoadingSignal: Signal<boolean>;
  readonly titleSignal = signal<string>('');

  private readonly _isLoading = signal<boolean>(false);
  private readonly _loadingMap: { [key: string]: boolean } = {};

  constructor() {
    this.isLoadingSignal = this._isLoading;
  }

  startLoading(key: string) {
    this._loadingMap[key] = true;
    this._isLoading.set(true);
  }

  stopLoading(key: string) {
    this._loadingMap[key] = false;
    const count = Object.values(this._loadingMap).filter((value) => value).length;

    if(count === 0) {
      this._isLoading.set(false);
    }
  }
}
