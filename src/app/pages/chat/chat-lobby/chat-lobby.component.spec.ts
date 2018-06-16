import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLobbyComponent } from './chat-lobby.component';

describe('ChatLobbyComponent', () => {
  let component: ChatLobbyComponent;
  let fixture: ComponentFixture<ChatLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatLobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
