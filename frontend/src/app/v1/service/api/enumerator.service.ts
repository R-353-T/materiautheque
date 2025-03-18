import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ApiService } from "./api.service";
import { IResponse, IResponsePage } from "src/app/v1/interface/api.interface";
import { map } from "rxjs";
import { DateService } from "../date/date.service";
import { IEnumerator } from "src/app/v1/interface/enumerator.interface";
import { EnumeratorForm } from "src/app/v1/form/enumerator.form";
import { TypeEnum } from "src/app/v1/enum/Type";
import { FEnumerator } from "../../form/f.enumerator";

@Injectable({
  providedIn: "root",
})
export class EnumeratorService {
  private readonly ep = environment.api.enumerator;
  private readonly api = inject(ApiService);
  private readonly dateService = inject(DateService);

  list(
    index: number,
    size: number,
    search?: string | undefined | null,
    typeId?: number | undefined | null,
  ) {
    const parameters = {
      index,
      size,
      search,
      typeId,
    };

    return this.api
      .get<IResponsePage<IEnumerator>>(this.ep.list, parameters);
  }

  get(id: number) {
    return this.api
      .get<IResponse<IEnumerator>>(this.ep.get, { id })
      .pipe(
        map((response) => {
          this.convertValueListDtoToDate(response.data);
          return response.data;
        }),
      );
  }

  create(form: FEnumerator) {
    const body = {
      name: form.name.value,
      description: form.description.value ?? "",
      typeId: form.typeId.value,
      valueList: form.valueDtoList,
    };

    this.convertValueListDateToDto(body);

    return this.api
      .post<IResponse<IEnumerator>>(this.ep.create, body)
      .pipe(
        map((response) => {
          this.convertValueListDtoToDate(response.data);
          return response.data;
        }),
      );
  }

  update(form: EnumeratorForm) {
    const body = {
      id: form.id.value,
      name: form.name.value,
      description: form.description.value ?? "",
      typeId: form.typeId.value,
      valueList: form.valueDtoList,
    };

    this.convertValueListDateToDto(body);

    return this.api
      .post<IResponse<IEnumerator>>(this.ep.update, body)
      .pipe(
        map((response) => {
          this.convertValueListDtoToDate(response.data);
          return response.data;
        }),
      );
  }

  delete(id: number) {
    return this.api
      .delete<IResponse<boolean>>(this.ep.delete, { id });
  }

  private convertValueListDateToDto(body: any) {
    if (body.typeId === TypeEnum.DATE) {
      for (const value of body.valueList) {
        value.value = this.dateService.isoToCustomFormat(value.value);
      }
    }
  }

  private convertValueListDtoToDate(data: any) {
    if (data.typeId === TypeEnum.DATE) {
      for (const value of data.valueList) {
        value.value = this.dateService.customFormatToIso(value.value);
      }
    }
  }
}
