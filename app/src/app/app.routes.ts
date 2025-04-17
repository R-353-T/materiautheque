import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "authentication/login",
    loadComponent: () =>
      import("./pages/login/login.page").then((m) => m.LoginPage),
  },
  {
    path: "home",
    loadComponent: () =>
      import("./pages/home/home.page").then((m) => m.HomePage),
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
