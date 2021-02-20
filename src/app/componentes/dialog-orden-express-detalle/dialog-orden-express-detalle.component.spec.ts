import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrdenExpressDetalleComponent } from './dialog-orden-express-detalle.component';

describe('DialogOrdenExpressDetalleComponent', () => {
  let component: DialogOrdenExpressDetalleComponent;
  let fixture: ComponentFixture<DialogOrdenExpressDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrdenExpressDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrdenExpressDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
