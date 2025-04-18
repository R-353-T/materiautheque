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
    canActivate: [apiUnauthenticatedGuard]
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
        display: true,
        // allowedRoles: [
        //   "guest",
        //   "subscriber",
        //   "contributor",
        //   "author",
        //   "editor",
        //   "administrator",
        // ],
      }
    },
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
