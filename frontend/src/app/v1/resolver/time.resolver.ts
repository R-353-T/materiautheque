import { ResolveFn } from '@angular/router';

export const timeResolver: ResolveFn<number> = (route, state) => {
  return Date.now();
};
