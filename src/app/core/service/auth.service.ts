import { Injectable } from '@angular/core';
import { FirebaseService } from '../../dao/service/firebase.service'
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  createUser(user:User,img:File,callBackResult: Function){
    this.firebaseService.createUser(user,img,callBackResult);

  }
  doAuthenticate(user:User){
    this.firebaseService.doAuthenticate(user);
  }
  isloggedIn():boolean | Promise<boolean>{
    return this.firebaseService.isLoggedIn();
  }
  constructor(private firebaseService:FirebaseService) { }
}
