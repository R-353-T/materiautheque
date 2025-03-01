import { inject, Injectable } from '@angular/core';
import { UserRole } from '../enum/UserRole';
import { UserService } from 'src/app/v1/service/user/user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public readonly PERMISSION = environment.permission;

  private readonly userService = inject(UserService);

  public get userRole() {
    if(this.userService.user !== null) {
      return this.userService.user.user_role as UserRole
    } else {
      return false;
    }
  }

  public has(role: UserRole): boolean {
    if(this.userRole) {
      return this.userRole === role;
    }

    return false;
  }

  public hasOneOf(roles: UserRole[]): boolean {
    if(this.userRole) {
      return roles.includes(this.userRole);
    }
    
    return false;
  }

  public hasPermission(required: UserRole): boolean {
    if(this.userRole) {
      return this.getRoleLevel(this.userRole) >= this.getRoleLevel(required);
    }
    
    return false;
  }

  private getRoleLevel(role: UserRole): number {
    switch (role) {
      case UserRole.SUBSCRIBER:
        return 1;
      case UserRole.CONTRIBUTOR:
        return 2;
      case UserRole.AUTHOR:
        return 3;
      case UserRole.EDITOR:
        return 4;
      case UserRole.ADMIN:
        return 5;
      default:
        return 0;
    }
  }
}
