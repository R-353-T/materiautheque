import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItem, ListOptions } from 'src/app/classes/list-options';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    ButtonComponent
  ]
})
export class ListComponent {
  @Input({ required: true })
  options!: ListOptions;

  @Output()
  loadMore = new EventEmitter<any>();

  @Output()
  select = new EventEmitter<ListItem>();

  onLoadMore(event: any = undefined) {
    if (this.options.loadingSignal() === false && this.options.completeSignal() === false) {
      this.options.loadingSignal.set(true);
      this.loadMore.emit(event);
    } else {
      if(this.options.completeSignal()) {
        event?.target.complete();
      }
    }
  }

  onSelect(item: ListItem) {
    if (item.disabled() === false) {
      this.select.emit(item);

      this.options.items.update((items) => {
        items.forEach((i) => {
          i.selected.set(i.id === item.id);
        });

        return items;
      })
    }
  }
}
