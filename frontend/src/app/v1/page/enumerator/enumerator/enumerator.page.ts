import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from 'src/app/v1/service/navigation/navigation.service';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { PermissionService } from 'src/app/v1/service/permission.service';
import { IEnumerator } from 'src/app/v1/interface/enumerator.interface';
import {
  IonContent,
  IonText,
  IonButton,
  IonBadge,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-enumerator',
  templateUrl: './enumerator.page.html',
  styleUrls: ['./enumerator.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonText,
    IonButton,
    IonBadge,
    CommonModule,
    FormsModule,
    HeaderComponent
]
})
export class EnumeratorPage {

  enumerator$?: Observable<IEnumerator>;
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.enumerator$ = this.route.data.pipe(map((data) => data['enumerator'] as IEnumerator));
    this.navigationService.backTo = this.navigationService.lastPage;
  }
}
