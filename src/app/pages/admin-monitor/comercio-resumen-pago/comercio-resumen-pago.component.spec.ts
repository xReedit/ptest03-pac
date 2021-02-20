import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioResumenPagoComponent } from './comercio-resumen-pago.component';

describe('ComercioResumenPagoComponent', () => {
  let component: ComercioResumenPagoComponent;
  let fixture: ComponentFixture<ComercioResumenPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioResumenPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioResumenPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
