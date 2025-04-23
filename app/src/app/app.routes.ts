import { Routes } from "@angular/router";
import {
  apiAuthenticatedGuard,
  apiUnauthenticatedGuard,
} from "./guards/api.authentication.guard";

export const routes: Routes = [
  // Authentication

  {
    path: "authentication/login",
    title: "Page de connexion",
    loadComponent: () =>
      import("./pages/login/login.page").then((m) => m.LoginPage),
    canActivate: [apiUnauthenticatedGuard],
  },

  // Home

  {
    path: "home",
    title: "Page d'accueil",
    loadComponent: () =>
      import("./pages/home/home.page").then((m) => m.HomePage),
    canActivate: [apiAuthenticatedGuard],
    data: {
      navigation: {
        label: "Accueil",
        icon: "home",
        display: true
      },
    },
  },

  // Image

  {
    path: "images",
    title: "Bibliothèque d'images",
    loadComponent: () =>
      import("./pages/image/images/images.page").then((m) => m.ImagesPage),
    data: {
      navigation: {
        label: "Images",
        icon: "aperture",
        display: true,
        allowedRoles: [
          "guest",
          "subscriber",
          "contributor",
          "author",
          "editor",
          "administrator",
        ],
      },
    },
  },

  {
    path: 'image/create',
    loadComponent: () => import('./pages/image/create-image/create-image.page').then( m => m.CreateImagePage)
  },

  {
    path: 'image/:imageId',
    title: 'Image',
    loadComponent: () => import('./pages/image/image/image.page').then( m => m.ImagePage),
    data: {
      navigation: {
        label: 'Image',
        icon: 'aperture',
        display: false,
        allowedRoles: [
          "guest",
          "subscriber",
          "contributor",
          "author",
          "editor",
          "administrator",
        ],
      }
    }
  },

  {
    path: "",
    redirectTo: "authentication/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "notFound",
  },
];
