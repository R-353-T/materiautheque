import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { HeaderService } from '../header/header.service';

@Injectable({ providedIn: 'root' })
export class TitleService extends TitleStrategy {
  private readonly titleService = inject(Title);
  private readonly headerService = inject(HeaderService);

  override updateTitle(snapshot: RouterStateSnapshot) {
    const title = this.buildTitle(snapshot);

    if(title) {
      this.titleService.setTitle(title);
      this.headerService.titleSignal.set(title);
    } else {
      this.titleService.setTitle('...');
      this.headerService.titleSignal.set('...');
    }
  }
}
