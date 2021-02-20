import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInfoSedeComponent } from './dialog-info-sede.component';

describe('DialogInfoSedeComponent', () => {
  let component: DialogInfoSedeComponent;
  let fixture: ComponentFixture<DialogInfoSedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogInfoSedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInfoSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
