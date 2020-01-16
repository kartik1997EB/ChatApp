import { Injectable } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { ChatService } from  '../../dao/service/chat.service';
import { Friend } from '../model/friend';
import { UtilityService } from './utility.service';
import { Messages } from '../model/messages';

@Injectable({
  providedIn: 'root'
})
export class ChatPageService {

  messages : Messages[]=[];
  isNew(user:User,callBackForIsNew){
    return this.chatService.isNew(user,callBackForIsNew);
  }
  makeFriend(user:User,cbInitiateChat){
    let friend =new Friend();
    friend.friendId=user.uid;
    friend.status="sent";
    friend.date=this.util.getDateAndTime();
    friend.msgBucket=localStorage.getItem('currentUser').substr(0,5)+user.uid.substr(0,6);
    friend.recentChatTime=this.util.getDateAndTime();
    console.log("bucket",friend.msgBucket)

    let forFriend = new Friend();
    forFriend.friendId=localStorage.getItem('currentUser');
    forFriend.status="";
    forFriend.date=this.util.getDateAndTime();
    forFriend.recentChatTime=this.util.getDateAndTime();
    forFriend.msgBucket=localStorage.getItem('currentUser').substr(0,5)+user.uid.substr(0,6);

    this.chatService.makeFriend(friend,forFriend,cbInitiateChat);

  }
  acceptFriend(friendData,cbInitiateChat){
    this.chatService.acceptFriend(friendData,cbInitiateChat);
  }
  loadChatData(msgBucket,callBackMsgs){
    this.chatService.loadChatData(msgBucket).subscribe(result => {
      
      this.messages = result.map(e => {
        return {
          userId:e.payload.doc.data()['userId'],
          friendId: e.payload.doc.data()['friendId'],
          msg:e.payload.doc.data()['msg'],
          isMIME: e.payload.doc.data()['isMIME'],
          time:e.payload.doc.data()['time'],
          imgUrl:e.payload.doc.data()['imgUrl']
        } as Messages;
    })
    console.log('messages',this.messages);
    callBackMsgs(this.messages.reverse());
  })
  
  }
  saveDataToBucket(friend:User,msgInput){
    let msgContent=new Messages();
    msgContent.friendId=friend.uid;
    msgContent.isMIME=false;
    msgContent.msg=msgInput;
    msgContent.userId=localStorage.getItem('currentUser');
    msgContent.time=this.util.getDateAndTime();
    console.log('msg content',msgContent);
    console.log('selected user',friend);
    this.chatService.saveDataToBucket(friend,msgContent)
  }
  saveImgToBucket(friend:User,uploadedImage){
    this.chatService.saveImgToBucket(friend,uploadedImage)
  }
  constructor(private chatService:ChatService,private util:UtilityService) { }
}
