import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {}

  async presentToast(message: string, color: "success"|"danger"|"warning"|"light" = "success", icon: undefined|string = undefined, duration: number = 2500) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: "bottom",
      color,
      icon
    });
    toast.present();
  }

  showSuccessCreate(name: string) {
    this.presentToast(`${name} à été créé avec succès`, "light", "add-circle");
  }

  showSuccessUpdate(name: string) {
    this.presentToast(`${name} à été modifié avec succès`, "light", "create");
  }

  showSuccessDelete(name: string) {
    this.presentToast(`${name} à été supprimé avec succès`, "light", "remove-circle");
  }
}
