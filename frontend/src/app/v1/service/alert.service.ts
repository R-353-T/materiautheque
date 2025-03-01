import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private getCancelButton(text:string = "Annuler", onCancel?: () => void) {
    return {
      text,
      role: 'cancel',
      handler: () => (onCancel ? onCancel() : undefined)
    };
  }

  private getConfirmButton(text: string = "Confirmer", onConfirm?: () => void, destructive: boolean = false) {
    return {
      text,
      role: destructive ? 'destructive' : 'confirm',
      handler: () => (onConfirm ? onConfirm() : undefined)
    };
  }

  private readonly alertController = inject(AlertController);

  async confirmDelete(
    onConfirm: () => void,
    onCancel?: () => void,
    message: string = 'Êtes-vous sûr de vouloir supprimer cet élément ?',
  ) {
    const alert = await this.alertController.create({
      header: 'Confirmation de suppression',
      message: message,
      buttons: [
        this.getCancelButton('Annuler', onCancel),
        this.getConfirmButton('Supprimer', onConfirm, true),
      ],
    });

    await alert.present();
  }

  async confirmEdit(
    onConfirm: () => void,
    onCancel?: () => void,
    message: string = 'Êtes-vous sûr de vouloir modifier cet élément ?',
  ) {
    const alert = await this.alertController.create({
      header: 'Confirmation de modification',
      message: message,
      buttons: [
        this.getCancelButton('Annuler', onCancel),
        this.getConfirmButton('Modifier', onConfirm),
      ],
    });

    await alert.present();
  }

  async confirmCreate(
    onConfirm: () => void,
    onCancel?: () => void,
    message: string = 'Êtes-vous sûr de vouloir créer cet élément ?',
  ) {
    const alert = await this.alertController.create({
      header: 'Confirmation de création',
      message: message,
      buttons: [
        this.getCancelButton('Annuler', onCancel),
        this.getConfirmButton('Créer', onConfirm),
      ],
    });

    await alert.present();
  }

}
