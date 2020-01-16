import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  date: Date;
  getDateAndTime(): Date {
   var dt= new Date();
   this.date = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),dt.getHours(),dt.getMinutes(),dt.getSeconds());
   console.log('now date is ',this.date);
   return this.date;
}
getDateAndTimeforChat(){
  var dt= new Date();
  this.date = new Date(dt.getFullYear(),dt.getMonth()+1,dt.getDate(),dt.getHours(),dt.getMinutes()+1,dt.getSeconds());
  // this.date = new Date(dt.getFullYear(),dt.getMonth()+1,dt.getDate(),dt.getHours(),43,0);
  console.log('now date is ',this.date);
  return this.date;
}
getDateAndTimeforschedule(yr,mon,dt,hr,min){
  var date= new Date();
  this.date = new Date(parseInt(yr),parseInt(mon)-1,parseInt(dt),parseInt(hr),parseInt(min));
  // this.date = new Date(dt.getFullYear(),dt.getMonth()+1,dt.getDate(),dt.getHours(),43,0);
  console.log('now date is in schedule',this.date);
  return this.date;
}
  constructor() { }
}
