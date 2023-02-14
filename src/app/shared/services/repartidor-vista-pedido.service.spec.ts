import { TestBed } from '@angular/core/testing';

import { RepartidorVistaPedidoService } from './repartidor-vista-pedido.service';

describe('RepartidorVistaPedidoService', () => {
  let service: RepartidorVistaPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepartidorVistaPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
