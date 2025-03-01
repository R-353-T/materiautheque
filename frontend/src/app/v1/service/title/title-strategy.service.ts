import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { HeaderService } from '../header/header.service';

@Injectable({
  providedIn: 'root'
})
export class TitleStrategyService extends TitleStrategy {

  private readonly headerService = inject(HeaderService);
  private readonly titleService = inject(Title);

  constructor() {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);

    if (title !== undefined) {
      this.titleService.setTitle(`MAT2 : ${title}`);
      this.headerService.title = title;
    } else {
      this.titleService.setTitle('MAT2');
      this.headerService.title = '';
    }

  }
}
