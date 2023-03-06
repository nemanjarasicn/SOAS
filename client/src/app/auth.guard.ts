import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {ConstantsService} from "./_services/constants.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private CONSTANTS: ConstantsService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem(this.CONSTANTS.LS_ACCESS_TOKEN)) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

}
