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
import { PopupsComponent } from './navigation/popups/popups.component';

// Pages
import { ChatLobbyComponent } from './pages/chat/chat-lobby/chat-lobby.component';
import { ChatChannelComponent } from './pages/chat/chat-channel/chat-channel.component';
import { StartComponent } from './pages/start/start.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TestComponent } from './pages/test/test.component';
import { ProductsOverviewComponent } from './pages/products/products-overview/products-overview.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { ProductsMenuComponent } from './pages/products/products-menu/products-menu.component';

// Services
import { GlobalService } from './services/global.service';
import { AuthService } from './services/auth.service';
import { MessageService } from './services/message.service';
import { ChatService } from './services/chat.service';
import { TaskService } from './services/task.service';
import { PopupService } from './services/popup.service';



@NgModule({
  declarations: [
    AppComponent,
    ChatLobbyComponent,
    ChatChannelComponent,
    StartComponent,
    TopnavbarComponent,
    MessagesComponent,
    TasksComponent,
    TestComponent,
    ProductsOverviewComponent,
    ProductDetailsComponent,
    ProductsMenuComponent,
    PopupsComponent
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
    TaskService,
    PopupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
