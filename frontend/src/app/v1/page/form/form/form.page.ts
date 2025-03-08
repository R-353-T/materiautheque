import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonBadge
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/v1/component/organism/header/header.component';
import { IForm } from 'src/app/v1/interface/form.interface';
import { map, Observable, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/v1/service/navigation/navigation.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    // IonButton,
    IonBadge,
    HeaderComponent
  ]
})
export class FormPage {

  form$?: Observable<IForm>;

  readonly navigationService = inject(NavigationService);

  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.form$ = this.route.data.pipe(map((data) => data['form'] as IForm));
    this.navigationService.backTo = this.navigationService.lastPage;
  }

}
