import { Injectable, signal, Signal } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  readonly statusSignal: Signal<ConnectionStatus>;
  private readonly _status = signal<ConnectionStatus>({ connected: false, connectionType: 'none' });

  constructor() {
    this.statusSignal = this._status;
    this.autoUpdateNetworkStatus();
  }

  private async autoUpdateNetworkStatus() {
    const status = await Network.getStatus();
    this._status.set(status);

    Network.addListener('networkStatusChange', (newStatus) => {
      this._status.set(newStatus);
    });
  }
}
