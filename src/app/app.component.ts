import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Subscription } from 'rxjs/Subscription';

interface Forum {
  name: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  forumsCollection: AngularFirestoreCollection<Forum>;
  forums: Observable<Forum[]>;


  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {
    this.forumsCollection = this.afs.collection('forum/');
    this.forums = this.forumsCollection.valueChanges();

  }
}
