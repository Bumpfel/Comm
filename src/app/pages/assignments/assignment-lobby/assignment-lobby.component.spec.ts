import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentLobbyComponent } from './assignment-lobby.component';

describe('AssignmentLobbyComponent', () => {
  let component: AssignmentLobbyComponent;
  let fixture: ComponentFixture<AssignmentLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentLobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
