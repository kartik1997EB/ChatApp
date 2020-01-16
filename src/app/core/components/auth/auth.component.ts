import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl ,FormBuilder ,Validators } from "@angular/forms";
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user';
import { Location } from '@angular/common';
import { FirebaseService } from 'src/app/dao/service/firebase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  cardHeight='65%';
  login:string='Log In';
  pImgSrc :string ="/assets/user.png";
  selectedImage : File;
  signUp : FormGroup;
  submitted : boolean=false;
  constructor(private fromBuilder: FormBuilder,private authservice:AuthService,private location:Location,private fb:FirebaseService) {}
   
submitUserDetails(){
  this.submitted=true;
  if(this.signUp.valid){
    console.log('User form is valid!!');
    console.log(this.signUp.value);
    var user = new User();
    user.email=this.signUp.value.email;
    user.password=this.signUp.value.password;
    user.displayName=this.signUp.value.displayName;
      if(this.login=='Sign Up'){
        this.authservice.createUser(user,this.selectedImage,(res)=>{this.login=res});
      }
      else{
        this.authservice.doAuthenticate(user);
      }

  } else {
    console.log('User form is not valid!!')
    return;
  }

}
get frm() { return this.signUp.controls; }

  
uploadPimg(event:any){
  if(event.target.files && event.target.files[0]){
    const reader = new FileReader();
    reader.onload = (e:any)=>this.pImgSrc=e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImage=event.target.files[0];
  }
}
togglePage(page){
  console.log(page);
  this.login=page;
  if(page=='Sign Up'){
    this.cardHeight='80%';
    this.signUp = this.fromBuilder.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      imgURL:['',Validators.required],
      displayName:['',Validators.required]
    })
    console.log("initialized");

  }else{
    console.log('else block');
    this.cardHeight='65%';
    this.signUp = this.fromBuilder.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      imgURL:[''],
      displayName:['']
    })
  }
  this.submitted=false;
}


  ngOnInit() {
    this.signUp = this.fromBuilder.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      imgURL:[''],
      displayName:['']
    })
    console.log(this.location)

  }

}
