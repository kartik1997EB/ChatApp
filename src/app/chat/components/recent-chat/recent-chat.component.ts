import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { User } from '../../../core/model/user';
import { RecentChatService } from '../../services/recent-chat.service'

@Component({
  selector: 'app-recent-chat',
  templateUrl: './recent-chat.component.html',
  styleUrls: ['./recent-chat.component.css']
})
export class RecentChatComponent implements OnInit {

  @Input() users:User[];
  @Output() userEvent = new EventEmitter<User>();
  @Input() searchUsers : string;
  selectedId : string;
  constructor(private service : RecentChatService) { }

  selectUser(user:User){
    this.selectedId=user.uid;

    // console.log(event.path[2].style.backgroundColor='black');
    this.userEvent.emit(user);
   
  }
  ngOnInit() {
    this.service.loadRecentChat((users)=>{this.users=users});
  }

}
