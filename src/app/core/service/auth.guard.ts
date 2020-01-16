import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService,private router:Router){}
  canActivate():boolean | Promise<boolean>{
    if(this.authService.isloggedIn()){
      console.log('have access');
      return true
    }
    else{
      console.log('acess denied');
      this.router.navigate(['/logIn'])
      return false;
    }
  }
  
}
