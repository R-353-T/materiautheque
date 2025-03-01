import { ResolveFn } from '@angular/router';
import { TemplateGroupService } from '../service/api/template-group.service';
import { inject } from '@angular/core';
import { HeaderService } from '../service/header/header.service';
import { catchError, tap, throwError } from 'rxjs';
import { IGroup } from '../interface/group.interface';

export const templateGroupResolver: ResolveFn<IGroup | undefined> = (route, state) => {
  const id = parseInt(route.paramMap.get('groupId') ?? '0', 10);
  const headerService = inject(HeaderService);
  const templateGroupService = inject(TemplateGroupService);

  if (!isNaN(id) && id > 0) {
    headerService.load("template-group");
    return templateGroupService.get(id).pipe(
      tap(() => headerService.loaded("template-group")),
      catchError((error) => {
        headerService.loaded("template-group")
        return throwError(() => error);
      })
    );
  }

  return undefined;
};
