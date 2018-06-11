import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";

import { ChatLobbyComponent } from './chat/chat-lobby/chat-lobby.component';
import { ChatChannelComponent } from './chat/chat-channel/chat-channel.component';
import { StartComponent } from './pages/start/start.component';

// pages

//Routes Array
const routes : Routes = [
    { // Start page 
      path:"",
      redirectTo: "home",
      pathMatch: "full" 
    },
    {
      path:"home",
      component:StartComponent
    },
    {
      path:"chat",
      component:ChatLobbyComponent
    },
    {
      path:"chat/:id",
      component:ChatChannelComponent
    },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
 export class AppRoutingModule {}
