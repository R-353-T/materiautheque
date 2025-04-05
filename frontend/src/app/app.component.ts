import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filter, addCircle, arrowBack, arrowDown, arrowForward, arrowUp, close, create, list, menu, removeCircle, share, swapVertical, chevronExpand, checkmark, radioButtonOff, radioButtonOn, square, chevronForward, checkbox, alert, alertCircle, checkmarkCircle, ellipseOutline, ellipse } from 'ionicons/icons';
import { MainMenuComponent } from "./v1/component/organism/main-menu/main-menu.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, MainMenuComponent],
})
export class AppComponent {
  constructor() {
    addIcons({
      addCircle,
      alertCircle,
      arrowBack,
      arrowUp,
      arrowDown,
      arrowForward,
      checkbox,
      checkmarkCircle,
      chevronForward,
      close,
      ellipse,
      menu,
      swapVertical,
      share,
      create,
      removeCircle,
      filter,
      chevronExpand,
      radioButtonOff,
      radioButtonOn,
      square
    });
  }
}
