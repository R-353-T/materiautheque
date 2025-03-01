import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonBadge } from '@ionic/angular/standalone';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/v1/service/navigation/navigation.service';
import { HeaderComponent } from "../../../component/organism/header/header.component";
import { IImage } from 'src/app/v1/interface/image.interface';
import { PermissionService } from 'src/app/v1/service/permission.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonBadge,
    CommonModule,
    FormsModule,
    HeaderComponent
  ]
})
export class ImagePage {

  image$?: Observable<IImage|undefined>;
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.image$ = this.route.data.pipe(map((data) => data['image'] as IImage|undefined));
    this.navigationService.backTo = this.navigationService.lastPage;
  }

}
