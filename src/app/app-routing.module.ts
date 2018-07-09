import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatLobbyComponent } from './pages/chat/chat-lobby/chat-lobby.component';
import { ChatChannelComponent } from './pages/chat/chat-channel/chat-channel.component';
import { StartComponent } from './pages/start/start.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TestComponent } from './pages/test/test.component';

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
      path:"tasks",
      component:TasksComponent
    },
    {
      path:"test",
      component:TestComponent
    },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
 export class AppRoutingModule {}
