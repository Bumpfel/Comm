import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { MessageService } from './message.service';

@Injectable()
export class TaskService {

  user: User;

  taskCategories: TaskCategory[];
  tasks: Task[];

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private globalService: GlobalService,
              private messageService: MessageService) { 

    this.authService.user$.subscribe(user => {
      this.user = user;
      let taskCatRef = this.afs.collection<TaskCategory>('users/' + user.uid + '/taskCategories/');
      taskCatRef.valueChanges().subscribe(cats => this.taskCategories = cats);
      // taskCatRef
    });
  }

  newCategory(name: string): void {
    let trimmedName = name.trim();
    if(trimmedName.length > 0) {
      // let taskColRef = this.authService.userDocRef.collection('/taskCategories/')
      // taskColRef.add({ 'id': '-1', 'name': trimmedName })
      let taskDocRef: AngularFirestoreDocument<TaskCategory> = this.afs.doc('users/' + this.user.uid + '/taskCategories/' + trimmedName.toLowerCase())
      taskDocRef.set({ 'name': trimmedName, 'name_key': trimmedName.toLowerCase(), 'nextTaskId': 0 })
        .then((ref) => {
          this.messageService.addMessage("add", "Category added");
          // taskColRef.doc(ref.id).update({ 'id': ref.id });
        });
    }
    else {
      this.messageService.addMessage("error", "Category name mustn't be empty");
    }
  }

  newTask(name: string): void {
    // this.afs.
  }
}
