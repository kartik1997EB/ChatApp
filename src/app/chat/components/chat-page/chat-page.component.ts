import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { ChatPageService } from '../../services/chat-page.service'
import { Friend } from '../../model/friend';
import { Messages } from '../../model/messages';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  selectedUser:User;
  selectedUserPhoto:string;
  isNewFriend = false;
  friendStatus = 'initial';
  friend : Friend ;
  messages : Messages[]=[];
  currentUser : string ;
  inputMsg : string ;
  canChat : boolean=false;
  uploadedImage : File;


  constructor(private chatService:ChatPageService) { }

  rcvSelectedUser(event){
    console.log("in chat page ",event);
    this.selectedUser=event;
    this.messages=[];
    this.canChat=false;
    this.friendStatus = 'initial';
    this.chatService.isNew(event,(isNew,friendData)=>{this.isNewFriend=isNew;if(friendData)this.friendStatus=friendData.status,isNew;this.friend=friendData;this.initiateChat()});   
  }
  makeFriend(status){
    if(status==='send'){
      this.chatService.makeFriend(this.selectedUser,(bucket)=>{this.selectedUser.bucket=bucket;this.friendStatus='sent';this.initiateChat()});
      this.isNewFriend = false;
      this.canChat=true;
    }
    else{
      this.chatService.acceptFriend(this.selectedUser,(bucket)=>{this.selectedUser.bucket=bucket;this.friendStatus='accept';this.initiateChat()});
      this.isNewFriend = false;
      this.canChat=true;
    }
    
  }
  initiateChat(){
    console.log(  'hello ',this.selectedUser.bucket);
    if(this.selectedUser.bucket){
      this.chatService.loadChatData(this.selectedUser.bucket,(msgs)=>{this.messages=msgs});
    }
    else if(this.friend){
      this.chatService.loadChatData(this.friend.msgBucket,(msgs)=>{this.messages=msgs});
    }
    if(!this.isNewFriend){
        this.canChat=true;
    }
    // else if( this.friend)
    //   this.chatService.loadChatData(this.friend.msgBucket,(msgs)=>{this.messages=msgs});
  }
  sendData(){
   if(this.inputMsg){
    this.chatService.saveDataToBucket(this.selectedUser,this.inputMsg);
    this.inputMsg="";
   } 
  }
  sendImg(event:any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      // reader.onload = (e:any)=>this.pImgSrc=e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.uploadedImage=event.target.files[0];
      this.chatService.saveImgToBucket(this.selectedUser,this.uploadedImage);
    }
  }
 
  ngOnInit() {
    this.currentUser=localStorage.getItem('currentUser');
    this.selectedUserPhoto=localStorage.getItem('photoUrl');
  }

}
