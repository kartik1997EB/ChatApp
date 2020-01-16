import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './core/components/auth/auth.component';
import { AuthGuard } from './core/service/auth.guard';
import { ChatPageComponent } from './chat/components/chat-page/chat-page.component';


const routes: Routes = [{path:'chat',component:ChatPageComponent,canActivate:[AuthGuard]},
{ path: '', redirectTo: '/logIn', pathMatch: 'full' },
{ path:'logIn',component:AuthComponent},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
