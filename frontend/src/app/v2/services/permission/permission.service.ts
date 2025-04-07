import { inject, Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { UserRole } from "../../core/models/api/IUser";
import { UserRoles } from "../../core/enums/UserRoles";

@Injectable({ providedIn: "root" })
export class PermissionService {
  private readonly authService = inject(AuthService);

  isAllow(role: UserRole): boolean {
    const user = this.authService.userSignal();
    if(user) {
      return UserRoles[user.role] >= UserRoles[role];
    } else {
      return false;
    }
  }
}
