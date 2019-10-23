import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMailComponent } from './log-mail.component';

describe('LogMailComponent', () => {
  let component: LogMailComponent;
  let fixture: ComponentFixture<LogMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
