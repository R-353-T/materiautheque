import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { ListItemOptions } from 'src/app/v1/interface/app.interface';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule
  ]
})
export class ListItemComponent {
  @Input()
  options: ListItemOptions = new ListItemOptions();

  @Output()
  onClick = new EventEmitter<ListItemOptions>();

  private readonly router = inject(Router);

  icon = computed(() => {
    switch (this.options.mode()) {
      case "radio":
        return this.options.selected() ? "radio-button-on" : "radio-button-off";
      case "checkbox":
        return this.options.selected() ? "checkbox" : "square";
      case "redirection":
        return "chevron-forward";
      default:
        return null;
    }
  });
  
  async _onClick() {
    if(this.options.disabled()) return;

    if (this.options.mode() === "radio") {
      this.options.selected.set(true);
    }

    if (this.options.mode() === "checkbox") {
      this.options.selected.set(!this.options.selected());
    }

    this.onClick.emit(this.options);

    if (this.options.mode() === "redirection") {
      await this.router.navigate(this.options.redirection);
    }
  }
}
