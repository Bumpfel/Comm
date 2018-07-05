// npm i --save firebase@^4.5.0

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';


import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppRoutingModule } from './app-routing.module';


// Navigation
import { TopnavbarComponent } from './navigation/topnavbar/topnavbar.component';
import { MessagesComponent } from './navigation/messages/messages.component';

// Pages
import { ChatLobbyComponent } from './pages/chat/chat-lobby/chat-lobby.component';
import { ChatChannelComponent } from './pages/chat/chat-channel/chat-channel.component';
import { StartComponent } from './pages/start/start.component';

// Services
import { GlobalService } from './services/global.service';
import { AuthService } from './services/auth.service';
import { MessageService } from './services/message.service';
import { ChatService } from './services/chat.service';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TaskService } from './services/task.service';


@NgModule({
  declarations: [
    AppComponent,
    ChatLobbyComponent,
    ChatChannelComponent,
    StartComponent,
    TopnavbarComponent,
    MessagesComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [
    GlobalService,
    AuthService,
    MessageService,
    ChatService,
    TaskService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
