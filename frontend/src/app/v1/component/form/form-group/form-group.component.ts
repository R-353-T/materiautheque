import { CommonModule } from '@angular/common';
import { Component, computed, effect, Input, OnInit, signal } from '@angular/core';
import { FForm } from 'src/app/v1/form/f.form';
import { FilterType, ListItemOptions } from 'src/app/v1/interface/app.interface';
import { ITemplate } from 'src/app/v1/interface/template.interface';
import { GroupSummaryComponent } from "../../group/group-summary/group-summary.component";
import { InputComponent } from '../../atom/input/input.component';
import { FormInputComponent } from "../form-input/form-input.component";

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GroupSummaryComponent,
    InputComponent,
    FormInputComponent
]
})
export class FormGroupComponent {
  @Input()
  baseForm?: FForm;

  @Input()
  template?: ITemplate;

  readonly summarySelection = signal<FilterType>(null);
  readonly activeGroup = computed(() => {
    const selected = this.summarySelection();
    if(selected && this.baseForm) {

      if(typeof selected === "number") {
        return this.baseForm.getGroupById(selected);
      }

      if(selected instanceof ListItemOptions && selected.id) {
        return this.baseForm.getGroupById(selected.id);
      }
    }

    return null;
  });
}
