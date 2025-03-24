import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ApiService } from "./api.service";
import { map } from "rxjs";
import { IResponse, IResponsePage } from "src/app/v1/interface/api.interface";
import { IImage } from "src/app/v1/interface/image.interface";
import { FImage } from "../../form/f.image";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  private readonly ep = environment.api.image;
  private readonly api = inject(ApiService);

  get(id: number) {
    return this.api
      .get<IResponse<IImage>>(this.ep.get, { id })
      .pipe(map((response) => response.data));
  }

  list(
    index: number,
    search: string | undefined | null,
    size: number = 32
  ) {
    const parameters = {
      index,
      size,
      search,
    };

    return this.api
      .get<IResponsePage<IImage>>(this.ep.list, parameters);
  }

  create(form: FImage) {
    const body = new FormData();

    body.append("name", form.name.value);
    if (form.fileValue) {
      body.append("file", form.fileValue);
    }

    return this.api
      .post<IResponse<IImage>>(this.ep.create, body)
      .pipe(map((response) => response.data));
  }

  update(form: FImage) {
    const body = new FormData();

    body.append("id", form.id.value.toString());
    body.append("name", form.name.value);

    if (form.fileValue) {
      body.append("file", form.fileValue);
    }

    return this.api
      .post<IResponse<IImage>>(this.ep.update, body)
      .pipe(map((response) => response.data));
  }

  delete(id: number) {
    return this.api
      .delete<IResponse<boolean>>(this.ep.delete, { id });
  }
}
