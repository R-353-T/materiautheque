import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { IResponse, IResponsePage } from 'src/app/v1/interface/api.interface';
import { map } from 'rxjs';
import { IForm } from 'src/app/v1/interface/form.interface';
import { FormForm } from 'src/app/v1/form/form.form';
import { Form } from '../../form/form';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private readonly ep = environment.api.form;
  private readonly api = inject(ApiService);

  list(
    templateId: number,
    index: number,
    size: number,
    search?: string|undefined|null
  ) {
    const parameters = {
      index,
      size,
      search,
      templateId
    };

    return this.api
      .get<IResponsePage<IForm>>(this.ep.list, parameters);
  }

  get(id: number) {
    return this.api
      .get<IResponse<IForm>>(this.ep.get, { id })
      .pipe(map(response => response.data));
  }

  create(form: Form) {
    const body = {
      name: form.getTemplateSection().name.value,
      templateId: form.getTemplateSection().templateId.value,
      valueList: form.valueList
    };

    console.log(body);

    return this.api
      .post<IResponse<IForm>>(this.ep.create, body)
      .pipe(map(response => response.data));
  }

  update(form: FormForm) {
    const body = {
      id: form.id.value,
      name: form.name.value,
      templateId: form.templateId.value,
      valueList: [] // todo fix
    };

    return this.api
      .post<IResponse<IForm>>(this.ep.update, body)
      .pipe(map(response => response.data));
  }

  delete(id: number) {
    return this.api
      .delete<IResponse<boolean>>(this.ep.delete, { id })
      .pipe(map(response => response.data));
  }

}
