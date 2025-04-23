import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { NavigationEnd, NavigationExtras, Router } from "@angular/router";
import { filter } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  /** Pile des URL visitées */
  private _history: string[] = [];

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this._history.push(e.urlAfterRedirects));
  }

  getHistory(): readonly string[] {
    return [...this._history];
  }

  go(path: string | any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }

  back(fallback = "/"): void {
    if (this._history.length > 1) {
      this._history.pop();
      const previous = this._history.pop();
      if (previous) {
        this.router.navigateByUrl(previous);
        return;
      }
    }

    if (window.history.state?.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl(fallback);
    }
  }

  replace(path: string | any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(
      Array.isArray(path) ? path : [path],
      { ...extras, replaceUrl: true },
    );
  }

  clear(): void {
    this._history = [];
  }

  goToHome(): Promise<boolean> {
    return this.go("/home");
  }

  goToLogin(): Promise<boolean> {
    return this.go("/authentication/login");
  }

  goToImages(): Promise<boolean> {
    return this.go("/images");
  }

  goToImage(id: number): Promise<boolean> {
    return this.go(`/image/${id}`);
  }
}
