import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { take } from "rxjs";
import { IResponsePage } from "../models/api";
import { HttpParams } from "@angular/common/http";
import { IImage } from "../models/api.image";

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
      size: 32
    }

    if(search) {
      fromObject.search = search;
    }

    return this._api
      .get<IResponsePage<IImage>>(ApiImageService.endpoints.list, new HttpParams({ fromObject }))
      .pipe(take(1));
  }
}
