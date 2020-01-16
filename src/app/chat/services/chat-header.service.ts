import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';
import { ChatService } from 'src/app/dao/service/chat.service';
import { WishModel } from '../model/wish-model';
import { User } from 'src/app/core/model/user';

@Injectable({
  providedIn: 'root'
})
export class ChatHeaderService {

  constructor(private util : UtilityService,private chatService:ChatService) { }
  setWishMsg(wishMsg,date,time,friend:User){

    let year = date.substr(0,4);
    let mm = date.substr(5,2);
    let dd = date.substr(8,2);
    
    let hours = time.substr(0,2);
    let minutes = time.substr(3,2);
    
    let scheduleDate :Date =this.util.getDateAndTimeforschedule(year,mm,dd,hours,minutes);

    let wish = new WishModel
    wish.bucketId=friend.bucket;
    wish.performAt=scheduleDate;
    wish.sendBy=localStorage.getItem('currentUser');
    wish.wishMsg=wishMsg;
    wish.status="scheduled";
    wish.friendId=friend.uid;

    this.chatService.scheduledwish(wish);

  }
}
