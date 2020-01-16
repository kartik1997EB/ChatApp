import { Injectable } from '@angular/core';
import { FirebaseService } from 'src/app/dao/service/firebase.service';
import { User } from 'src/app/core/model/user';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  getCurrentUser():User{
   
    return this.firebaseService.getCurrentUser();
  }
  searchFriend(userName,userCallBack){
     this.firebaseService.searchFriend(userName,userCallBack);
  }
  signOut(){
    this.firebaseService.signOut();
  }
  constructor(private firebaseService:FirebaseService) { }
}
