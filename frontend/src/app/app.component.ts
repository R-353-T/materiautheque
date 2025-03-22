import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filter, addCircle, arrowBack, arrowDown, arrowForward, arrowUp, close, create, list, menu, removeCircle, share, swapVertical, chevronExpand, checkmark, radioButtonOff, radioButtonOn } from 'ionicons/icons';
import { MainMenuComponent } from "./v1/component/organism/main-menu/main-menu.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, MainMenuComponent],
})
export class AppComponent {
  constructor() {
    addIcons({
      arrowBack,
      arrowUp,
      arrowDown,
      arrowForward,
      checkmark,
      close,
      menu,
      swapVertical,
      share,
      create,
      addCircle,
      removeCircle,
      filter,
      chevronExpand,
      radioButtonOff,
      radioButtonOn
    });
  }
}
