import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/angular/standalone";
import { ListOptions } from "src/app/v1/interface/app.interface";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  standalone: true,
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    IonIcon,
    CommonModule,
  ],
})
export class ListComponent {
  @Input()
  options: ListOptions = new ListOptions();

  @Output()
  load = new EventEmitter<any>(); // InfiniteScrollCustomEvent

  onLoad(event: any = undefined) {
    if (this.options.loading() === false && this.options.complete() === false) {
      this.options.loading.set(true);
      this.load.emit(event);
    } else {
      if(this.options.complete()) {
        event?.target.complete();
      }
    }
  }
}
