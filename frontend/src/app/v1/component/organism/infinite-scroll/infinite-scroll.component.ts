import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
} from "@ionic/angular/standalone";
import { InfiniteScrollItem, InfiniteScrollOptions } from "./infinite-scroll-options";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-infinite-scroll",
  templateUrl: "./infinite-scroll.component.html",
  styleUrls: ["./infinite-scroll.component.scss"],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonButton,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    CommonModule,
    RouterModule,
  ],
})
export class InfiniteScrollComponent {
  @Input()
  options!: InfiniteScrollOptions;

  @Output()
  load = new EventEmitter<CustomEvent | undefined>();

  @Output()
  selectId = new EventEmitter<number | undefined>();

  private readonly routerService = inject(Router);

  loadMore(event?: any) {
    this.load.emit(event);
  }

  async click(item: InfiniteScrollItem) {
    if(item.route) {
      await this.routerService.navigate(item.route);
    } else {
      this.selectId.emit(item.id);
    }
  }
}
