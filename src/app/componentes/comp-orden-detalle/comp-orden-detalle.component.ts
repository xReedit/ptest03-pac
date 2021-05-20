import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PedidoComercioService } from 'src/app/shared/services/pedido-comercio.service';
import { PedidoModel } from 'src/app/modelos/pedido.model';
import { ComercioService } from 'src/app/shared/services/comercio.service';
import { ListenStatusService } from 'src/app/shared/services/listen-status.service';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-comp-orden-detalle',
  templateUrl: './comp-orden-detalle.component.html',
  styleUrls: ['./comp-orden-detalle.component.css']
})
export class CompOrdenDetalleComponent implements OnInit {

  @Input() orden: any;
  @Input() isfromComercioPago: boolean; // si vine de comercios resumen pago /comercio-pago // muestra la opcion de anular
  @Output() closeWindow = new EventEmitter<boolean>(false); // manda cerrar el dialog

  isTieneRepartidor = false;
  isRepartidoresPropios = false;
  btnActionTitule = 'Aceptar Pedido';
  loaderEstado = false;
  loaderFacturacion = false;

  showFacturar = false; // cambia cunado da click en facturar
  isShowControlFacturador = false;

  isRepartidorPaga = true; // si el repartidor va a pagar o ya el pedido esta pagado
  nomRepartidor = null;
  descripcionComoPagaRepartidor = '';
  descripcionComoClienteRecoge = ''; // si el cliente recoge
  descripcionDetalleFacturacion = '';
  _tabIndex = 0; // 0 todo el pedido 1 facturacion 2 registro de pago

  // si tiene habilitado facturacion
  isFacturacionActivo = false;
  isComercioPropioRepartidor = false;
  isOrdenViewFromTarjeta = false; // si procede de pago tarjeta
  isShowBtnConfirmarAnulacion = false;
  isCheckInfoPedidoAnulado = false;
  isPedidoAnualdo = false;

  listRepartidoresPropios: any;
  repartidorSelected;

  showListRepartidores = false;
  orde_codigo_postal = '';
  label_comp_repartidor = 'Asignar Manual A:';
  repartidor_selected_manual: any = null;
  chekAsignacionManual = false;

  constructor(
    // private pedidoComercioService: PedidoComercioService,
    private comercioService: ComercioService,
    private crudService: CrudHttpService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {

    console.log('orden detalle', this.orden);
    // this.getEstadoPedido();
    // this.isTieneRepartidor = this.orden.repartidor ? true : false;

    // si es diferente de tarjeta entonces el repartidor si paga
    // this.comercioService.getSedeInfo();
    this.isRepartidorPaga = this.orden.json_datos_delivery.p_header.arrDatosDelivery.metodoPago.idtipo_pago !== 2;
    this.descripcionComoPagaRepartidor = this.isRepartidorPaga ? 'El Repartidor tiene que pagar el pedido' : 'Pedido pagado. Repartidor NO paga.';
    this.descripcionComoClienteRecoge = this.isRepartidorPaga ? `Y paga el pedido con: ${this.orden.json_datos_delivery.p_header.arrDatosDelivery.metodoPago.descripcion}.` : 'Pedido pagado. Cliente NO paga.';
    this.descripcionDetalleFacturacion = this.orden.json_datos_delivery.p_header.arrDatosDelivery.tipoComprobante.dni ? this.orden.json_datos_delivery.p_header.arrDatosDelivery.tipoComprobante.dni : 'Publico en general';
    this.descripcionDetalleFacturacion = this.descripcionDetalleFacturacion + ' ' + (this.orden.json_datos_delivery.p_header.arrDatosDelivery.tipoComprobante?.otro_dato || '');

    // this.isFacturacionActivo = this.comercioService.sedeInfo.facturacion_e_activo === 1;

    this.nomRepartidor = this.orden.idrepartidor ? this.orden.nom_repartidor : null;
    this.repartidorSelected = this.orden.idrepartidor;

    this.orden.isClientePasaRecoger = this.orden.json_datos_delivery.p_header.arrDatosDelivery.pasoRecoger;
    this.showListRepartidores = this.nomRepartidor ? false : true;
    this.orde_codigo_postal = this.orden.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.codigo_postal;

    this.isOrdenViewFromTarjeta = !!this.orden.pp_arr || this.isfromComercioPago;
    this.isPedidoAnualdo = this.orden.pwa_delivery_atendido === 1;
    // this.isComercioPropioRepartidor = this.comercioService.sedeInfo.pwa_delivery_servicio_propio === 1;

    // si tiene repartidores propios
    // if ( this.isComercioPropioRepartidor ) {
    //   this.getRepartidoresComercio();
    // }
    // this.xCargarDatosAEstructuraImpresion(this.orden.json_datos_delivery.p_body);

  }

  private getRepartidoresComercio(): void {
    this.comercioService.loadRepartidoresComercio()
      .subscribe(res => {
        this.listRepartidoresPropios = res;
      });
  }

  // private getEstadoPedido(): void {
  //   const getEstado = this.pedidoComercioService.getEstadoPedido(this.orden.pwa_estado);
  //   // this.btnActionTitule = getEstado.btnTitulo;
  //   this.btnActionTitule = getEstado.btnTitulo === 'Entregar al repartidor' && this.orden.isClientePasaRecoger ? 'Entregar al cliente' : getEstado.btnTitulo;
  //   this.orden.pwa_estado = getEstado.estado;
  //   this.orden.estadoTitle = getEstado.estadoTitle;
  // }

  // setEstadoOrden(): void {
  //   this.loaderEstado = true;
  //   const getEstado = this.pedidoComercioService.setEstadoPedido(this.orden.idpedido, this.orden.pwa_estado);
  //   this.btnActionTitule = getEstado.btnTitulo === 'Entregar al repartidor' && this.orden.isClientePasaRecoger ? 'Entregar al cliente' : getEstado.btnTitulo;
  //   this.orden.pwa_estado = getEstado.estado;
  //   this.orden.estadoTitle = getEstado.estadoTitle;

  //   setTimeout(() => {
  //     this.loaderEstado = false;
  //     this.goFinalizarPedido();
  //   }, 1000);
  // }

  // cuando esta en "entregar al repartidor"
  // pasa de frente a registrar pago del repartidor
  // si quiere facturar siempre va estar activo el boton facturar
  private goFinalizarPedido() {
    switch (this.orden.pwa_estado) {
      case 'R':
        // si no tiene repartidores propios
        // y si no recoge el cliente
        if ( !this.isComercioPropioRepartidor || this.orden.isClientePasaRecoger) {
          this._tabIndex = 2; // a registrar PAGO
        }
        break;
      case 'A':
        this.closeWindow.emit(true); // manda cerrar dialog
        break;
      case 'D':
        this.orden.quitar = true;
        this.closeWindow.emit(true); // manda cerrar dialog
        break;
    }
  }

  onChangeFacturador($event) {
    this.isShowControlFacturador = $event;
    this._tabIndex = this.isShowControlFacturador ? 1 : 0;
    this.showFacturar = false;
  }

  goFacturar() {
    this.showFacturar = true;
    this.loaderFacturacion = true;
    setTimeout(() => {
      this.loaderFacturacion = false;
    }, 1500);
  }


  // saveRepartidor($event): void {
  //   const indexR = $event.value;
  //   const _repartidor = this.listRepartidoresPropios.filter(r => r.idrepartidor === indexR)[0];
  //   this.orden.idrepartidor = _repartidor.idrepartidor;
  //   this.orden.nom_repartidor = _repartidor.nombre;
  //   this.orden.ap_repartidor = _repartidor.apellido;
  //   this.orden.telefono_repartidor = _repartidor.telefono;

  //   this.listenService.setPedidoModificado(this.orden);
  //   this.pedidoComercioService.setRepartidorToPedido(indexR, this.orden);

  // }

  asignarManualA($event) {
    console.log('repartidor select', $event);
    this.repartidor_selected_manual = $event;
  }

  confirmarAsignacionManual() {
    this.chekAsignacionManual = true;
    let pedidos_repartidor = this.repartidor_selected_manual.pedido_por_aceptar;

    const _importePedido = parseFloat(this.orden.total_r);
    if ( pedidos_repartidor ) {
      pedidos_repartidor.pedidos.push(this.orden.idpedido);
      pedidos_repartidor.importe_acumula = parseFloat( pedidos_repartidor.importe_acumula ) + _importePedido;
      pedidos_repartidor.importe_pagar = parseFloat( pedidos_repartidor.importe_pagar ) + _importePedido;
      pedidos_repartidor.pedido_asignado_manual = this.orden.idpedido; // para reset a los demas repartidores
      pedidos_repartidor.idrepartidor = this.repartidor_selected_manual.idrepartidor;
      pedidos_repartidor.isexpress = 0;
    } else {
      const _listPedido = [];
      _listPedido.push(this.orden.idpedido);

      pedidos_repartidor = {
        pedidos: _listPedido,
        importe_acumula: _importePedido.toFixed(2),
        importe_pagar: _importePedido.toFixed(2),
        idsede: this.orden.idsede,
        idrepartidor: this.repartidor_selected_manual.idrepartidor,
        pedido_asignado_manual: this.orden.idpedido,
        isexpress: 0,
        sede_coordenadas: {
          latitude: this.orden.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.latitude,
          longitude: this.orden.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.longitude
        }
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

  redirectWhatsApp() {
    const _link = `https://api.whatsapp.com/send?phone=51${this.orden.json_datos_delivery.p_header.arrDatosDelivery.telefono}`;
    window.open(_link, '_blank');
  }

  callPhone() {
    window.open(`tel:${this.orden.json_datos_delivery.p_header.arrDatosDelivery.telefono}`);
  }

  cerrarDetalles(val: boolean) {
    if ( val ) {
      this.closeWindow.emit(val);
    }
  }

  cambiarReparidorAsignado() {
    this.showListRepartidores = true;
  }

  pedidoNoFueAntendido() {
    this.orden.pwa_delivery_atendido = 1;

    if ( !this.isfromComercioPago ) {
      this.orden.pp_arr.total = 0;
    } else {
      this.orden.pp_subtotal = 0;
      this.orden.pp_comision = 0;
    }

    const _dataSend = {
      idpedido: this.orden.idpedido
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-pedido-no-atendido', true)
    .subscribe(res => {
      console.log('pedido no antendido', res);
      this.isCheckInfoPedidoAnulado = true;
    });
  }

}
