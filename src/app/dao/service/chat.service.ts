import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import { User } from 'src/app/core/model/user';
import { Friend } from 'src/app/chat/model/friend';
import { Messages } from '../../chat/model/messages';
import { UtilityService } from 'src/app/chat/services/utility.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { switchMap, finalize} from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { WishModel } from 'src/app/chat/model/wish-model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  isNew(user:User,callBackForIsNew){
  
    let coll = localStorage.getItem('currentUser')+'friend';
    console.log('reaced');
    var userRef = this.db.firestore.collection(coll);
    userRef.where("friendId","==",user.uid).get()
    .then(function(querySnapshot) {
      if(querySnapshot.size===0){
        callBackForIsNew(true,null);
        }
      else{
        querySnapshot.forEach(function(doc) {
          console.log(' slect data',doc.data())
          let friend = new Friend();
          friend.friendId=doc.data().friendId;
          friend.status=doc.data().status;
          friend.msgBucket=doc.data().msgBucket;
          friend.date=doc.data().date;
          console.log(friend);
          if(doc.data().status==='')
            callBackForIsNew(true,friend);
          else
            callBackForIsNew(false,friend);
         });
      }
        
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        callBackForIsNew(false);
    });
    console.log('user ref',userRef);
  }
  makeFriend(friend:Friend,forFriend:Friend,cbInitiateChat){

    let collName=localStorage.getItem("currentUser")+"friend";
    console.log('my coll',collName);
    this.db.collection(collName).
    add(Object.assign({}, friend)).then(value=>{
      console.log("friend data created for me ");
    }).catch(error=>{
      console.log('Something went wrong with db creation hre: ', error);
    })
    
    let frndCollName=friend.friendId+"friend";
    console.log('friend coll',frndCollName);
    this.db.collection(frndCollName).
    add(Object.assign({}, forFriend)).then(value=>{
      console.log("my  data created for friend ");
    }).catch(error=>{
      console.log('Something went wrong with db creation hre: ', error);
    })

    let initialMsg = new Messages();
    initialMsg.userId=forFriend.friendId;
    initialMsg.friendId=friend.friendId;
    initialMsg.isMIME=false;
    initialMsg.msg='hello';
    initialMsg.time = friend.date;

    this.db.collection(friend.msgBucket).add(Object.assign({}, initialMsg)
    ).then(value=>{
      console.log("my  initial msg  data created  ");
      cbInitiateChat(friend.msgBucket);
    }).catch(error=>{
      console.log('Something went wrong with db creation hre: ', error);
    })
  }

  acceptFriend(user,cbInitiateChat){
    
    let d : Date = this.util.getDateAndTime();
    let CollName=localStorage.getItem('currentUser')+"friend";
     var userRef = this.db.firestore.collection(CollName);
    userRef.where("friendId","==",user.uid).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(' slect data',doc.data())
          userRef.doc(doc.id).update({
            recentChatTime:d,
            status: 'accept'
          });
          cbInitiateChat(doc.data().msgBucket);
          console.log("success"); 
         });
      
        
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
  }

  loadRecentChat(callBackUser){

    let userRef = this.db.firestore.collection("users");
    let CollName=localStorage.getItem('currentUser')+"friend";
    this.db.collection<Friend[]>(CollName,ref => ref.orderBy('recentChatTime','desc' )).snapshotChanges().subscribe(result => {

      let userarray : User[]=[];
      result.map(e=>{
        var bucket=e.payload.doc.data()['msgBucket'];
        userRef.where('uid','==',e.payload.doc.data()['friendId'])
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                let user = new User();
                user.displayName=doc.data().displayName;
                user.email=doc.data().email;
                user.uid=doc.id;
                user.photoURL=doc.data().photoURL;
                user.bucket=bucket;
                userarray.push(user);
                });

          })
          .catch(function(error) {
              console.log("Error getting documents of users: ", error);
          });      
      })
      callBackUser(userarray)
      console.log(userarray);

    })
  }
  loadChatData(msgBucket){
    return this.db.collection<Messages[]>(msgBucket, ref => ref.where('time','<=',this.util.getDateAndTimeforChat()).orderBy('time','desc' ).limit(20)).snapshotChanges();
  }
  saveDataToBucket(friend:User,msgContent:Messages){
    
    this.db.collection(friend.bucket).add(Object.assign({}, msgContent)).then(value=>{
      console.log("db data created for msg");
      let CollName=localStorage.getItem('currentUser')+"friend";
      let CollNameFriend=friend.uid+'friend';
     this.updateRecentTime(friend.uid,CollName);
     this.updateRecentTime(localStorage.getItem('currentUser'),CollNameFriend);
    }).catch(error=>{
      console.log('Something went wrong with db creation hre: ', error);
    })  

  }  
  saveImgToBucket(friend:User,img:File){

        let msg = new Messages();
        const fileRef =this.angularStorage.ref(friend.uid+img.name);
        this.angularStorage.upload( friend.uid+img.name,img).snapshotChanges().pipe(
          finalize(()=>{
            fileRef.getDownloadURL().subscribe((url)=>{
              //after completion of image upload save data and reference of image to message collection
              msg.friendId=friend.uid;
              msg.isMIME=true;
              msg.msg="";
              msg.time=this.util.getDateAndTime();
              msg.userId=localStorage.getItem('currentUser');
              msg.imgUrl=url;

              this.db.collection(friend.bucket).add(Object.assign({}, msg)).then(value=>{
                console.log("db data created for image ",value);
              }).catch(error=>{
                console.log('Something went wrong with db creation hre: ', error);
              })  
            })
          })
        ).subscribe()
  }
  updateRecentTime(id,collectionName){
    let d : Date = this.util.getDateAndTime();
    
     var userRef = this.db.firestore.collection(collectionName);
    userRef.where("friendId","==",id).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(' slect data',doc.data())
          userRef.doc(doc.id).update({
            recentChatTime:d
          });
          console.log("successully updated  time"); 
         });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }
  scheduledwish(wish:WishModel){
    this.db.collection("WishScheduler").add(Object.assign({}, wish)).then(value=>{
      console.log("db data created for wish scheduler");
    }).catch(error=>{
      console.log('Something went wrong with db creation hre: ', error);
    })  


  }
  constructor(public db: AngularFirestore ,
    private router:Router,private util:UtilityService,
    private angularStorage:AngularFireStorage
   ) { }
}
