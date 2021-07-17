import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogPagoSedeComponent } from 'src/app/componentes/dialog-pago-sede/dialog-pago-sede.component';
import { DialogInfoSedeComponent } from 'src/app/componentes/dialog-info-sede/dialog-info-sede.component';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-comercios',
  templateUrl: './comercios.component.html',
  styleUrls: ['./comercios.component.css']
})
export class ComerciosComponent implements OnInit {

  dataComercios = new MatTableDataSource<any>();
  dataComerciosMaster = [];
  dataResumenComercios = {};
  displayedColumnsPedidos: string[] = ['num', 'comercio', 'abierto', 'p_express', 'facturacion', 'propio_delivery', 'solo_app', 'ultimo_pedido'
  , 'fijo_restobar', 'importe_pagar', 'neto_pagar', 'f_last_pago', 'op' ];

  loaderCalc = false;

  constructor(
    private crudService: CrudHttpService,
    private dialog: MatDialog,
    private router: Router,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
  }

  loadComercios() {
    this.crudService.getAll('monitor', 'get-comercios-resumen', false, false, true)
    .subscribe((res: any) => {
      console.log(res);

      this.dataComerciosMaster = res.data;
      this.dataComercios.data = this.dataComerciosMaster;

      this.dtResumenComercios();
    });
  }

  private dtResumenComercios() {
    const coAbiertos = this.dataComercios.data.filter(x => x.pwa_delivery_comercio_online === 1).length;
    const coTotal =  this.dataComercios.data.length;
    const coCerrados =  coTotal - coAbiertos;

    this.dataResumenComercios = {
      'total': coTotal,
      'cerrados': coCerrados,
      'abiertos': coAbiertos
    };

    console.log('this.dataResumenComercios', this.dataResumenComercios);
  }

  calcularImportePagar(item: any) {
    localStorage.setItem('sys::s', JSON.stringify(item));
    this.router.navigate(['./comercio/comercio-pago']);

    // item.loaderCalc = true;
    // const _sendData = {
    //   idsede: item.idsede
    // };

    // this.crudService.postFree(_sendData, 'monitor', 'get-comercio-calcular-pago', true)
    //   .subscribe((res: any) => {
    //     const _data = res.data[0];
    //     item.data_calc = {
    //       'pedidos': _data.objPedidos,
    //       'obj_pedidos_last_fpago': _data.obj_pedidos_delivery_total_app_last_fpago
    //     };

    //     const _importeTotalApp = parseFloat(item.data_calc.obj_pedidos_last_fpago[0].importe);
    //     const _calcComision = _importeTotalApp * ( item.comsion_entrega / 100 );
    //     item.data_calc.obj_pedidos_last_fpago[0].comision = _calcComision;
    //     item.neto_pagar = _calcComision + parseFloat(item.costo_restobar_fijo_mensual);

    //     item.ultimo_pedido = _data.ultimo_pedido;

    //     item.loaderCalc = false;

    //     console.log(item.data_calc);
    //   });
  }

  calComision(item: any) {
    const comision = item.comsion_entrega / 100;
    const r = item.importe_app_pediente * comision;
    const _netoPagar = r + parseFloat(item.costo_restobar_fijo_mensual);

    item.neto_pagar = parseFloat(_netoPagar.toString()).toFixed(2);
    return parseFloat(r.toString()).toFixed(2);
  }

  registrarPago(element: any) {
    const _dialogConfig = new MatDialogConfig();

    this.dataComercios.data.map(x => x.checked = false);
    element.checked = true;
    // marcador para que no cierrre como repartidor propio en orden detalle.

    _dialogConfig.disableClose = false;
    _dialogConfig.hasBackdrop = true;
    _dialogConfig.width = '600px';
    _dialogConfig.panelClass = ['my-dialog-orden-detalle', 'my-dialog-scrool'];
    _dialogConfig.data = {
      dataSede: element
    };

    // console.log('orden openDialogOrden', orden);
    // this.pedidoRepartidorService.setPedidoSelect(orden);
    const dialogRef = this.dialog.open(DialogPagoSedeComponent, _dialogConfig);
  }

  sdeInfoDialog(element: any) {
    const _dialogConfig = new MatDialogConfig();

    this.dataComercios.data.map(x => x.checked = false);
    element.checked = true;
    // marcador para que no cierrre como repartidor propio en orden detalle.

    _dialogConfig.disableClose = false;
    _dialogConfig.hasBackdrop = true;
    _dialogConfig.data = {
      dataSede: element
    };

    // console.log('orden openDialogOrden', orden);
    // this.pedidoRepartidorService.setPedidoSelect(orden);
    const dialogRef = this.dialog.open(DialogInfoSedeComponent, _dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if ( data ) {
        element.costo_restobar_fijo_mensual = data.restobar;
        element.comsion_entrega = data.comision;
      }
    });

  }


  // cerrar abrir comercio
  onOffComercio(obj: any) {
    const _cerrar = obj.pwa_delivery_comercio_online === 0 ? 1 : 0;
    const _dataSend = {
      idsede: obj.idsede,
      estado: _cerrar
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-oncombercio', true)
    .subscribe(res => {
      console.log(res);
      obj.pwa_delivery_comercio_online = _cerrar;
      this.dtResumenComercios();
      // this.socketService.emit('set-cerrar-comercio-from-pacman', _dataSend);
    });
  }

  filterComercioCerrado(cerrado: number) {
    // todos
    if ( cerrado === 2 ) {
      this.dataComercios.data = this.dataComerciosMaster;
      return;
    }

    this.dataComercios.data = this.dataComerciosMaster.filter(x => x.pwa_delivery_comercio_online === cerrado);
  }

  searchComercio(value: string) {
    this.dataComercios.data = this.dataComerciosMaster.filter(x => (x.nombre + ' ' +  x.ciudad).toLowerCase().indexOf(value.toLowerCase()) > -1 );
  }

  goPagoServicioConfirmar() {
    this.router.navigate(['./comercio/comercios-cofirmar-pago-servicio']);
  }

}
