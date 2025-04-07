import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class NavigatorService {
  readonly lastRoute = signal<any[]|undefined>(undefined);
  private readonly _router = inject(Router);

  back = () => this._router.navigate(this.lastRoute() ?? ["/home"]);  
  home = () => this._router.navigate(["/home"]);
  auth = () => this._router.navigate(["/auth"]);
  notFound = () => this._router.navigate(["/not-found"]);

  imageList = () => this._router.navigate(["/image-list"]);
  imageCreate = () => this._router.navigate(["/image-create"]);
  imageView = (id: number) => this._router.navigate(["/image", id]);
  imageEdit = (id: number) => this._router.navigate(["/image-edit", id]);
}
