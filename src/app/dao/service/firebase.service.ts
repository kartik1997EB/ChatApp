import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Route, Router } from '@angular/router';
import { User } from '../../core/model/user';
import { Observable, of } from 'rxjs';
import { switchMap, finalize} from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

   uid :string;

  createUser(user:User,img:File,callBackResult: Function){
    //user creation for default email and password
    this.authService.auth.createUserWithEmailAndPassword(user.email, user.password) .then(value => {
      console.log('Sucess', value.user.uid);
      localStorage.setItem('currentUser',value.user.uid);
      //image upload to cload storage with refering user unique id
          const fileRef =this.angularStorage.ref(value.user.uid);
        this.angularStorage.upload( value.user.uid,img).snapshotChanges().pipe(
          finalize(()=>{
            fileRef.getDownloadURL().subscribe((url)=>{
              user.photoURL=url
              //after completion of image upload all user data save in custum table
              user.uid=value.user.uid;
              this.db.collection('users').doc(value.user.uid).set(Object.assign({}, user)).then(value=>{
                console.log("db data created",value);
                // callBackResult('success');
               // localStorage.setItem('currentUserPhoto',value.user.photoURL);
                this.router.navigateByUrl('/chat');
              }).catch(error=>{
                console.log('Something went wrong with db creation hre: ', error);
              })  
            })
          })
        ).subscribe()
     })
     .catch(error => {
       console.log('Something went wrong: ', error);
     });
  }
  doAuthenticate(user:User){
       this.authService.auth.signInWithEmailAndPassword(user.email, user.password)
       .then(value => {
        console.log('Sucessfully authenticated', value);
        localStorage.setItem('currentUser',value.user.uid);
        
        console.log(localStorage.getItem('currentUser'));
        this.uid=value.user.uid;
        this.router.navigateByUrl('/chat');
       })
       .catch(error => {
         console.log('Something went wrong: ', error);
       });
  }
  async signOut(){
    try {
      await this.authService.auth.signOut();
     localStorage.removeItem('currentUser');
     localStorage.removeItem('photoUrl');
     console.log('loggedout')
     this.router.navigateByUrl('/logIn');
    } catch (e){
     console.log('user already signed out ERROR');
    } 
  }
  isLoggedIn():boolean |Promise<boolean>{
    var userId=localStorage.getItem('currentUser');
   if(userId!=null){
     return true;
   }
   else
   {
     return false;
   }
  }

  getCurrentUser():User{
    let user = new User();
      this.db.collection("users").doc(localStorage.getItem('currentUser'))
      .ref.get().then(function (doc) {
        if (doc.exists) {
          user.displayName=doc.data().displayName;
          user.uid=localStorage.getItem('currentUser');
          user.email=doc.data().email;
          user.photoURL=doc.data().photoURL;
          localStorage.setItem('photoUrl',doc.data().photoURL);
          return user;
        } else {
          console.log("There is no document!");
          return user;
        }
      }).catch(function (error) {
        console.log("There was an error getting your document:", error);
        return user;
      });
      return user;
  }
 
  searchFriend(userName,userCallBack){
    console.log('fservice',userName)
    let userarray : User[]=[];
    var userRef = this.db.firestore.collection("users");
    userRef.where("displayName","==",userName).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let user = new User();
          user.displayName=doc.data().displayName;
          user.email=doc.data().email;
          user.uid=doc.id;
          user.photoURL=doc.data().photoURL;
          userarray.push(user);
            console.log(doc.id, " => ", doc.data());
            userCallBack(userarray);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
  }
  constructor(public db: AngularFirestore 
    ,private authService:AngularFireAuth,
    private router:Router
    ,private angularStorage:AngularFireStorage) { }
}
