import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FilterComponent } from '../../atom/filter/filter.component';
import { FilterType, List, ListItemOptions } from 'src/app/v1/interface/app.interface';
import { ITemplate } from 'src/app/v1/interface/template.interface';
import { IGroup } from 'src/app/v1/interface/group.interface';

@Component({
  selector: 'app-group-filter',
  templateUrl: './group-filter.component.html',
  styleUrls: ['./group-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent
  ]
})
export class GroupFilterComponent  implements OnInit, OnChanges {
  @Input()
  label?: string = "Type";

  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  selection = signal<FilterType>(null);

  @Input()
  template!: ITemplate;

  @Output()
  change = new EventEmitter<FilterType>();

  readonly list = new List();

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template']) {
      this.refresh();
    }
  }

  private refresh() {
    this.list.items.set([]);
    this.mapTemplate(undefined);
  }

  private mapTemplate(group: IGroup|undefined, depth: number = 0) {
    let item = new ListItemOptions();

    if (group === undefined) {
      item.id = null;
      item.label = this.template.name;
      item.mode.set("radio");
      item.redirection = ["/template/group-list/", this.template.id, "_"];
      item.depth.set(depth);
      this.list.add(item);
      this.template.groupList?.forEach((group) => {
        this.mapTemplate(group, depth + 1);
      });
    } else {
      item.id = group.id;
      item.label = group.name;
      item.description = group.description;
      item.mode.set("radio");
      item.redirection = ["/template/group-list/", this.template.id, group.id];
      item.depth.set(depth);
      this.list.add(item);
      group.groupList.forEach((group) => {
        this.mapTemplate(group, depth + 1);
      });
    }
  }
}
