import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogOrdenDetalleComponent } from 'src/app/componentes/dialog-orden-detalle/dialog-orden-detalle.component';
import { UtilitariosService } from 'src/app/shared/services/utilitarios.service';

// pdf
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, OnDestroy {
  displayedColumnsPedidos: string[] = ['num_pedido', 'comercio', 'ciudad', 'cliente', 'repartidor', 'importe', 'min_transcurridos', 'min_avisa' ];
  displayedColumnsRepartidor: string[] = ['repartidor', 'pedido_a', 'por_aceptar', 'calificacion', 'efectivo_mano', 'atendidos', 'reasignado', 'online', 'ocupado'];
  displayedColumnsCliente: string[] = ['idcliente', 'cliente', 'pwa_id', 'f_registro', 'telefono', 'calificacion'];

  displayedColumnsPedidosAbona: string[] = ['num_pedido', 'comercio', 'ciudad', 'cliente', 'repartidor', 'importe', 'c_visa', 'c_igv', 'c_transaccion', 'c_entrega', 'neto_abonar', 'action', 'action_abonado' ];


  dataPedidos = new MatTableDataSource<any>();
  dataPedidosAbonaMaster = new MatTableDataSource<any>();
  dataRepartidores = new MatTableDataSource<any>();
  dataClientes = new MatTableDataSource<any>();
  dataPedidosAbona = new MatTableDataSource<any>();
  listPedidosPendientes: any;
  listFiltroOrigin: any;
  sumTotalAbona = 0;
  countPedidosAbonar = 0;
  countPedidos = 0;
  countClientes = 0;

  dataFiltroAbonar = {
    por: 0, // 0 comercio 1 repartidor
    idcomercio: 0, // todos
    idrepartidor: 0, // todos
    estado: '-1' // -1 todos 0 por abonar 1 abonado
  };

  // listas
  listComercioPagar: any;
  listRepartidoresPagar: any;

   // datapicker
  range: any = {fromDate: new Date(), toDate: new Date()};
  rangoFecha: any = {};

  rangeAbono: any = {fromDate: new Date(), toDate: new Date()};
  rangoAbonoFecha: any = {};

  processLoop: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('paginatorRepartidor', {static: true}) paginatorRepartidor: MatPaginator;
  @ViewChild('paginatorCliente', {static: true}) paginatorCliente: MatPaginator;
  @ViewChild('paginatorAbona', {static: true}) paginatorAbona: MatPaginator;
  constructor(
    private crudService: CrudHttpService,
    private utilesService: UtilitariosService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadPedidos();
    this.loadRepartidores();
    this.loadClientes();

    this.dataPedidos.paginator = this.paginator;

    this.loopLoad();
  }


  ngOnDestroy(): void {
    this.processLoop = null;
  }

  private loopLoad() {
    this.processLoop = setInterval(() => this.loadPedidos(), 15000);
  }

  dateRangeSelected(range: any) {
    this.range = range;

    console.log(this.range);
    this.rangoFecha.desde = this.utilesService.getDateString(range.fromDate);
    this.rangoFecha.hasta = this.utilesService.getDateString(range.toDate);
  }

  dateRangeAbonoSelected(range: any) {
    this.rangeAbono = range;

    console.log(this.range);
    this.rangoAbonoFecha.desde = this.utilesService.getDateString(range.fromDate);
    this.rangoAbonoFecha.hasta = this.utilesService.getDateString(range.toDate);

    this.loadPedidosAbonos();
  }

  loadPedidos() {
    this.crudService.postFree(this.range, 'monitor', 'get-pedidos', true)
    .subscribe((res: any) => {
      console.log(res);
      this.dataPedidos.data = res.data;
      this.countPedidos = res.data.length;

      res.data.map(p => {p.json_datos_delivery = JSON.parse(p.json_datos_delivery); });

      this.dataPedidos.paginator = this.paginator;

      // this.verPedidoPagosVisa();
    });
  }

  loadPedidosAbonos() {
    this.crudService.postFree(this.rangeAbono, 'monitor', 'get-pedidos-abono', true)
    .subscribe((res: any) => {
      console.log(res);
      this.dataPedidosAbonaMaster.data = res.data;
      res.data.map(p => {p.json_datos_delivery = JSON.parse(p.json_datos_delivery); });

      this.dataPedidosAbonaMaster.paginator = this.paginatorAbona;

      this.verPedidoPagosVisa();
    });
  }

  loadRepartidores() {
    this.crudService.getAll('monitor', 'get-repartidores', false, false, true)
    .subscribe((res: any) => {
      console.log(res);
      this.dataRepartidores.data = res.data;
      this.dataRepartidores.paginator = this.paginatorRepartidor;

      this.pedidosPendietesPorAtender();
    });
  }


  loadClientes() {
    this.crudService.getAll('monitor', 'get-clientes', false, false, true)
    .subscribe((res: any) => {
      console.log(res);
      this.dataClientes.data = res.data;
      this.countClientes = res.data.length;
      this.dataClientes.paginator = this.paginatorCliente;
    });
  }


  private pedidosPendietesPorAtender() {
    this.listPedidosPendientes = [];

    this.crudService.getAll('monitor', 'get-pedidos-pendientes', false, false, true)
    .subscribe((res: any) => {
      console.log('get-pedidos-pendientes', res.data);

      // const _list = res.data[0];

      // console.log('_list', _list);

      res.data
      .map(p => {
        p.json_datos_delivery = JSON.parse(p.json_datos_delivery);
        const _row = {
          sede: p.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.nombre,
          pedido: p.idpedido,
          tiempo: p.min_transcurridos,
          solicito_repartidor: p.flag_solicita_repartidor_papaya
        };

        this.listPedidosPendientes.push(_row);
      });

    });
  }


  resetContadorRepartidor(repartidor: any) {
    console.log('repartidor', repartidor);

    const _dataSend = {
      idrepartidor : repartidor.idrepartidor
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-reset-repartidor', true)
    .subscribe(res => console.log(res));
  }

  resetLiberarRepartidor(repartidor: any) {
    console.log('repartidor', repartidor);

    const _dataSend = {
      idrepartidor : repartidor.idrepartidor
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-liberar-repartidor', true)
    .subscribe(res => console.log(res));
  }

  verPedido(orden: any) {
    const _dialogConfig = new MatDialogConfig();

    // marcador para que no cierrre como repartidor propio en orden detalle.
    orden.isRepartidorRed = true;

    _dialogConfig.disableClose = true;
    _dialogConfig.hasBackdrop = true;
    _dialogConfig.width = '700px';
    _dialogConfig.panelClass = ['my-dialog-orden-detalle', 'my-dialog-scrool'];
    _dialogConfig.data = {
      laOrden: orden
    };

    // console.log('orden openDialogOrden', orden);
    // this.pedidoRepartidorService.setPedidoSelect(orden);
    const dialogRef = this.dialog.open(DialogOrdenDetalleComponent, _dialogConfig);
  }




  // depostios // depostios // depostios
  verPedidoPagosVisa() {
    this.sumTotalAbona = 0;
    this.countPedidosAbonar = 0;

    let importePropina: any;
    let importeEntrega: any;
    let importeTotal = 0;
    let _sutotales: any;

    this.listComercioPagar = [];
    this.listRepartidoresPagar = [];


    const _dataTpm = this.dataPedidosAbonaMaster.data
      .filter(p => p.json_datos_delivery.p_header.arrDatosDelivery.metodoPago.idtipo_pago === 2)
      .map(p => {
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



        if ( p.pwa_delivery_servicio_propio === 0 ||  p.flag_solicita_repartidor_papaya === 1 ) {
          p.pp_propina = importePropina;
          p.pp_entrega = importeEntrega;
        } else {
          p.pp_propina = 0;
          p.pp_entrega = 0;
          importePropina = 0;
          importeEntrega = 0;
          // p.pp_repartidor = 0;
          // p.pp_comercio = importeTotal;
          // p.pp_arr = {
          //   visa: 0,
          //   igv: 0,
          //   importe_restar: 0,
          //   total: importeTotal
          // };
        }

        p.pp_repartidor = importePropina + importeEntrega;
        p.pp_comercio = importeTotal - p.pp_repartidor;
        p.pp_arr = this.calcImportePagar(p.pp_comercio);

        this.addComercioToList(p.json_datos_delivery.p_header.arrDatosDelivery.establecimiento);
        this.addRepartidorToList(p);

        return p;
      });

      this.dataPedidosAbona.data = _dataTpm;

      this.listFiltroOrigin = JSON.parse(JSON.stringify(_dataTpm));

      this.dataPedidosAbona.paginator = this.paginatorAbona;
      console.log('this.dataPedidosAbona.data', this.dataPedidosAbona.data);
  }

  calcImportePagar(importe: number): any {
    const comisionVisa = 0.0399;
    const comisionFija = 0.51;
    const comisionTransaccion = 0.19; // c. papaya

    const _visa = ((importe * comisionVisa) + comisionFija);
    const _igv = (_visa * 0.18) + comisionTransaccion; // igv
    const _importe_restar = _visa + _igv;
    const _total = importe - _importe_restar;

    return {
      visa: _visa.toFixed(2),
      igv: _igv.toFixed(2),
      trasaccionalidad: comisionFija,
      importe_restar: _importe_restar.toFixed(2),
      total: _total.toFixed(2)
    };

  }

  private addComercioToList(comercio: any) {
    const _comercio = this.listComercioPagar.filter(c => c.idsede === comercio.idsede)[0];
    if ( !_comercio ) {
      this.listComercioPagar.push(comercio);
    }
  }

  private addRepartidorToList(pedido: any) {
    let _repartidor = this.listRepartidoresPagar.filter(c => c.idrepartidor === pedido.idrepartidor)[0];
    if ( !_repartidor ) {

      _repartidor = {
        idrepartidor: pedido.idrepartidor,
        nombre: pedido.nom_repartidor
      };

      this.listRepartidoresPagar.push(_repartidor);
    }
  }

  filtroPor(value: any) {
    this.dataFiltroAbonar.por = value;
    this.aplicarFiltroListPago();
  }

  filtroComercio(comercio: any) {
    console.log(comercio);
    this.dataFiltroAbonar.idcomercio = comercio.value.idsede;
    this.aplicarFiltroListPago();
  }

  filtroRepartidor(repartidor: any) {
    console.log(repartidor);
    this.dataFiltroAbonar.idrepartidor = repartidor.value.idrepartidor;
    this.aplicarFiltroListPago();
  }

  filtroAbonado(value: any) {
    this.dataFiltroAbonar.estado = value;
    this.aplicarFiltroListPago();
  }

  private aplicarFiltroListPago() {
    let _list: any;

    _list = this.listFiltroOrigin;
    // tipo

    if ( this.dataFiltroAbonar.por === 0 ) {
      // comercio
      if ( this.dataFiltroAbonar.idcomercio !== 0 ) {
        _list = this.listFiltroOrigin.filter(p => p.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.idsede === this.dataFiltroAbonar.idcomercio);
      }
    } else {
      // repartidor
      if ( this.dataFiltroAbonar.idrepartidor !== 0 ) {
        _list = this.listFiltroOrigin.filter(p => p.idrepartidor === this.dataFiltroAbonar.idrepartidor);
      }
    }

    // estado
    if ( this.dataFiltroAbonar.estado.toString() !== '-1' ) {
      _list = _list.filter(p => p.check_pagado === this.dataFiltroAbonar.estado.toString());
    }

    this.dataPedidosAbona.data = _list;

    console.log(this.dataFiltroAbonar);
  }

  checkLiquidado (idpedido: number) {
    const _dateSend = {
      idpedido: idpedido
    };

    this.crudService.postFree(_dateSend, 'monitor', 'set-check-liquidado', true)
    .subscribe(res => {
      console.log(res);
        const _pedido = this.findPedido(idpedido);
        _pedido.check_liquidado = '1';
    });
  }

  checkAbonado (idpedido: number) {
    const _dateSend = {
      idpedido: idpedido
    };

    this.crudService.postFree(_dateSend, 'monitor', 'set-check-abonado', true)
      .subscribe(res => {
        const _pedido = this.findPedido(idpedido);
        _pedido.check_pagado = '1';
      });
  }

  checkAbonadoRepartidor (idpedido: number) {
    const _dateSend = {
      idpedido: idpedido
    };

    this.crudService.postFree(_dateSend, 'monitor', 'set-check-abonado-repartidor', true)
      .subscribe(res => {
        const _pedido = this.findPedido(idpedido);
        _pedido.check_pago_repartidor = '1';
      });
  }

  getTotalCostTotal() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.total_r)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCostVisa() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.pp_arr.visa)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCostIgv() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.pp_arr.igv)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCostTra() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.pp_arr.trasaccionalidad)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCostEntrega() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.pp_repartidor)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCostAbono() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.pp_arr.total)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCostLiquidado() {
    return this.dataPedidosAbona.data.filter(t => t.check_liquidado === '1').map(t => parseFloat(t.pp_arr.total)).reduce((acc, value) => acc + value, 0);
  }

  private findPedido(idpedido: number): any {
    return this.dataPedidosAbona.data.filter(p => p.idpedido === idpedido)[0];
  }

  exportPdf() {
    const opt = {
      margin:       1,
      filename:     'resumen.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    const element = document.getElementById('element-to-print');
    html2pdf().set(opt).from(element).save();
  }

}
