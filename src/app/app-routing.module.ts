import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatLobbyComponent } from './pages/chat/chat-lobby/chat-lobby.component';
import { ChatChannelComponent } from './pages/chat/chat-channel/chat-channel.component';
import { StartComponent } from './pages/start/start.component';
import { AssignmentTasksComponent } from './pages/assignments/assignment-tasks/assignment-tasks.component';
import { AssignmentLobbyComponent } from './pages/assignments/assignment-lobby/assignment-lobby.component';

const routes : Routes = [
    {
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
    {
      path:"assignments",
      component:AssignmentLobbyComponent
    },
    {
      path:"assignments/:id",
      component:AssignmentTasksComponent
    },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
 export class AppRoutingModule {}
