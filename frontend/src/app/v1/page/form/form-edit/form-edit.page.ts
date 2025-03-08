import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FormService } from 'src/app/services/form/form.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/v1/service/navigation/navigation.service';
import { FormService } from 'src/app/v1/service/api/form.service';
import { take } from 'rxjs';
import {
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { DateService } from 'src/app/v1/service/date/date.service';
import { ITemplate } from 'src/app/v1/interface/template.interface';
import { HeaderComponent } from 'src/app/v1/component/organism/header/header.component';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.page.html',
  styleUrls: ['./form-edit.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class FormEditPage implements OnInit {

  ngOnInit() {}
  
  public errorMessage = "";
  // public form?: FormForm;
  public template?: ITemplate;
  public readonly formService = inject(FormService);
  
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly apiFormService = inject(FormService);
  private readonly dateService = inject(DateService);

  // get nameControl() {
  //   return this.form?.fg.get('name') as FormControl;
  // }


  // ionViewWillEnter() {
  //   this.route.data.pipe(take(1)).subscribe({
  //       next: (data) => {
  //         this.template = data['template'] as ITemplate;
  //         const formModel = data['form'] as IFormModel;

  //         this.navigationService.backTo = this.navigationService.lastPage;
  //         this.form = new FormForm(this.template, this.dateService, formModel);
  //       }
  //   });
  // }

  // update() {
  //   this.errorMessage = "";
  //   this.form?.fg.markAllAsTouched();

  //   if (this.form?.fg.invalid) {
  //     return;
  //   }

  //   this.form?.fg.disable();
  //   const { name } = this.form?.fg.value

  //   this.apiFormService.update(this.form?.model?.id!, name!, this.form?.valueDtoList ?? []).subscribe({
  //     next: async (response) => {
  //       this.form?.fg.enable();
  //       this.navigationService.goToForm(response.id);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //       this.form?.fg.enable();

  //       if(error.status === 400) {
  //         this.form?.applyBadRequestError(error.error.data.params);
  //       }

  //       this.errorMessage = error.error.message;
  //     }
  //   });
  // }

  // delete() {
  //   this.form?.fg.disable();

  //   this.apiFormService.delete(this.form?.model?.id!).subscribe({
  //     next: async () => {
  //       this.navigationService.backTo = undefined;
  //       await this.navigationService.goToFormList(this.template!.id);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //       this.errorMessage = error.message;
  //     }
  //   });
  // }

}
