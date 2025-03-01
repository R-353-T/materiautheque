import { ResolveFn } from '@angular/router';
import { HeaderService } from '../service/header/header.service';
import { inject } from '@angular/core';
import { TemplateService } from '../service/api/template.service';
import { catchError, tap, throwError } from 'rxjs';
import { ITemplate } from '../interface/template.interface';

export const templateResolver: ResolveFn<ITemplate|undefined> = (route, state) => {
  const id = parseInt(route.paramMap.get('templateId') ?? '0', 10);
  const headerService = inject(HeaderService);
  const templateService = inject(TemplateService);

  if(!isNaN(id) && id > 0) {
    headerService.load("template");

    return templateService.get(id).pipe(
      tap(() => headerService.loaded("template")),
      catchError((error) => {
        headerService.loaded("template")
        return throwError(() => error);
      })
    );
  }

  return undefined;
};
