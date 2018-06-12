import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  user: User;

  constructor(private authService: AuthService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => this.user = user);
  }

}
