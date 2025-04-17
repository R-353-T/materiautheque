import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class HeaderService {
  private readonly _loading = signal<boolean>(false);
  private readonly _loadingMap: { [k: string]: boolean } = {};

  readonly loading = this._loading.asReadonly();
  readonly title = signal<string>("");

  start(key: string) {
    this._loadingMap[key] = true;
    this._loading.set(true);
  }

  stop(key: string) {
    this._loadingMap[key] = false;
    const count =
      Object.values(this._loadingMap).filter((v) => v === true).length;
    this._loading.set(count > 0);
  }
}
