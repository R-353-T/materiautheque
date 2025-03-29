import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Observable, pairwise } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public backTo$: Observable<(() => Promise<boolean>)|undefined>;
  private readonly backToSubject = new BehaviorSubject<(() => Promise<boolean>)|undefined>(undefined);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  constructor() {
    this.backTo$ = this.backToSubject.asObservable();
  }

  public set backTo(navigationPromise: (() => Promise<boolean>)|undefined) {
    if(navigationPromise) {
      const callback = async () => {
        this.backToSubject.next(undefined);
        return navigationPromise();
      }
      this.backToSubject.next(callback);
    } else {
      this.backToSubject.next(undefined);
    }
  }

  // Last page

  lastPage = () => new Promise<boolean>((r) => {
    this.location.back();
    r(true);
  });

  // Commons

  goToHome = () => this.router.navigate(['/home'])
  goToLogin = () => this.router.navigate(['/login']);
  goTo404 = () => this.router.navigate(['/404']);

  // Images

  goToImageList = () => this.router.navigate(['/image-list']);
  goToImageCreate = () => this.router.navigate(['/image-create']);
  goToImage = (id: number) => this.router.navigate(['/image', id]);
  goToImageEdit = (id: number) => this.router.navigate(['/image-edit', id]);

  // Units
  
  goToUnitList = () => this.router.navigate(['/unit-list']);
  goToUnitCreate = () => this.router.navigate(['/unit-create']);
  goToUnit = (id: number) => this.router.navigate(['/unit', id]);
  goToUnitEdit = (id: number) => this.router.navigate(['/unit-edit', id]);

  // Enumerators

  goToEnumeratorList = () => this.router.navigate(['/enumerator-list']);
  goToEnumeratorCreate = () => this.router.navigate(['/enumerator-create']);
  goToEnumerator = (id: number) => this.router.navigate(['/enumerator', id]);
  goToEnumeratorEdit = (id: number) => this.router.navigate(['/enumerator-edit', id]);

  // Templates

  goToTemplateList = () => this.router.navigate(['/template-list']);
  goToTemplateEdit = (templateId: number) => this.router.navigate(['/template-edit', templateId]);
  
  goToTemplateGroupList = (templateId: number, id?: number) => this.router.navigate(['/template/group-list', templateId, id ?? '_']);
  goToTemplateGroupCreate = (templateId: number, id?: number) => this.router.navigate(['/template/group-create', templateId, id ?? '_']);
  goToTemplateGroupEdit = (templateId: number, id: number) => this.router.navigate(['/template/group-edit', templateId, id]);
  goToTemplateGroupSort = (templateId: number, id?: number) => this.router.navigate(['/template/group-sort', templateId, id ?? '_']);

  goToTemplateField = (groupId: number, id: number) => this.router.navigate(['/template/field', groupId, id]);
  goToTemplateFieldCreate = (groupId: number) => this.router.navigate(['/template/field-create', groupId]);
  goToTemplateFieldEdit = (groupId: number, id: number) => this.router.navigate(['/template/field-edit', groupId, id]);
  goToTemplateFieldSort = (groupId: number) => this.router.navigate(['/template/field-sort', groupId]);

  // Forms

  goToFormList = (templateId: number) => this.router.navigate(['/form-list', templateId]);
  goToFormCreate = (templateId: number) => this.router.navigate(['/form-create', templateId]);
  goToForm = (id: number) => this.router.navigate(['/form', id]);
  goToFormEdit = (templateId: number, id: number) => this.router.navigate(['/form-edit', templateId, id]); // X
  
}
