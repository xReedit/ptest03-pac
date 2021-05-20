import { Component, OnInit } from '@angular/core';
import { UtilitariosService } from 'src/app/shared/services/utilitarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import * as html2pdf from 'html2pdf.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSelectSedeComponent } from 'src/app/componentes/dialog-select-sede/dialog-select-sede.component';
import { DialogPagoSedeComponent } from 'src/app/componentes/dialog-pago-sede/dialog-pago-sede.component';
import { DialogInfoSedeComponent } from 'src/app/componentes/dialog-info-sede/dialog-info-sede.component';
import { DialogOrdenDetalleComponent } from 'src/app/componentes/dialog-orden-detalle/dialog-orden-detalle.component';

@Component({
  selector: 'app-comercio-resumen-pago',
  templateUrl: './comercio-resumen-pago.component.html',
  styleUrls: ['./comercio-resumen-pago.component.css']
})
export class ComercioResumenPagoComponent implements OnInit {

  sedeInfo: any;
  displayedColumnsPedidosAbona: string[] = ['num_pedido', 'cliente', 'reparto', 'subtotal', 'c_papaya'];

  dataPedidosAbona = new MatTableDataSource<any>();
  listAbona = null;
  sumTotalAbona = 0;
  countPedidosAbonar = 0;
  countPedidosApp = 0;
  isPedidoLlevoPapaya = true;

  opView = 0;

   // datapicker
   range: any = {fromDate: new Date(), toDate: new Date()};
   rangoFecha: any = {};

   constructor(
     private utilesService: UtilitariosService,
     private crudService: CrudHttpService,
     private dialog: MatDialog,
   ) { }

  ngOnInit(): void {
    this.sedeInfo = JSON.parse(localStorage.getItem('sys::s'));
  }

  private infoCountsSede() {
    const item = this.sedeInfo;

    // const _sendData = {
    //   idsede: item.idsede
    // };

    this.crudService.postFree(this.rangoFecha, 'monitor', 'get-comercio-calcular-pago', true)
      .subscribe((res: any) => {
        const _data = res.data[0];
        item.data_calc = {
          'pedidos': _data.objPedidos,
          'obj_pedidos_last_fpago': _data.obj_pedidos_delivery_total_app_last_fpago
        };

        const _importeTotalApp = parseFloat(item.data_calc.obj_pedidos_last_fpago[0].importe);
        const _calcComision = _importeTotalApp * ( item.comsion_entrega / 100 );
        item.data_calc.obj_pedidos_last_fpago[0].comision = _calcComision;
        item.neto_pagar = _calcComision + parseFloat(item.costo_restobar_fijo_mensual);

        item.ultimo_pedido = _data.ultimo_pedido;

        item.loaderCalc = false;

        console.log('infoCountsSede', item.data_calc);
      });
  }

  dateRangeAbonoSelected(range: any) {
    this.rangoFecha = range;

    console.log(this.range);
    this.rangoFecha.desde = this.utilesService.getDateString(range.fromDate);
    this.rangoFecha.hasta = this.utilesService.getDateString(range.toDate);

    this.loadPedidosAbonos();
  }

  loadPedidosAbonos() {
    this.rangoFecha.idsede = this.sedeInfo.idsede;
    this.crudService.postFree(this.rangoFecha, 'monitor', 'get-comercio-all-pedidos-cobrar', true)
    .subscribe((res: any) => {
      console.log(res);
      res.data.map(p => {p.json_datos_delivery = JSON.parse(p.json_datos_delivery); });

      this.listAbona = res.data;
      console.log('this.listAbona', this.listAbona);
      this.calcularPago();
      this.infoCountsSede();
    });
  }

  calcularPago() {
    this.sumTotalAbona = 0;
    this.countPedidosAbonar = 0;

    let importePropina: any;
    let importeEntrega: any;
    let importeTotal = 0;
    let _sutotales: any;
    let cobraComision = false;

    const comision_entrega = this.sedeInfo.comsion_entrega / 100;

    this.listAbona.map(p => {
      cobraComision = false;
      this.countPedidosAbonar ++;
        this.sumTotalAbona +=  parseFloat(p.total_r);
        p.visible = true;

        // totales
        // sub total
        _sutotales = p.json_datos_delivery.p_subtotales;
        importePropina = _sutotales.filter(s => s.id === -3)[0];
        importePropina = importePropina ? parseFloat(importePropina.importe) : 0;

        importeEntrega = _sutotales.filter(s => s.id === -2)[0];
        importeEntrega = importeEntrega ? parseFloat(importeEntrega.importe) : p.json_datos_delivery.p_header.arrDatosDelivery.costoTotalDelivery;

        importeTotal = parseFloat(_sutotales[_sutotales.length - 1]. importe);

        // this.isPedidoLlevoPapaya = p.pwa_delivery_servicio_propio === 0;


        if ( this.sedeInfo.pwa_delivery_servicio_propio === 0 ||  p.flag_solicita_repartidor_papaya === 1 ) {
          p.pp_propina = importePropina;
          p.pp_entrega = importeEntrega;
          cobraComision = true;
        } else {
          this.isPedidoLlevoPapaya = false;
          // si es solo pedido app
          if ( this.sedeInfo.pwa_delivery_reparto_solo_app === 1 && p.json_datos_delivery.p_header.arrDatosDelivery.isCliente > 0 ) {
              p.pp_propina = importePropina;
              p.pp_entrega = importeEntrega;
              this.isPedidoLlevoPapaya = true;
              cobraComision = true;
          } else {
            p.pp_propina = 0;
            p.pp_entrega = 0;
            importePropina = 0;
            importeEntrega = 0;
          }
        }

        p.pp_repartidor = importePropina + importeEntrega;
        p.pp_subtotal = p.pwa_delivery_atendido === 1 ? 0 : importeTotal - p.pp_repartidor;
        p.pp_comision = 0;
        p.pp_pagar = 0;
        // this.isPedidoLlevoPapaya = false;

        this.countPedidosApp += p.json_datos_delivery.p_header.isCliente === 1 ? 1 : 0;

        if ( cobraComision || p.json_datos_delivery.p_header.isCliente === 1) {
          p.pp_comision = p.pp_subtotal === 0 ? 0 : p.pp_subtotal * comision_entrega;
          p.pp_pagar = p.pp_subtotal - p.pp_comision;
        }

        p.isPedidoLlevoPapaya = this.isPedidoLlevoPapaya;
    });

    this.dataPedidosAbona.data = this.listAbona;

    console.log('this.dataPedidosAbona.data', this.dataPedidosAbona.data);
  }

  getTotal() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.pp_subtotal)).reduce((acc, value) => acc + value, 0);
  }

  getTotalComision() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.pp_comision)).reduce((acc, value) => acc + value, 0);
  }

  exportPdf() {
    const name_file = `resumen-pago-${this.sedeInfo.nombre}-${this.sedeInfo.ciudad}.pdf`;
    const opt = {
      margin:       1,
      filename:     name_file,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    const element = document.getElementById('element-to-print');
    html2pdf().set(opt).from(element).save();
  }

  buscarSede() {
    const _dialogConfig = new MatDialogConfig();

    _dialogConfig.disableClose = false;
    _dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(DialogSelectSedeComponent, _dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if ( data ) {
        this.sedeInfo = data;
        this.loadPedidosAbonos();
        // element.costo_restobar_fijo_mensual = data.restobar;
        // element.comsion_entrega = data.comision;
      }
    });
  }

  registrarPago() {

    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = false;
    _dialogConfig.hasBackdrop = true;
    _dialogConfig.width = '600px';
    _dialogConfig.panelClass = ['my-dialog-orden-detalle', 'my-dialog-scrool'];
    _dialogConfig.data = {
      dataSede: this.sedeInfo
    };

    // console.log('orden openDialogOrden', orden);
    // this.pedidoRepartidorService.setPedidoSelect(orden);
    const dialogRef = this.dialog.open(DialogPagoSedeComponent, _dialogConfig);

  }

  sdeInfoDialog() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = false;
    _dialogConfig.hasBackdrop = true;
    _dialogConfig.data = {
      dataSede: this.sedeInfo
    };

    const dialogRef = this.dialog.open(DialogInfoSedeComponent, _dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if ( data ) {
        this.sedeInfo.costo_restobar_fijo_mensual = data.restobar;
        this.sedeInfo.comsion_entrega = data.comision;
      }
    });
  }

  sedeDescuentos() {

  }

  viewListPedidos() {
    this.opView = 0;
  }

  viewListDescuentos() {
    this.opView = 1;
  }

  verPedido(orden: any) {
    console.log('orden', orden);
    const _dialogConfig = new MatDialogConfig();

    // marcador para que no cierrre como repartidor propio en orden detalle.
    orden.isRepartidorRed = true;

    _dialogConfig.disableClose = true;
    _dialogConfig.hasBackdrop = true;
    _dialogConfig.width = '700px';
    _dialogConfig.panelClass = ['my-dialog-orden-detalle', 'my-dialog-scrool'];
    _dialogConfig.data = {
      laOrden: orden,
      fromComercioPago: true
    };

    // console.log('orden openDialogOrden', orden);
    // this.pedidoRepartidorService.setPedidoSelect(orden);
    const dialogRef = this.dialog.open(DialogOrdenDetalleComponent, _dialogConfig);
  }


}
