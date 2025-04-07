import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { List, SelectType } from "src/app/v1/interface/app.interface";
import { SelectComponent } from "../../atom/select/select.component";
import { UnitService } from "src/app/v1/service/api/unit.service";

@Component({
  selector: "app-unit-value-select",
  templateUrl: "./unit-value-select.component.html",
  styleUrls: ["./unit-value-select.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent,
  ],
})
export class UnitValueSelectComponent implements OnInit {
  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  control = new FormControl();

  @Output()
  change = new EventEmitter<SelectType>();

  readonly list = new List();

  private readonly unitService = inject(UnitService);

  ngOnInit(): void {
  }

  refresh(event?: any) {
  }

  onLoadMore() {

  }
}
