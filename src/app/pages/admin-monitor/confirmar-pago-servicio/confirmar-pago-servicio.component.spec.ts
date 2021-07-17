import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarPagoServicioComponent } from './confirmar-pago-servicio.component';

describe('ConfirmarPagoServicioComponent', () => {
  let component: ConfirmarPagoServicioComponent;
  let fixture: ComponentFixture<ConfirmarPagoServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarPagoServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarPagoServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
