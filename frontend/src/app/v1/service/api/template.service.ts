import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { environment } from "src/environments/environment";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IResponse, IResponsePage } from "src/app/v1/interface/api.interface";
import { FTemplate } from "../../form/f.template";
import { IGroup } from "../../interface/group.interface";
import { ISelectValue } from "../../interface/app.interface";

@Injectable({
  providedIn: "root",
})
export class TemplateService {
  readonly templateList$: Observable<ITemplate[] | undefined>;
  readonly loaded = signal<boolean>(false);

  private readonly ep = environment.api.template;
  private readonly api = inject(ApiService);
  private readonly templateListSubject = new BehaviorSubject<
    ITemplate[] | undefined
  >(undefined);

  get templateList() {
    return this.templateListSubject.value;
  }

  constructor() {
    this.templateList$ = this.templateListSubject.asObservable();
    this.list().subscribe();
  }

  list() {
    return this.api
      .get<IResponsePage<ITemplate>>(this.ep.list)
      .pipe(
        tap((r) => this.templateListSubject.next(r.data)),
        tap(() => this.loaded.set(true)),
      );
  }

  get(id: number) {
    return this.api
      .get<IResponse<ITemplate>>(this.ep.get, { id })
      .pipe(map((response) => response.data));
  }

  update(form: FTemplate) {
    const body = {
      id: form.id.value,
      name: form.name.value,
      groupList: form.groupDtoList,
    };

    return this.api
      .patch<IResponse<ITemplate>>(this.ep.update, body)
      .pipe(map((response) => response.data));
  }

  mapTemplateAsSelectValueList(
    template: ITemplate,
    excludeIn: number | undefined = undefined, 
    group: IGroup | undefined = undefined,
    depth: number = 0,
    disabled: boolean = false
  ) {
    const output: ISelectValue[] = [];

    if (group === undefined) {
      output.push({
        depth: 0,
        dto: {
          id: null,
          value: template.name,
        },
        disabled,
      });

      template.groupList?.forEach((group) => {
        output.push(...this.mapTemplateAsSelectValueList(template, excludeIn, group, 1, disabled));
      });
    } else {
      if(excludeIn === group.id) {
        disabled = true;
      }

      output.push({
        depth: depth,
        dto: {
          id: group.id,
          value: group.name,
        },
        disabled,
      });


      group.groupList?.forEach((group) => {
        output.push(...this.mapTemplateAsSelectValueList(template, excludeIn, group, depth + 1, disabled));
      });
    }

    return output;
  }
}
