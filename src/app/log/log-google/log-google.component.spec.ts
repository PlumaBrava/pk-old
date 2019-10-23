import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogGoogleComponent } from './log-google.component';

describe('LogGoogleComponent', () => {
  let component: LogGoogleComponent;
  let fixture: ComponentFixture<LogGoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogGoogleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
