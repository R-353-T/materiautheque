import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { List, ListItemOptions, SelectType } from 'src/app/v1/interface/app.interface';
import { IGroup } from 'src/app/v1/interface/group.interface';
import { ITemplate } from 'src/app/v1/interface/template.interface';
import { SelectComponent } from '../../atom/select/select.component';

@Component({
  selector: 'app-group-select',
  templateUrl: './group-select.component.html',
  styleUrls: ['./group-select.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent
  ]
})
export class GroupSelectComponent  implements OnInit {
  @Input()
  label?: string;

  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  control = new FormControl<number|null>(null);

  @Input()
  template!: ITemplate;

  @Input()
  ignoreCircularOf?: number;

  @Output()
  change = new EventEmitter<SelectType>();

  readonly list = new List();

  ngOnInit(): void {
    this.mapTemplate(undefined);
  }

  private mapTemplate(group: IGroup|undefined, depth: number = 0, disabled: boolean = false) {
    let item = new ListItemOptions();

    if (group === undefined) {
      if(this.required === false) {
        item.id = null;
        item.label = this.template.name;
        item.mode.set(this.multiple ? "checkbox" : "radio");
        item.depth.set(depth);
        this.list.add(item);
      }

      this.template.groupList?.forEach((group) => {
        this.mapTemplate(group, depth + 1);
      });
    } else {      

      if(group.id === this.ignoreCircularOf) {
        disabled = true;
      }

      item.id = group.id;
      item.label = group.name;
      item.description = group.description;
      item.mode.set(this.multiple ? "checkbox" : "radio");
      item.depth.set(depth);
      item.disabled.set(disabled);
      this.list.add(item);
      group.groupList.forEach((group) => {
        this.mapTemplate(group, depth + 1, disabled);
      });
    }
  }
}
