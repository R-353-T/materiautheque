import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { map, take } from 'rxjs';
import { IResponse, IResponsePage } from 'src/app/v1/interface/api.interface';
import { IField } from 'src/app/v1/interface/field.interface';
import { FField } from '../../form/f.field';
import { TypeService } from './type.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateFieldService {
  private readonly ep = environment.api.field;
  private readonly api = inject(ApiService);

  list(groupId: number) {
    return this.api
      .get<IResponsePage<IField>>(this.ep.list, { groupId });
  }

  get(id: number) {
    return this.api
      .get<IResponse<IField>>(this.ep.get, { id })
      .pipe(map(response => response.data));
  }

  create(form: FField) {
    const body = {
      name: form.name.value,
      description: form.description.value ?? "",
      typeId: form.typeId.value,
      groupId: form.groupId.value,
      enumeratorId: form.enumeratorId.value ?? null,
      unitId: form.unitId.value ?? null,
      isRequired: form.isRequired.value ?? false,
      allowMultipleValues: form.allowMultipleValues.value ?? false
    };

    return this.api
      .post<IResponse<IField>>(this.ep.create, body)
      .pipe(map(response => response.data));
  }

  update(form: FField) {
    const body = {
      id: form.id.value,
      name: form.name.value,
      description: form.description.value ?? "",
      typeId: form.typeId.value,
      groupId: form.groupId.value,
      enumeratorId: form.enumeratorId.value ?? null,
      unitId: form.unitId.value ?? null,
      isRequired: form.isRequired.value ?? false,
      allowMultipleValues: form.allowMultipleValues.value ?? false
    };

    return this.api
      .patch<IResponse<IField>>(this.ep.update, body)
      .pipe(map(response => response.data));
  }

  delete(id: number) {
    return this.api
      .delete<IResponse<boolean>>(this.ep.delete, { id }).pipe(take(1));
  }
}
