import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, TitleStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApiAuthenticationInterceptor } from './app/interceptors/api.authentication.interceptor';
import { ApiBucketInterceptor } from './app/interceptors/api.bucket.interceptor';
import { HeaderService } from './app/services/header.service';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: TitleStrategy, useClass: HeaderService },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([
      ApiAuthenticationInterceptor,
      ApiBucketInterceptor
    ])),
    provideIonicAngular({
      mode: "ios",
      spinner: "circles",
      infiniteLoadingSpinner: "circles",
      refreshingSpinner: "circles",
      menuIcon: "menu"
    })
  ],
});
