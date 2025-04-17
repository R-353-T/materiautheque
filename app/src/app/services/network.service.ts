import { Injectable, signal } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private readonly _status = signal<ConnectionStatus>({
    connected: true,
    connectionType: "none",
  });
  readonly status = this._status.asReadonly();

  constructor() {
    Network
      .getStatus()
      .then((status) => this._status.set(status));

    Network.addListener(
      "networkStatusChange",
      (status) => this._status.set(status)
    );
  }
}
