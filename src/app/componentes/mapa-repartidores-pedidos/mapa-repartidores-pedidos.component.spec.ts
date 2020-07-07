import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaRepartidoresPedidosComponent } from './mapa-repartidores-pedidos.component';

describe('MapaRepartidoresPedidosComponent', () => {
  let component: MapaRepartidoresPedidosComponent;
  let fixture: ComponentFixture<MapaRepartidoresPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaRepartidoresPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaRepartidoresPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
