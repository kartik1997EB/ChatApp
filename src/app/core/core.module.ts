import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './components/auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms'
import { DaoModule } from '../dao/dao.module';
import { ChatModule } from '../chat/chat.module'
import { AuthGuard } from './service/auth.guard';




@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,ReactiveFormsModule,DaoModule,ChatModule
  ],
  exports:[AuthComponent],
  providers:[AuthGuard]
})
export class CoreModule { }
