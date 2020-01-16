import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ChatPageComponent } from './components/chat-page/chat-page.component';
import { RecentChatComponent } from './components/recent-chat/recent-chat.component';
import { FormsModule } from '@angular/forms';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { SearchFilterPipe } from './services/search-filter.pipe';
import { ModalModule } from 'ngb-modal'; 


@NgModule({
  declarations: [SidenavComponent, ChatPageComponent, RecentChatComponent, ChatHeaderComponent, SearchFilterPipe],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule
  ],
  exports:[]
})

export class ChatModule { }
