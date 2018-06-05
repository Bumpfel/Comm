// npm i --save firebase@^4.5.0

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';

// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';

var firebaseConfig = {
  apiKey: "AIzaSyDSDOyus6dbVeGbrWXnFJWwl_66RUlaHbo",
  authDomain: "comm-ca912.firebaseapp.com",
  databaseURL: "https://comm-ca912.firebaseio.com",
  projectId: "comm-ca912",
  storageBucket: "comm-ca912.appspot.com",
  messagingSenderId: "407887629609"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireModule,
    // AngularFirestore,
    AngularFirestoreModule,
    // AngularFireDatabaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
