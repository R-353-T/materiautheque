import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/v1/service/navigation/navigation.service';
import { FormService } from 'src/app/v1/service/api/form.service';
import { ITemplate } from 'src/app/v1/interface/template.interface';
import { FORM_CREATE_FORM } from 'src/app/v1/form/form.form';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/v1/component/organism/header/header.component';
import { take } from 'rxjs';
import { FormGroupSummaryComponent } from "../../../component/form/form-group-summary/form-group-summary.component";

@Component({
  selector: 'app-form-create',
  templateUrl: './form-create.page.html',
  styleUrls: ['./form-create.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FormGroupSummaryComponent
]
})
export class FormCreatePage {
  form = FORM_CREATE_FORM;
  readonly template = signal<ITemplate | undefined>(undefined);
  
  readonly activeGroupId = signal<number>(0);
  private readonly navigationService = inject(NavigationService);
  private readonly formService = inject(FormService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.template.set(undefined);

    this.route.data.pipe(take(1)).subscribe({
        next: (data) => {
          this.template.set(data['template'] as ITemplate);
          this.form.setup(data['template'] as ITemplate);
          this.navigationService.backTo = this.navigationService.lastPage;
        }
    });
  }

  create() {
  }
}
