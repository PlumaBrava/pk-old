import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicituEmpresaComponent } from './solicitu-empresa.component';

describe('SolicituEmpresaComponent', () => {
  let component: SolicituEmpresaComponent;
  let fixture: ComponentFixture<SolicituEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicituEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicituEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
