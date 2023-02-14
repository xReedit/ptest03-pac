import { Injectable } from '@angular/core';
import { CrudHttpService } from './crud-http.service';

@Injectable({
  providedIn: 'root'
})
export class RepartidorVistaPedidoService {

  constructor(
    private crudService: CrudHttpService
  ) { }

  async updateShowTimeLinePedidoAllRepartidores(repartidores:any) {
    const _repartidoresConectados = repartidores.filter(x => x.ocupado === 1 && x.pedido_por_aceptar)

    _repartidoresConectados.map(r => {        
      const _arrPedidos = this.removeDuplicates(r.pedido_por_aceptar.pedidos)   
      r.show_pedidos_aceptados = r.show_pedidos_aceptados ? r.show_pedidos_aceptados : []      

    })

    
    for (const r of _repartidoresConectados) {
      const _arrPedidos = this.removeDuplicates(r.pedido_por_aceptar.pedidos)   
      const _pedidos = await this.getPedidosAsignados(_arrPedidos)
      r.show_pedidos_aceptados = _pedidos.data;
      console.log('_pedidos', _pedidos);
    }  
    
    console.log('repartidores', repartidores);
    
  }

  private removeDuplicates(array) {
    return Array.from(new Set(array));
  }

  private async getPedidosAsignados(arrPedidos) {
        

      const _dataSend = {
        arr: arrPedidos.join(',')
      }

      return await this.crudService.postFree(_dataSend, 'monitor', 'get-show-pedidos-asignados-repartidor',true).toPromise()
          
  }

  async updateShowTimeLinePedidoByRepartidor(repartidor: any, idpedido: number, time_line: any = null, isEntregado = false) {        
      const _pedidoTimeLine = repartidor.show_pedidos_aceptados.find(x => x.idpedido === idpedido);    
      _pedidoTimeLine.pwa_estado = isEntregado ? 'E' : _pedidoTimeLine.pwa_estado;
      _pedidoTimeLine.time_line = time_line ? time_line : _pedidoTimeLine.time_line    
  }

  async updateShowTimeLinePedidoByRepartidorAsignacionManual(repartidor: any, pedidos: any, time_line: any = null, isEntregado = false) {    
      const _pedidos = await this.getPedidosAsignados(pedidos)
      repartidor.show_pedidos_aceptados = _pedidos.data;
      repartidor.ocupado = 1;      
}

  cleanTimeLinePedido(repartidor: any) {
    repartidor.show_pedidos_aceptados = [];
  }
}
