import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../../components/header/header.component";
import { ListComponent } from "../../../components/list/list.component";
import { ListItem, ListOptions } from 'src/app/classes/list-options';
import { ApiImageService } from 'src/app/services/api.image.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ButtonComponent } from "../../../components/button/button.component";

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonSearchbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
    ListComponent,
    ButtonComponent
]
})
export class ImagesPage {

  readonly listOptions = new ListOptions("images", true, "none");
  readonly navigationService = inject(NavigationService);
  private readonly _apiImageService = inject(ApiImageService);
  private readonly _pageIndex = 0;
  private _search?: string;

  ionViewWillEnter() {
    this.refreshList();
  }

  filterByName(event: any) {
      this._search = event.detail.value;

      if(this._search?.length === 0) {
        this._search = undefined;
      }

      this.refreshList();
  }

  refreshList(event?: any) {
    if(this.listOptions.loadingSignal()) {
      event.target.complete();
    } else {
      this.listOptions.reset();
      this.loadMore(event);
    }
  }

  loadMore(event?: any) {
    this.listOptions.loadingSignal.set(true);

    this._apiImageService
      .list(this._pageIndex, this._search)
      .subscribe({
        next: (response) => {
          for(const item of response.data) {
            this.listOptions.add(new ListItem(item.id, item.name));
          }

          if(response.pagination.index === response.pagination.total) {
            this.listOptions.complete();
          } else {
            this.listOptions.loadingSignal.set(false);
          }
        }
    });
  }

}
