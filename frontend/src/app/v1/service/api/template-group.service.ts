import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { environment } from "src/environments/environment";
import { map, take } from "rxjs";
import { IGroup } from "src/app/v1/interface/group.interface";
import { IResponse, IResponsePage } from "src/app/v1/interface/api.interface";
import { FGroup } from "../../form/f.group";

@Injectable({
  providedIn: "root",
})
export class TemplateGroupService {
  private readonly ep = environment.api.group;
  private readonly api = inject(ApiService);

  list(
    pageIndex: number,
    pageSize: number,
    templateId: number,
    search?: string,
    parentId?: number,
  ) {
    return this.api
      .get<IResponsePage<IGroup>>(this.ep.list, {
        pageIndex,
        pageSize,
        templateId,
        search,
        parentId,
      });
  }

  get(id: number) {
    return this.api
      .get<IResponse<IGroup>>(this.ep.get, { id })
      .pipe(map((response) => response.data));
  }

  create(form: FGroup) {
    const body = {
      name: form.name.value,
      description: form.description.value ?? "",
      templateId: form.templateId.value,
      parentId: form.parentId.value,
    };

    return this.api
      .post<IResponse<IGroup>>(this.ep.create, body)
      .pipe(map((response) => response.data));
  }

  update(form: FGroup) {
    const body = {
      id: form.id.value,
      name: form.name.value,
      description: form.description.value ?? "",
      templateId: form.templateId.value,
      parentId: form.parentId.value ?? null,
      groupList: form.groupDtoList,
      fieldList: form.fieldDtoList,
    };

    return this.api
      .patch<IResponse<IGroup>>(this.ep.update, body)
      .pipe(map((response) => response.data));
  }

  delete(id: number) {
    return this.api
      .delete<IResponse<boolean>>(this.ep.delete, { id })
      .pipe(take(1));
  }
}
