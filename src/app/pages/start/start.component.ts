import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { GlobalService, Timer } from '../../services/global.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  user: User;

  timer: Timer = new Timer();
  timerHandler: NodeJS.Timer;

  timeStamp;
  clockHandler: NodeJS.Timer;
  clockStarted: boolean;

  constructor(private authService: AuthService,
              private messageService: MessageService,
              private globalService: GlobalService ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => this.user = user);

    this.timer.printLog = false;
  }

  //not working
  setPopupPos(element: HTMLElement, topAdjustment: number, leftAdjustment: number): string {
    return "{top: " + (element.offsetTop - 100) + "px, left:" + (element.offsetLeft + 200) + "px }";
  }



  // ------------------------------- Efficiency Tests ---------------------------------
  testArray(size: number) {
    let arr: any[] = [];

    for(let i: number = 0; i < size; i ++) {
      arr.push(this.globalService.getRandomInt(0, size));
    }
    // console.log(arr);
    // arr.sort((a, b) => a - b);
        
    console.log("\n\tfind:");
    this.testFind(arr);

    console.log("\n\tfilter:");
    this.testFilter(arr);
    
    console.log("\n\tfor loop:")
    this.testLoop(arr);

    console.log("\n\tfindIndex:");
    this.testFindIndex(arr);    
    
    console.log("---------------------");
  }

  testFind(arr: any[]) {
    let t = new Timer();
    t.printLog = true;
    t.start();
    arr.find(num => num == arr.length - 1);
    t.stop();
  }

  testFindIndex(arr: any[]) {
    let t = new Timer();
    t.printLog = true;
    t.start();
    arr.findIndex(num => num == arr.length - 1);
    t.stop();
  }
  
  testFilter(arr: any[]) {
    let t = new Timer();
    t.printLog = true;
    t.start()
    arr.filter(num => num == arr.length - 1);
    t.stop();
  }
  
  testLoop(arr: any[]) {
    let t = new Timer();
    t.printLog = true;
    t.start();
    for(let i: number = 0; i < arr.length; i ++) {
      if(i == arr.length - 1) {
        break;
      }
    }
    t.stop();
  }


  // ------------------------------ Timer methods ----------------------------------

  startTimer() {
    this.timer.start();
    this.setInnerHTML("timerStatus", "timer started <br>", true);
    this.timerHandler = setInterval(() => { this.setInnerHTML("timerDisplay", "" + this.timer.getElapsedTime(), true) }, 10);
  }
  
  lapTimer() {
    this.timer.lap();
    if(this.timer.isStarted())
      this.setInnerHTML("timerStatus", "lap " + this.timer.getLap() + ": " + this.timer.getElapsedTime() + " ms elapsed <br>");
  }

  stopTimer() {
    this.setInnerHTML("timerStatus", "timer stopped. " + this.timer.getElapsedTime() + " ms elapsed <br>");
    this.setInnerHTML("timerDisplay", "", true);
    clearInterval(this.timerHandler);
    this.timer.stop();
  }

  resetTimer() {
    if(this.timer.isStarted())
      this.stopTimer();
    if(this.timer.printLog)
    console.clear();
    this.setInnerHTML("timerStatus", "", true);
    this.setInnerHTML("timerDisplay", "", true);
  }
  
  setInnerHTML(elementId: string, content: string, clear?: boolean) {
    if(clear)
      window.document.getElementById(elementId).innerHTML = content;
    else
      window.document.getElementById(elementId).innerHTML += content;
  }

  // ---------------------------------- Clock methods ------------------------------------
  startClock(): void {
    if(!this.clockStarted) {
      this.clockStarted = true;
      this.clockHandler = setInterval(() => {
        this.timeStamp = this.globalService.getTimeStamp();
      }, 9);
    }
    else
      console.log("clock already started");
  }

  stopClock() {
    if(this.clockStarted) {
      this.clockStarted = false;
      clearInterval(this.clockHandler);
    }
    else
      console.log("clock not started");
  }

  toggleClock() {
    if(!this.clockStarted)
      this.startClock();
    else
      this.stopClock();
  }


}
