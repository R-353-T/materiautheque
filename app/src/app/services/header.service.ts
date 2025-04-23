import { inject, Injectable, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable({ providedIn: "root" })
export class HeaderService extends TitleStrategy {
  private readonly _loading = signal<boolean>(false);
  private readonly _loadingMap: { [k: string]: boolean } = {};
  private readonly _titleService = inject(Title);

  readonly loading = this._loading.asReadonly();

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

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);

    if(title !== undefined) {
      this._titleService.setTitle(title);
    } else {
      this._titleService.setTitle("Materiautheque");
    }
  }
}
