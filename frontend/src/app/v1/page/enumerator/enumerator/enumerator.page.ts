import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from 'src/app/v1/service/navigation/navigation.service';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { PermissionService } from 'src/app/v1/service/permission.service';
import { IEnumerator } from 'src/app/v1/interface/enumerator.interface';
import { InputComponent } from "../../../component/atom/input/input.component";
import { FORM__ENUMERATOR } from 'src/app/v1/form/f.enumerator';
import { IonContent } from '@ionic/angular/standalone';
import { FormatDatePipe } from 'src/app/v1/pipe/format-date.pipe';
import { TypeEnum } from 'src/app/v1/enum/Type';
import { TypeService } from 'src/app/v1/service/api/type.service';
import { EditTitleComponent } from 'src/app/v1/component/title/edit-title/edit-title.component';

@Component({
  selector: 'app-enumerator',
  templateUrl: './enumerator.page.html',
  styleUrls: ['./enumerator.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    InputComponent,
    FormatDatePipe,
    EditTitleComponent
]
})
export class EnumeratorPage {
  readonly baseForm = FORM__ENUMERATOR;
  readonly typeEnum = TypeEnum;

  enumerator$?: Observable<IEnumerator>;
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);
  readonly typeService = inject(TypeService);

  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.baseForm.reset();
    this.navigationService.backTo = this.navigationService.lastPage;
    this.enumerator$ = this.route.data.pipe(map((data) => {
      const enumerator = data['enumerator'] as IEnumerator;
      this.baseForm.reset(enumerator);
      return enumerator;
    }));
  }
}
