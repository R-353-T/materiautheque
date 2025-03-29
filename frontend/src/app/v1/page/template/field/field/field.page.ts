import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { map, Observable, take, tap } from "rxjs";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { IField } from "src/app/v1/interface/field.interface";
import { IonContent, IonToggle } from "@ionic/angular/standalone";
import { EditTitleComponent } from "../../../../component/title/edit-title/edit-title.component";
import { FORM__FIELD } from "src/app/v1/form/f.field";
import { InputComponent } from "../../../../component/atom/input/input.component";
import { GroupSelectComponent } from "../../../../component/group/group-select/group-select.component";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { EnumeratorSelectComponent } from "../../../../component/enumerator/enumerator-select/enumerator-select.component";
import { TypeSelectComponent } from "../../../../component/type/type-select/type-select.component";
import { UnitSelectComponent } from "../../../../component/unit/unit-select/unit-select.component";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { TemplateGroupService } from "src/app/v1/service/api/template-group.service";

@Component({
  selector: "app-field",
  templateUrl: "./field.page.html",
  styleUrls: ["./field.page.scss"],
  standalone: true,
  imports: [
    IonToggle,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    EditTitleComponent,
    InputComponent,
    GroupSelectComponent,
    EnumeratorSelectComponent,
    TypeSelectComponent,
    UnitSelectComponent,
  ]
})
export class FieldPage {
  field$?: Observable<IField>;

  template = signal<ITemplate|undefined>(undefined);

  readonly baseForm = FORM__FIELD;
  readonly navigationService = inject(NavigationService);

  private readonly groupService = inject(TemplateGroupService);
  private readonly templateService = inject(TemplateService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.field$ = this.route.data.pipe(map((data) => data["field"] as IField));

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          const field = data["field"] as IField;
          this.baseForm.reset(field);
          this.baseForm.groupId.disable();
          this.baseForm.typeId.disable();
          this.baseForm.name.disable();
          this.baseForm.description.disable();
          this.baseForm.isRequired.disable();
          this.baseForm.allowMultipleValues.disable();
          this.baseForm.enumeratorId.disable();
          this.baseForm.unitId.disable();

          this.groupService
            .get(field.groupId)
            .subscribe({
              next: (group) => {
                this.templateService
                  .get(group.templateId)
                  .subscribe({
                    next: (template) => this.template.set(template),
                  });
              },
            })
        },
      });
  }
}
