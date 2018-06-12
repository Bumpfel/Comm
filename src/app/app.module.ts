// npm i --save firebase@^4.5.0

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';


import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppRoutingModule } from './app-routing.module';
// Pages
import { ChatLobbyComponent } from './chat/chat-lobby/chat-lobby.component';
import { ChatChannelComponent } from './chat/chat-channel/chat-channel.component';

// Services
import { GlobalService } from './services/global.service';
import { AuthService } from './services/auth.service';
import { StartComponent } from './pages/start/start.component';
import { TopnavbarComponent } from './navigation/topnavbar/topnavbar.component';
import { MessagesComponent } from './navigation/messages/messages.component';
import { MessageService } from './services/message.service';
import { PopupComponent } from './navigation/popup/popup.component';
import { PopupService } from './services/popup.service';
import { ChatService } from './services/chat.service';

// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  declarations: [
    AppComponent,
    ChatLobbyComponent,
    ChatChannelComponent,
    StartComponent,
    TopnavbarComponent,
    MessagesComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    // AngularFirestore,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    // AngularFireDatabaseModule,
  ],
  providers: [
    GlobalService,
    AuthService,
    MessageService,
    PopupService,
    ChatService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
