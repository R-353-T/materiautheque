import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public readonly DEVELOPMENT = environment.production === false;
  public readonly PRODUCTION = environment.production === true;

}
