import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonBadge,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/v1/component/organism/header/header.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonBadge,
    IonIcon,
    IonLabel,
    CommonModule,
    FormsModule,
    HeaderComponent
  ]
})
export class FormPage implements OnInit {

  ngOnInit(): void { }

  // public form$?: Observable<IFormModel>;
  // public type = TYPE;
  // public readonly navigationService = inject(NavigationService);
  // public readonly permissionService = inject(PermissionService);

  // private readonly route = inject(ActivatedRoute);

  // ngOnInit() {
  //   this.form$ = this.route.data.pipe(map((data) => data['form'] as IFormModel));
  // }

  // ionViewWillEnter() {
  //   this.form$?.pipe(take(1)).subscribe({
  //     next: (form) => {
  //       this.navigationService.backTo = this.navigationService.lastPage;
  //     }
  //   });
  // }

}
