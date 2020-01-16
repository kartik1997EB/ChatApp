import { Component, OnInit,Output, EventEmitter} from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { User } from 'src/app/core/model/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  pSrc="/assets/user.png";
  myUser : User;
  searchedUsers : User;
  searchUsers : string ;
  @Output() userEvent = new EventEmitter<User>();

  constructor(private service:SidenavService) { }


  searchFriend(){
    console.log(this.searchUsers)
    this.service.searchFriend(this.searchUsers,(users)=>{this.searchedUsers=users;console.log(this.searchedUsers)});
   this.searchUsers="";
  
  }
  rcvSelectedUser(event){
    this.userEvent.emit(event);
    this.searchUsers="";
  }
  signOut(){
    this.service.signOut();
  }
  ngOnInit() {
    
    this.myUser=this.service.getCurrentUser();

  }
  ngAfterContentChecked(){
    this.pSrc=this.myUser.photoURL;
  }

}
