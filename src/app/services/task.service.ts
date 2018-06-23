import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { MessageService } from './message.service';

import { Task, TaskCategory, MultiDate } from '../interfaces/task';

@Injectable()
export class TaskService {

  user: User;

  taskCategories: TaskCategory[];
  tasks: Task[];
  categsRef: AngularFirestoreCollection<TaskCategory>;

  actionInProgress: boolean;
  newCategoryPopup: boolean;
  editCategoryPopup: boolean;
  deleteCategoryPopup: boolean;
  newTaskPopup: boolean;
  editTaskPopup: boolean;
  deleteTaskPopup: boolean;

  // showEditCategory: boolean;
  pendingDeletion: string;

  constructor(private afs: AngularFirestore,
    private authService: AuthService,
    private globalService: GlobalService,
    private messageService: MessageService) {

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.categsRef = this.afs.collection<TaskCategory>("users/" + user.uid + "/taskCategories/");
      this.categsRef.valueChanges().subscribe(cats => this.taskCategories = cats);
    });
  }

  filterByStatusAndSort(tasks: Task[], status: string): Task[] {
      let newTasks = tasks.filter(task => task.status == status);

      if (status == "not started") {
        newTasks.sort((a, b) => {
          if (a.priority < b.priority)
            return 1;
          else if(a.priority > b.priority)
            return -1;
          else
            return b.id - a.id; // secondary sorting
        });
      }
      else if (status == "in progress") {
        newTasks.sort((a, b) => {
          if (a.startedAt < b.startedAt)
            return 1;
          return -1;
        });
      }
      else if (status == "completed") {
        newTasks.sort((a, b) => {
          if (a.completedAt < b.completedAt)
            return 1;
          return -1;
        });
      }
    return newTasks;
  }


  //--------------------------- Category functions -------------------------------//

  newCategory(name: string): void {
    this.actionInProgress = true;
    let trimmedName = name.trim();
    if (trimmedName.length > 0) {
      let taskDocRef: AngularFirestoreDocument<TaskCategory> = this.afs.doc("users/" + this.user.uid + "/taskCategories/" + trimmedName.toLowerCase());
      taskDocRef.set({ "name": trimmedName, "tasks": [] })
        .then((ref) => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("add", "Category added");
        })
        .catch((error) => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("error", "Error creating category. Please try again later");
        });
    }
    else {
      this.messageService.addMessage("error", "Category name mustn't be empty");
    }
  }

  deleteCategory(category: TaskCategory) {
    this.actionInProgress = true;
    if (category.tasks.length > 0) {
      this.closePopups();
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Cannot delete category. Category is not empty")
    }
    else {
      this.categsRef.doc(category.name.toLowerCase()).delete()
        .then(() => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("delete", "Category deleted");
        })
        .catch((error) => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("error", "Error deleting category. Please try again later");
        });
    }
  }

  editCategory(category: TaskCategory, newName: string) {
    this.pendingDeletion = category.name;
    this.actionInProgress = true;
    this.categsRef.doc(newName.toLowerCase()).set({ 'name': newName, 'tasks': category.tasks })
      .then(() => {
        this.categsRef.doc(category.name.toLowerCase()).delete()//.then(() => console.log(category.name + " deleted"));
          .catch((error) => {
            console.log("Error deleting old category")
          })
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("update", "Category edited");
      })
      .catch((error) => {
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("error", "Error editing category. Please try again later")
      });
  }

  saveCollapsedCategoryState(name: string, collapsedState: boolean) { // was used for only saving on ngOnDestroy (name made more sense). using the other one atm. 
    this.categsRef.doc(name.toLowerCase()).update({ 'collapsed': collapsedState });
  }

  collapseCategory(name: string, collapsedState: boolean) { // Duplicate
    this.categsRef.doc(name.toLowerCase()).update({ 'collapsed': collapsedState });
  }

  //-------------------------------- Task functions ------------------------------//

  newTask(category: TaskCategory, newName: string, newDescription: string, newPoints: number, newPriority: number): void {
    this.actionInProgress = true;
    let catRef = this.categsRef.doc(category.name.toLowerCase());
    // let tasks: Task[] = Object.assign({}, category.tasks);
    if (!this.user.nextTaskId)
      this.user.nextTaskId = 0;

    category.tasks.push({ 'id': this.user.nextTaskId, 'name': newName, 'description': newDescription, 'points': newPoints, 'priority': newPriority, 'status': 'not started' });
    catRef.update({ 'tasks': category.tasks }) //, 'nextTaskId': category.nextTaskId + 1 })
      .then(() => {
        this.afs.doc("users/" + this.user.uid).update({ 'nextTaskId': (this.user.nextTaskId + 1) })
          .catch((error) => {
            console.log("Error updating nextTaskId");
          });
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("add", "Task created");
      })
      .catch((error) => {
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("error", "Error creating task. Please try again later");
        // console.log(error);
      });
  }

  editTask(currentCategory: TaskCategory, destinationCategory: TaskCategory, taskId: number, newName: string, newDescription: string, newPoints: number, newPriority: number): void {
    this.actionInProgress = true;
    let docRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc(currentCategory.name.toLowerCase());
    let taskIndex = currentCategory.tasks.findIndex(task => task.id == taskId);
    let task = currentCategory.tasks[taskIndex]; //bad practice to modify parameter
    task.name = newName;
    task.description = newDescription;
    task.points = newPoints;
    task.priority = newPriority;
    task.editedAt = this.globalService.getTimeStamp();

    if (currentCategory != destinationCategory) {
      let newDocRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc(destinationCategory.name.toLowerCase());
      destinationCategory.tasks.push(task);
      newDocRef.update({ 'tasks': destinationCategory.tasks });
      currentCategory.tasks.splice(taskIndex, 1);
    }
    docRef.update({ 'tasks': currentCategory.tasks })
      .then(() => {
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("update", "Task edited");
      });
  }

  deleteTask(category: TaskCategory, taskId: number) {
    this.actionInProgress = true;
    let docRef = this.categsRef.doc<TaskCategory>(category.name.toLowerCase());
    let taskIndex: number = category.tasks.findIndex(task => task.id == taskId);
    category.tasks.splice(taskIndex, 1); // bad practice to modify parameter, but cba to copy array
    docRef.update({ 'tasks': category.tasks })
      .then(() => {
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("delete", "Task deleted");
      });
  }

  changeTaskStatus(category: TaskCategory, taskId: number, newStatus: string) {
    let docRef = this.categsRef.doc<TaskCategory>(category.name.toLowerCase());
    // let tasks: Task[] = this.taskCategories.find(cat => cat.name.toLowerCase() == categoryName.toLowerCase()).tasks;
    let task: Task = category.tasks.find(task => task.id == taskId);
    task.status = newStatus;
    if (task.status == "not started") {
      task.startedAt = null;
      task.completedAt = null;
    }
    else if (task.status == "in progress") {
      if (task.startedAt == null)
        task.startedAt = this.globalService.getTimeStamp();
      task.completedAt = null;
    }
    else if (task.status == "completed")
      task.completedAt = this.globalService.getTimeStamp();
    docRef.update({ 'tasks': category.tasks })//.then(() => console.log("changed status"));
  }

  // fixPrio(category: TaskCategory, oldTask) {
  //   let docRef = this.categsRef.doc<TaskCategory>(category.name.toLowerCase());
  //   let task: Task = category.tasks.find(task => task.id == oldTask.id);
  
  //   if(oldTask.priority == "low")
  //     task.priority = 1;
  //   else if(oldTask.priority == "medium")
  //     task.priority = 2;
  //   if(oldTask.priority == "high")
  //     task.priority = 3;
  //   if(oldTask.priority == "critical")
  //     task.priority = 4;
    
  //     docRef.update({ 'tasks': category.tasks })
  //       .then(() => this.messageService.addMessage("update", "prio fixed for task " + task.name));
  // }

  //----------------------- Popup functions ----------------------------//

  showNewCategoryPopup() {
    this.closePopups();
    this.newCategoryPopup = true;
  }

  showEditCategoryPopup() {
    this.closePopups();
    this.editCategoryPopup = true;
  }

  showDeleteCategoryPopup() {
    this.closePopups();
    this.deleteCategoryPopup = true;
  }

  showNewTaskPopup() {
    this.closePopups();
    this.newTaskPopup = true;
  }

  showEditTaskPopup() {
    this.closePopups();
    this.editTaskPopup = true;
  }

  showDeleteTaskPopup() {
    this.closePopups();
    this.deleteTaskPopup = true;
  }

  closePopups() {
    this.newCategoryPopup = undefined;
    this.editCategoryPopup = undefined;
    this.deleteCategoryPopup = undefined;
    this.newTaskPopup = undefined;
    this.editTaskPopup = undefined;
    this.deleteTaskPopup = undefined;
  }

}
