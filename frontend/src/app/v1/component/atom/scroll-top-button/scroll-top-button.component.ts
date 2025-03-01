import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  IonContent,
  IonFabButton,
  IonFab,
  IonIcon,
} from '@ionic/angular/standalone';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-scroll-top-button',
  templateUrl: './scroll-top-button.component.html',
  styleUrls: ['./scroll-top-button.component.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonIcon,
    CommonModule
  ]
})
export class ScrollTopButtonComponent  implements OnInit {

  @Input() content: IonContent|undefined;

  public scrollTop$?: Observable<number>;

  ngOnInit() {
    this.scrollTop$ = this.content?.ionScroll.pipe(map((e) => e.detail.scrollTop));
  }

  public async scrollToTop() {
    await this.content?.scrollToTop(300);
  }

}
