import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPagoSedeComponent } from './dialog-pago-sede.component';

describe('DialogPagoSedeComponent', () => {
  let component: DialogPagoSedeComponent;
  let fixture: ComponentFixture<DialogPagoSedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPagoSedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPagoSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
