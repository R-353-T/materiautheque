import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { take } from "rxjs";
import { IResponse, IResponsePage } from "../models/api";
import { HttpParams } from "@angular/common/http";
import { IImage, imageFormData } from "../models/api.image";
import { CreateImageForm } from "../models/form.image";

@Injectable({ providedIn: "root" })
export class ApiImageService {
  public static readonly endpoints = {
    list: "mate/image/list",
    get: "mate/image/get",
    create: "mate/image/create",
    update: "mate/image/update",
    delete: "mate/image/delete",
  };

  private readonly _api = inject(ApiService);

  list(index: number, search: string | undefined | null) {
    const fromObject: any = {
      index,
      size: 32,
    };

    if (search) {
      fromObject.search = search;
    }

    return this._api
      .get<IResponsePage<IImage>>(
        ApiImageService.endpoints.list,
        new HttpParams({ fromObject }),
      )
      .pipe(take(1));
  }

  create(form: CreateImageForm) {
    const body = imageFormData(
      null,
      form.getInputByName("name").control.value,
      form.getInputByName("file").control.value,
    );

    return this._api
      .post<IResponse<IImage>>(ApiImageService.endpoints.create, body)
      .pipe(take(1));
  }
}
