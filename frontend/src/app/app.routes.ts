import { Routes } from "@angular/router";
import { unauthGuard } from "./v1/guard/unauth.guard";
import { authGuard } from "./v1/guard/auth.guard";
import { unitResolver } from "./v1/resolver/unit.resolver";
import { enumeratorResolver } from "./v1/resolver/enumerator.resolver";
import { templateGroupResolver } from "./v1/resolver/template-group.resolver";
import { templateResolver } from "./v1/resolver/template.resolver";
import { templateFieldResolver } from "./v1/resolver/template-field.resolver";
import { imageResolver } from "./v1/resolver/image.resolver";
import { formResolver } from "./v1/resolver/form.resolver";

export const routes: Routes = [
  // Commons

  {
    path: "404",
    loadComponent: () =>
      import("./v1/page/e404/e404.page").then((m) => m.E404Page),
    title: "404",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./v1/page/login/login.page").then((m) => m.LoginPage),
    title: "Page de connexion",
    canActivate: [unauthGuard],
  },
  {
    path: "home",
    loadComponent: () =>
      import("./v1/page/home/home.page").then((m) => m.HomePage),
    title: "Accueil",
    canActivate: [authGuard],
  },

  // Images

  {
    path: "image-list",
    title: "Images",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./v1/page/image/image-list/image-list.page").then((m) =>
        m.ImageListPage
      ),
  },
  {
    path: "image-create",
    title: "Nouvelle image",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./v1/page/image/image-create/image-create.page").then((m) =>
        m.ImageCreatePage
      ),
  },
  {
    path: "image-edit/:imageId",
    title: "Éditeur d'image",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./v1/page/image/image-edit/image-edit.page").then((m) =>
        m.ImageEditPage
      ),
    resolve: { image: imageResolver },
  },
  {
    path: "image/:imageId",
    title: "Image",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./v1/page/image/image/image.page").then((m) => m.ImagePage),
    resolve: { image: imageResolver },
  },

  // Units

  {
    path: "unit-list",
    loadComponent: () =>
      import("./v1/page/unit/unit-list/unit-list.page").then((m) =>
        m.UnitListPage
      ),
    title: "Unités",
    canActivate: [authGuard],
  },
  {
    path: "unit-create",
    loadComponent: () =>
      import("./v1/page/unit/unit-create/unit-create.page").then((m) =>
        m.UnitCreatePage
      ),
    title: "Nouvelle unité",
    canActivate: [authGuard],
  },
  {
    path: "unit/:unitId",
    loadComponent: () =>
      import("./v1/page/unit/unit/unit.page").then((m) => m.UnitPage),
    title: "Unité",
    canActivate: [authGuard],
    resolve: { unit: unitResolver },
  },
  {
    path: "unit-edit/:unitId",
    loadComponent: () =>
      import("./v1/page/unit/unit-edit/unit-edit.page").then((m) =>
        m.UnitEditPage
      ),
    title: "Éditeur d'unité",
    canActivate: [authGuard],
    resolve: { unit: unitResolver },
  },

  // Enumerators

  {
    path: "enumerator-list",
    loadComponent: () =>
      import("./v1/page/enumerator/enumerator-list/enumerator-list.page").then(
        (m) => m.EnumeratorListPage,
      ),
    title: "Énumérateurs",
    canActivate: [authGuard],
  },
  {
    path: "enumerator-create",
    loadComponent: () =>
      import("./v1/page/enumerator/enumerator-create/enumerator-create.page")
        .then((m) => m.EnumeratorCreatePage),
    title: "Nouveau énumérateur",
    canActivate: [authGuard],
  },
  {
    path: "enumerator/:enumeratorId",
    loadComponent: () =>
      import("./v1/page/enumerator/enumerator/enumerator.page").then((m) =>
        m.EnumeratorPage
      ),
    title: "Énumérateur",
    canActivate: [authGuard],
    resolve: { enumerator: enumeratorResolver },
  },
  {
    path: "enumerator-edit/:enumeratorId",
    loadComponent: () =>
      import("./v1/page/enumerator/enumerator-edit/enumerator-edit.page").then(
        (m) => m.EnumeratorEditPage,
      ),
    title: "Éditeur d'énumérateur",
    canActivate: [authGuard],
    resolve: { enumerator: enumeratorResolver },
  },

  // Template

  {
    path: "template-list",
    loadComponent: () =>
      import("./v1/page/template/template-list/template-list.page").then((m) =>
        m.TemplateListPage
      ),
    title: "Modèles",
    canActivate: [authGuard],
  },
  {
    path: "template-edit/:templateId",
    loadComponent: () =>
      import("./v1/page/template/template-edit/template-edit.page").then((m) =>
        m.TemplateEditPage
      ),
    title: "Éditeur de modèle",
    canActivate: [authGuard],
    resolve: { template: templateResolver },
  },

  // Template -> Group

  {
    path: "template/group-list/:templateId/:groupId",
    loadComponent: () =>
      import("./v1/page/template/group/group-list/group-list.page").then((m) =>
        m.GroupListPage
      ),
    title: "Groupes",
    canActivate: [authGuard],
    resolve: { template: templateResolver, group: templateGroupResolver },
  },
  {
    path: "template/group-create/:templateId/:groupId",
    loadComponent: () =>
      import("./v1/page/template/group/group-create/group-create.page").then(
        (m) => m.GroupCreatePage
      ),
    title: "Nouveau groupe",
    canActivate: [authGuard],
    resolve: { template: templateResolver, group: templateGroupResolver },
  },
  {
    path: "template/group-edit/:templateId/:groupId",
    loadComponent: () =>
      import("./v1/page/template/group/group-edit/group-edit.page").then((m) =>
        m.GroupEditPage
      ),
    title: "Editeur de groupe",
    canActivate: [authGuard],
    resolve: { template: templateResolver, group: templateGroupResolver },
  },

  // Template -> Field

  {
    path: 'template/field-create/:groupId',
    loadComponent: () => import('./v1/page/template/field/field-create/field-create.page').then( m => m.FieldCreatePage),
    title: 'Nouveau champ',
    canActivate: [authGuard],
    resolve: { group: templateGroupResolver }
  },
  {
    path: 'template/field/:groupId/:fieldId',
    loadComponent: () => import('./v1/page/template/field/field/field.page').then( m => m.FieldPage),
    title: 'Champ',
    canActivate: [authGuard],
    resolve: { group: templateGroupResolver, field: templateFieldResolver }
  },
  {
    path: 'template/field-edit/:groupId/:fieldId',
    loadComponent: () => import('./v1/page/template/field/field-edit/field-edit.page').then( m => m.FieldEditPage),
    title: 'Éditeur de champ',
    canActivate: [authGuard],
    resolve: { group: templateGroupResolver, field: templateFieldResolver }
  },

  // Form

  {
    path: 'form-list/:templateId',
    loadComponent: () => import('./v1/page/form/form-list/form-list.page').then( m => m.FormListPage),
    title: 'Formulaires',
    canActivate: [authGuard],
    resolve: { template: templateResolver }
  },
  {
    path: 'form-create/:templateId',
    loadComponent: () => import('./v1/page/form/form-create/form-create.page').then( m => m.FormCreatePage),
    title: 'Nouveau formulaire',
    canActivate: [authGuard],
    resolve: { template: templateResolver }
  },
  {
    path: 'form/:formId',
    loadComponent: () => import('./v1/page/form/form/form.page').then( m => m.FormPage),
    title: 'Formulaire',
    canActivate: [authGuard],
    resolve: { form: formResolver }
  },
  {
    path: 'form-edit/:templateId/:formId',
    loadComponent: () => import('./v1/page/form/form-edit/form-edit.page').then( m => m.FormEditPage),
    title: 'Éditeur de formulaire',
    canActivate: [authGuard],
    resolve: { template: templateResolver, form: formResolver }
  },

  // Redirections

  {
    path: 'r/form/material-list',
    redirectTo: 'form-list/2',
    pathMatch: 'full',
    title: 'Matériaux'
  },

  {
    path: 'r/form/test-list',
    redirectTo: 'form-list/1',
    pathMatch: 'full',
    title: 'Tests'
  },

  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },

  {
    path: "**",
    redirectTo: "404",
  },
];
