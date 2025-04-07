import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FilterType, List, ListItemOptions } from 'src/app/v1/interface/app.interface';
import { IGroup } from 'src/app/v1/interface/group.interface';
import { ITemplate } from 'src/app/v1/interface/template.interface';
import { ListComponent } from '../../organism/list/list.component';
import { ListItemComponent } from '../../organism/list-item/list-item.component';
import { FForm } from 'src/app/v1/form/f.form';

@Component({
  selector: 'app-group-summary',
  templateUrl: './group-summary.component.html',
  styleUrls: ['./group-summary.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    CommonModule,
    ListComponent,
    ListItemComponent
  ]
})
export class GroupSummaryComponent implements OnInit, OnChanges {
  @Input()
  selection = signal<FilterType>(null);

  @Input()
  template!: ITemplate;

  @Input()
  baseForm!: FForm;

  @Output()
  change = new EventEmitter<FilterType>();

  readonly list = new List();
  readonly focus = signal<boolean>(false);

  preview = computed(() => {
    const selection = this.selection();

    if(selection instanceof Array) {
      return selection.length.toString();
    } else if(typeof selection === "number") {
      return selection.toString(); 
    } else {
      return selection?.label || 'missing value';
    }
  });

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template']) {
      this.refresh();
    }
  }

  onSelect(item: ListItemOptions) {
    for(const i of this.list.items()) {
      i.selected.set(false);
    }

    item.selected.set(true);
    this.selection.set(item);
    this.change.emit(item);
    this.focus.set(false);
  }

  private refresh() {
    this.list.items.set([]);
    this.mapTemplate(undefined);
  }

  private mapTemplate(group: IGroup|undefined, depth: number = 0) {
    let item = new ListItemOptions();

    if (group === undefined) {
      this.template.groupList?.forEach((group) => {
        this.mapTemplate(group, depth);
      });
      this.onSelect(this.list.items()[0]);
    } else {
      item.id = group.id;
      item.label = group.name;
      item.description = group.description;
      item.mode.set("validation");
      item.depth.set(depth);
      this.list.add(item);
      group.groupList.forEach((group) => {
        this.mapTemplate(group, depth + 1);
      });
    }
  }
}
