import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-comp-orden-retiro-cash',
  templateUrl: './comp-orden-retiro-cash.component.html',
  styleUrls: ['./comp-orden-retiro-cash.component.css']
})
export class CompOrdenRetiroCashComponent implements OnInit {

  @Input() orden: any;
  @Output() closeWindow = new EventEmitter<boolean>(false); // manda cerrar el dialog

  nomRepartidor = null;

  listRepartidoresPropios: any;
  repartidorSelected;

  showListRepartidores = false;
  orde_codigo_postal = '';
  label_comp_repartidor = 'Asignar Manual A:';
  repartidor_selected_manual: any = null;
  chekAsignacionManual = false;

  constructor(
    private crudService: CrudHttpService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {

    this.nomRepartidor = this.orden.idrepartidor ? this.orden.nom_repartidor : null;
    this.repartidorSelected = this.orden.idrepartidor;
    this.showListRepartidores = this.nomRepartidor ? false : true;

    this.orde_codigo_postal = this.orden.json_entrega.direccion.codigo;

  }

  asignarManualA($event) {
    console.log('repartidor select', $event);
    this.repartidor_selected_manual = $event;
  }

  confirmarAsignacionManual() {
    this.chekAsignacionManual = true;
    let pedidos_repartidor = this.repartidor_selected_manual.pedido_por_aceptar;


    if ( pedidos_repartidor ) {
      pedidos_repartidor.pedidos.push(this.orden);
      pedidos_repartidor.importe = parseFloat( this.orden.importe_solicita );
      pedidos_repartidor.pedido_asignado_manual = this.orden.idadm_retiros; // para reset a los demas repartidores
      pedidos_repartidor.isretiroatm = 1;
      pedidos_repartidor.orden = this.orden;
    } else {
      const _listPedido = [];
      // const _ordenes = [];
      _listPedido.push(this.orden);


      pedidos_repartidor = {
        pedidos: _listPedido,
        importe: parseFloat( this.orden.importe_solicita ),
        idrepartidor: this.repartidor_selected_manual.idrepartidor,
        pedido_asignado_manual: this.orden.idatm_retiros,
        // orden: _listPedido,
        isretiroatm: 1
      };

    }

    const _dataSend = {
      pedido : pedidos_repartidor
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-asignar-pedido-manual', true)
    .subscribe( res => {
      // console.log(res);
      this.orden.nom_repartidor = this.repartidor_selected_manual.nombre;
      this.orden.idrepartidor = this.repartidor_selected_manual.idrepartidor;
      this.orden.telefono_repartidor = this.repartidor_selected_manual.telefono_repartidor;

      // emitir socket al rerpatidor para que recargue
      this.socketService.emit('set-asigna-pedido-repartidor-manual', pedidos_repartidor);
    });


  }

}
