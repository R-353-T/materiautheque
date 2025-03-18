import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ApiService } from "./api.service";
import { IResponse, IResponsePage } from "src/app/v1/interface/api.interface";
import { map } from "rxjs";
import { IUnit } from "src/app/v1/interface/unit.interface";
import { FUnit } from "../../form/f.unit";

@Injectable({
  providedIn: "root",
})
export class UnitService {
  private readonly ep = environment.api.unit;
  private readonly api = inject(ApiService);

  get(id: number) {
    return this.api
      .get<IResponse<IUnit>>(this.ep.get, { id })
      .pipe(map((response) => response.data));
  }

  list(
    index: number,
    size: number,
    search?: string | undefined | null,
  ) {
    const parameters = {
      index,
      size,
      search,
    };

    return this.api
      .get<IResponsePage<IUnit>>(this.ep.list, parameters);
  }

  create(form: FUnit) {
    const body = {
      name: form.name.value,
      description: form.description.value ?? "",
      valueList: form.valueDtoList,
    };

    return this.api
      .post<IResponse<IUnit>>(this.ep.create, body)
      .pipe(map((response) => response.data));
  }

  update(form: FUnit) {
    const body = {
      id: form.id.value,
      name: form.name.value,
      description: form.description.value ?? "",
      valueList: form.valueDtoList,
    };

    return this.api
      .post<IResponse<IUnit>>(this.ep.update, body)
      .pipe(map((response) => response.data));
  }

  delete(id: number) {
    return this.api
      .delete<IResponse<boolean>>(this.ep.delete, { id });
  }
}
