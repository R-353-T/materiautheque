import { Component } from "@angular/core";
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  addCircle,
  alertCircle,
  arrowBack,
  arrowDown,
  arrowForward,
  arrowUp,
  checkbox,
  checkmarkCircle,
  chevronExpand,
  chevronForward,
  close,
  create,
  ellipse,
  filter,
  menu,
  radioButtonOff,
  radioButtonOn,
  removeCircle,
  share,
  square,
  swapVertical,
} from "ionicons/icons";
import { NavigationComponent } from "./v2/components/globals/navigation/navigation.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [
    IonApp,
    IonRouterOutlet,
    NavigationComponent
],
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
      square,
    });
  }
}
