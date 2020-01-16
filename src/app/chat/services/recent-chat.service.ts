import { Injectable } from '@angular/core';
import { ChatService } from '../../dao/service/chat.service';
import { User } from 'src/app/core/model/user';

@Injectable({
  providedIn: 'root'
})
export class RecentChatService {

  constructor(private chatService : ChatService) { }

  loadRecentChat(callBackUser){
    this.chatService.loadRecentChat(callBackUser);
}
  
}
