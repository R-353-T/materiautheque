import { ResolveFn } from '@angular/router';
import { HeaderService } from '../service/header/header.service';
import { inject } from '@angular/core';
import { ImageService } from '../service/api/image.service';
import { catchError, tap, throwError } from 'rxjs';
import { IImage } from '../interface/image.interface';

export const imageResolver: ResolveFn<IImage | undefined> = (route, state) => {
  const id = parseInt(route.paramMap.get('imageId') ?? '0', 10);
  const headerService = inject(HeaderService);
  const imageService = inject(ImageService);

  if (!isNaN(id) && id > 0) {
    headerService.load("image");

    return imageService.get(id).pipe(
      tap(() => headerService.loaded("image")),
      catchError((error) => {
        headerService.loaded("image");
        return throwError(() => error);
      })
    );
  }

  return undefined;
};
