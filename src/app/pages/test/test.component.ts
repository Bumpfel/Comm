import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { GlobalService, Timer } from '../../services/global.service';
import { e } from '@angular/core/src/render3';
import { eventNames } from 'cluster';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  user: User;

  timer: Timer = new Timer();
  timerHandler: NodeJS.Timer;

  timeStamp;
  clockHandler: NodeJS.Timer;
  clockStarted: boolean;

  slides: string[] = ["https://tv-tabla.se/assets/img/channels/original/svt1-svt-se.png",
    "https://tv-tabla.se/assets/img/channels/original/svt2-svt-se.png",
    "https://tv-tabla.se/assets/img/channels/original/tv3-se.png",
    "http://www.tv4.se/assets/channel-logo-tv4-huge.png"];
  // slides: Map<number, string> = new Map([
  //   [1, "http://www.stickpng.com/assets/images/58c5805709e8bc1b42c77941.png"],
  //   [2, "http://www.myhinduethics.com/wp-content/uploads/2013/12/Number-Two.jpg"],
  //   [3, "http://thinkers50.com/wp-content/uploads/istock_000012340050xsmall.jpg"],
  //   [4, "https://static8.depositphotos.com/1338574/829/i/450/depositphotos_8293024-stockafbeelding-de-nummer-4-in-goud.jpg"]
  // ]);

  carouselDisplay: number = 0;
  carouselHandler: NodeJS.Timer;
  slideClass: string = "slide-in-right";
  spinBlocked: boolean;
  spinTime: number = 3000;

  testPopup: boolean;
  popupTop: number;
  popupLeft: number;

  constructor(private authService: AuthService,
    private messageService: MessageService,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => this.user = user);

    this.timer.printLog = false;

    this.carouselAutoSpin();

    window.onkeydown = (event) => {
      if (event.keyCode == 27)
        this.closePopups();
    }

  }
  
  // ----------------------------- Drag & drop --------------------------------

  private draggedBox: HTMLElement
  private originalContainer: HTMLElement

  startDrag(event) {
    this.draggedBox = event.target
    this.originalContainer = event.target.parentElement
  }

  previewDrop(event) {
    if(event.target.classList.contains('dropContainer')) {
      var dropTarget = event.target
    } else {
      dropTarget = event.target.parentElement
    }

    if(this.draggedBox.parentElement != dropTarget) {
      dropTarget.appendChild(this.draggedBox)
      this.draggedBox.classList.add('dropPreview')
      
      console.log('previewing drop')
    }
  }

  stopDropPreview(event) {
    if(event.target.classList.contains('dropContainer')) {
      this.originalContainer.appendChild(this.draggedBox)
      this.draggedBox.classList.remove('dropPreview')

      console.log('stopping preview')
    }
  }
  
  drop(event) {
    this.draggedBox.classList.remove('dropPreview')
    console.log('dropping')
  }

    
  // -------------------------------- Popup -----------------------------------
  showTestPopup(parentElement: HTMLElement) {
    this.testPopup = true;
    this.globalService.setFocus('testField')
    this.popupTop = parentElement.offsetTop - 15;
    this.popupLeft = parentElement.offsetLeft + 100;
    // this.setPopupPos(parentElement, "testPopup", -15, 100)
  }
  
  setPopupPos(parentElement: HTMLElement, popupId: string, topAdjustment: number, leftAdjustment: number) {
    setTimeout(() => {
      let popup: HTMLElement = document.getElementById(popupId);
      popup.style.top = (parentElement.offsetTop + topAdjustment) + "px";
      popup.style.left = (parentElement.offsetLeft + leftAdjustment) + "px";
    },0);
  }

  closePopups() {
    this.testPopup = undefined;
    this.popupTop = undefined;
    this.popupLeft = undefined;
    // this.activeElement = undefined;
  }


  // ------------------------------- Carousel -----------------------------------
  getSlideIndex(slide: string) {
    return this.slides.findIndex(data => data == slide);
  }

  carouselAutoSpin() {

    clearTimeout(this.carouselHandler);
    this.carouselHandler = setTimeout(() => { this.carouselNext(); this.carouselAutoSpin() }, 5000);
  }

  carouselPrev() {
    this.carouselSlide(this.carouselDisplay - 1);
  }
  carouselNext() {
    this.carouselSlide(this.carouselDisplay + 1);
  }

  private carouselSlide(slideNr: number) {
    if (!this.spinBlocked) {
      let slideInClass: string;
      this.carouselAutoSpin();
      if (slideNr > this.carouselDisplay) {
        slideNr == this.slides.length ? slideNr = 0 : '';
        this.slideClass = "slide-out-left";
        slideInClass = "slide-in-right";
      }
      else {
        slideNr < 0 ? slideNr = this.slides.length - 1 : '';
        this.slideClass = "slide-out-right";
        slideInClass = "slide-in-left";
      }
      this.spinBlocked = true;
      setTimeout(() => {
        this.slideClass = slideInClass;
        this.carouselDisplay = slideNr;
        setTimeout(() => this.spinBlocked = false, 250);
      }, 500);
    }
  }


  // ------------------------------- Efficiency Tests ---------------------------------
  testArray(size: number) {
    let arr: any[] = [];

    for (let i: number = 0; i < size; i++) {
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
    for (let i: number = 0; i < arr.length; i++) {
      if (i == arr.length - 1) {
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
    if (this.timer.isStarted())
      this.setInnerHTML("timerStatus", "lap " + this.timer.getLap() + ": " + this.timer.getElapsedTime() + " ms elapsed <br>");
  }

  stopTimer() {
    this.setInnerHTML("timerStatus", "timer stopped. " + this.timer.getElapsedTime() + " ms elapsed <br>");
    this.setInnerHTML("timerDisplay", "", true);
    clearInterval(this.timerHandler);
    this.timer.stop();
  }

  resetTimer() {
    if (this.timer.isStarted())
      this.stopTimer();
    if (this.timer.printLog)
      console.clear();
    this.setInnerHTML("timerStatus", "", true);
    this.setInnerHTML("timerDisplay", "", true);
  }

  setInnerHTML(elementId: string, content: string, clear?: boolean) {
    if (clear)
      window.document.getElementById(elementId).innerHTML = content;
    else
      window.document.getElementById(elementId).innerHTML += content;
  }

  // ---------------------------------- Clock methods ------------------------------------
  startClock(): void {
    if (!this.clockStarted) {
      this.clockStarted = true;
      this.clockHandler = setInterval(() => {
        this.timeStamp = this.globalService.getTimeStamp();
      }, 9);
    }
    else
      console.log("clock already started");
  }

  stopClock() {
    if (this.clockStarted) {
      this.clockStarted = false;
      clearInterval(this.clockHandler);
    }
    else
      console.log("clock not started");
  }

  toggleClock() {
    if (!this.clockStarted)
      this.startClock();
    else
      this.stopClock();
  }


}
