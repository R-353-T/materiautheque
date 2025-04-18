import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, close, home, logIn, logOut, menu } from "ionicons/icons";
import { MainNavigationComponent } from './components/main-navigation/main-navigation.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    MainNavigationComponent
  ],
})
export class AppComponent {
  constructor() {
    addIcons({
      checkmark,
      close,
      home,
      logIn,
      logOut,
      menu,
    });
  }
}
