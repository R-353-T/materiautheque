import { inject, Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppService } from '../app/app.service';
import { ModalController } from '@ionic/angular/standalone'
import { NetworkModalComponent } from 'src/app/v1/component/organism/network-modal/network-modal.component';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public readonly status$: Observable<ConnectionStatus|undefined>;

  private modal?: HTMLIonModalElement|undefined;

  private readonly statusSubject = new BehaviorSubject<ConnectionStatus|undefined>(undefined);
  private readonly appService = inject(AppService);
  private readonly modalController = inject(ModalController);
  

  public get isConnected() {
    return this.statusSubject.value?.connected;
  }

  public get connectionType() {
    return this.statusSubject.value?.connectionType;
  }

  constructor() {
    this.status$ = this.statusSubject.asObservable();
    this.networkStatusChange();
  }

  private async networkStatusChange() {
    const status = await Network.getStatus();
    this.statusSubject.next(status);
    this.debug();
    this.toggleModal();

    Network.addListener('networkStatusChange', (newStatus) => {
      this.statusSubject.next(newStatus);
      this.debug();
      this.toggleModal();
    });
  }

  private debug() {
    if(this.appService.DEVELOPMENT) {
      console.log(
        '[ DEBUG | NETWORK ]',
        `[ Status: ${this.isConnected ? 'Online' : 'Offline'} ]`,
        `[ Connection Type: ${this.connectionType} ]`
      );
    } 
  }

  private async toggleModal() {
    if(this.isConnected === false && this.modal === undefined) {
      this.modal = await this.modalController.create({
        component: NetworkModalComponent,
        backdropDismiss: false
      });
      await this.modal.present();
    }

    if(this.isConnected && this.modal) {
      await this.modal.dismiss();
      this.modal = undefined;
    }
  }

}
