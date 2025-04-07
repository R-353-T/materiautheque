import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, TitleStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/v1/interceptor/auth-interceptor';
import { BucketInterceptor } from './app/v1/interceptor/bucket-interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { TitleService } from './app/v2/services/title/title.service';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: TitleStrategy, useClass: TitleService },
    provideMarkdown(),
    provideIonicAngular({
      mode: "ios",
      spinner: "dots",
      infiniteLoadingSpinner: "dots",
      refreshingSpinner: "dots",
      loadingSpinner: "dots",
      menuIcon: "menu",
    }),
    provideHttpClient(withInterceptors([
      AuthInterceptor,
      BucketInterceptor
    ])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ]
});
