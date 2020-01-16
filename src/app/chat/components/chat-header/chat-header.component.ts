import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { ModalManager } from 'ngb-modal';
import { ChatHeaderService } from '../../services/chat-header.service';


@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.css'],
})
export class ChatHeaderComponent implements OnInit {

  @Input() selectedUser:User;
  inputWish : string;
  inputDate : any;
  inputTime : any;
  errorWarn;
  constructor(private modalService: ModalManager,private service:ChatHeaderService) { }

  ngOnInit() {
  }
  @ViewChild('myWishModal',{static: false}) myModal;
  private modalRef;
  openModal(){
    this.modalRef = this.modalService.open(this.myModal, {
        size: "md",
        modalClass: 'mymodal',
        hideCloseButton: false,
        centered: false,
        backdrop: true,
        animation: true,
        keyboard: false,
        closeOnOutsideClick: true,
        backdropClass: "modal-backdrop",
        windowClass: 'custom-class',
    })
}
getData(){
  console.log("hiii am get your data");
  if(this.inputDate && this.inputTime && this.inputWish){
    this.modalService.close(this.modalRef);
    this.service.setWishMsg(this.inputWish,this.inputDate,this.inputTime,this.selectedUser);
  }
  else{
    this.errorWarn='all fields are required';
  }
}
closeModal(){
  this.modalService.close(this.modalRef);
}

}
