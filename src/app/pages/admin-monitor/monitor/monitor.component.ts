import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogOrdenDetalleComponent } from 'src/app/componentes/dialog-orden-detalle/dialog-orden-detalle.component';
import { UtilitariosService } from 'src/app/shared/services/utilitarios.service';
// import { TimetChangeCostoService } from 'src/app/shared/services/timet-change-costo.service';


// pdf
import * as html2pdf from 'html2pdf.js';
import { GoogleMap } from '@angular/google-maps';
import { SocketService } from 'src/app/shared/services/socket.service';
import { ClassField } from '@angular/compiler';
import { DialogOrdenExpressDetalleComponent } from 'src/app/componentes/dialog-orden-express-detalle/dialog-orden-express-detalle.component';
import { DeliveryEstablecimiento } from 'src/app/modelos/delivery.establecimiento';
import { ComisionesVisaModel } from 'src/app/modelos/comsiones.visa.model';
import { PedidoModel } from 'src/app/modelos/pedido.model';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, OnDestroy {
  // @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  displayedColumnsPedidos: string[] = ['num_pedido', 'comercio', 'ciudad', 'cliente', 'repartidor', 'importe', 'min_transcurridos', 'min_avisa' ];
  displayedColumnsPedidosMandados: string[] = ['num_pedido', 'ciudad', 'cliente', 'de', 'a', 'repartidor', 'descripcion', 'importe', 'min_transcurridos'];

  displayedColumnsRepartidor: string[] = ['repartidor', 'pedido_a', 'por_aceptar', 'aceptados', 'calificacion', 'efectivo_mano', 'reasignado', 'online', 'ocupado'];
  displayedColumnsCliente: string[] = ['idcliente', 'cliente', 'pwa_id', 'f_registro', 'telefono', 'calificacion'];
  displayedColumnsClienteScanQr: string[] = ['#', 'Sede', 'Canal', 'cant_total', 'imp_total'];
  displayedColumnsRetiroCashAtm: string[] = ['#', 'cliente', 'ciudad', 'direccion', 'importe', 'repartidor', 'tiempo'];

  isFirstView = true;
  tabIndexSelected = 0; // tab seleccioando

  // displayedColumnsPedidosAbona: string[] = ['num_pedido', 'comercio', 'ciudad', 'cliente', 'repartidor'
  // , 'importe', 'importe_debitar', 'c_visa', 'c_igv', 'c_transaccion', 'c_entrega', 'neto_abonar', 'action'
  // , 'action_abonado' ];

  displayedColumnsPedidosAbona = [
    { def: 'num_pedido', label: 'Pedido', hide: false},
    { def: 'comercio', label: 'Comercio', hide: false},
    { def: 'ciudad', label: 'Ciudad', hide: false},
    { def: 'cliente', label: 'Cliente', hide: false},
    { def: 'repartidor', label: 'Repartidor', hide: false},
    { def: 'importe', label: 'Imp. Transaccion', hide: false},
    { def: 'importe_debitar', label: 'Imp. Debitar', hide: false},
    { def: 'c_visa', label: 'c. visanet', hide: false},
    { def: 'c_igv', label: 'c. igv', hide: false},
    { def: 'c_transaccion', label: 'c. transaccion', hide: false},
    { def: 'c_entrega', label: 'c. entrega', hide: false},
    { def: 'neto_abonar', label: 'N. Abonar', hide: false},
    { def: 'action', label: 'Liquidado', hide: false},
    { def: 'action_abonado', label: 'Abonado', hide: false}
  ];

  displayedColumnsCalificacionComercio: string[] = ['num_pedido', 'comercio', 'ciudad', 'cliente', 'repartidor', 'calificacion', 'comentario', 'opciones'];


  listDataPedidosMaster: any;
  dataPedidos = new MatTableDataSource<any>();
  dataPedidosMandados = new MatTableDataSource<any>();
  dataPedidosAbonaMaster = new MatTableDataSource<any>();
  dataRepartidores = new MatTableDataSource<any>();
  dataClientes = new MatTableDataSource<any>();
  dataClientesScanQr = new MatTableDataSource<any>();
  dataPedidosAbona = new MatTableDataSource<any>();
  dataCalificacionComercio = new MatTableDataSource<any>();
  dataRetirosCashAtm = new MatTableDataSource<any>();
  dataRetirosCashAtmEntregados = new MatTableDataSource<any>();
  listPedidosPendientes: any = [];
  listPPendienteSocket: any;
  listFiltroOrigin: any;
  listPedidosRetirosCashAtmMaster: any;
  listComisionVisa: ComisionesVisaModel;
  sumTotalAbona = 0;
  countPedidosAbonar = 0;
  countPedidos = 0;
  countClientes = 0;
  countPedidosApp = 0;
  countPedidosPagoTarjeta = 0;
  countPedidosPagoYape = 0;
  countPedidoRetirosAtm = 0;
  // countPedidoExpress = 0;

  countPedidosAndroid = 0;
  countPedidosIphone = 0;
  countPedidosWindos = 0;

  countPedidoMandados = 0;
  lastCountPedidoMandadosNotify = 0;
  countPedidoMandadosNotify = 0;
  isPedidosMandadosNotify = false;

  isShowPedidosExpress = false;
  isShowPedidoRetirosEntregados = false;

  dataFiltroAbonar = {
    por: '0', // 0 comercio 1 repartidor
    idcomercio: 0, // todos
    idrepartidor: 0, // todos
    estado: '-1' // -1 todos 0 por abonar 1 abonado
  };

  // listas
  listComercioPagar: any;
  listRepartidoresPagar: any;

   // datapicker
  range: any = {fromDate: new Date(), toDate: new Date(), firtsIdPedidoDate: ''};
  rangoFecha: any = {};

  rangeAbono: any = {fromDate: new Date(), toDate: new Date(), firtsIdPedidoDate: ''};
  rangoAbonoFecha: any = {};

  processLoop: any;

  isClimaVisible = false;
  showRepartidorMapa = false;

  idFirstPedidoDateSelected = '';


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('paginatorRepartidor', {static: true}) paginatorRepartidor: MatPaginator;
  @ViewChild('paginatorCliente', {static: true}) paginatorCliente: MatPaginator;
  @ViewChild('paginatorAbona', {static: true}) paginatorAbona: MatPaginator;
  @ViewChild('paginatorCalificacion', {static: true}) paginatorCalificacion: MatPaginator;
  @ViewChild('paginatorClienteScanQr', {static: true}) paginatorClienteScanQr: MatPaginator;

  constructor(
    private crudService: CrudHttpService,
    private utilesService: UtilitariosService,
    private dialog: MatDialog,
    private socketService: SocketService,
    private router: Router,
    // private timechangeService: TimetChangeCostoService
  ) { }

  ngOnInit(): void {

    // this.lastIdPedidoDate('sys::firts_id_pedido', this.rangoFecha.desde);
    // this.loadPedidos();
    // this.loadRepartidores();
    // this.loadClientes();



    // this.dataPedidos.paginator = this.paginator;


    this.loopLoad();

    this.listenSocketMonitor();

    // this.timechangeService.initTime();
  }


  ngOnDestroy(): void {
    this.processLoop = null;
  }



  private listenSocketMonitor() {
    // pedidos pendientes por aceptar
    // this.socketService.onMonitorPedidosPendientes()
    //   .subscribe(res => {
    //     console.log('onMonitorPedidosPendientes', res);
    //     this.pedidosPendietesPorAtender();
    //   });

    // notifica pedido a repartidor a espera que acepte
    // this.socketService.onMonitorNotificaPedidoRepartidor()
    //   .subscribe(pedidos => {
    //     console.log('onMonitorNotificaPedidoRepartidor', pedidos);
    //     this.refreshRepartidorPedidoPorAceptar(pedidos);
    //   });

    // notifica quita pedido repartidor por no acpetar a tiempo
    // this.socketService.onMonitorQuitaPedidoRepartidor()
    //   .subscribe(res => {
    //     console.log('onMonitorQuitaPedidoRepartidor', res);
    //     this.refreshRepartidorQuitaPedido(res);
    //   });

    // notifica repartidor online
    this.socketService.onMonitorRepartidorOnline()
      .subscribe(res => {
        console.log('onMonitorRepartidorOnline', res);
        this.loadRepartidores(false);
      });

    // notifica repartidor acepta pedido
    this.socketService.onGetPedidoAceptadoByReparidor()
      .subscribe(res => {
        console.log('onGetPedidoAceptadoByReparidor', res);
        // this.refreshRepartidorAceptaPedido(res);
        this.lastIdPedidoDate('sys::firts_id_pedido', this.rangoFecha.desde);
        // this.loadPedidos();
      });

    this.socketService.onGetNuevoPedido()
    .subscribe((res: any) => {
      console.log('===== nuevo pedido =========== ', res);
      if ( res.p_header.delivery === 1 ) {
        this.playSound(0);
        this.lastIdPedidoDate('sys::firts_id_pedido', this.rangoFecha.desde);
        // this.loadPedidos();
      }
    });

    this.socketService.onGetNuevoPedidoUpdateVista()
    .subscribe((res: any) => {
      console.log('===== nuevo pedido update vista =========== ', res);
      // if ( res.p_header.delivery === 1 ) {
        this.playSound(0);
        this.lastIdPedidoDate('sys::firts_id_pedido', this.rangoFecha.desde);
        // this.loadPedidos();
      // }
    });

    this.socketService.onGetNuevoPedidoMandado()
    .subscribe((res: any) => {
      console.log('===== nuevo pedido mandado =========== ', res);
        this.playSound(2);
        this.loadPedidosMandados();
    });

    this.socketService.onGetNuevoPedidoRetiroCashAtm()
    .subscribe((res: any) => {
      console.log('===== nuevo retiro cash atm =========== ', res);
      // if ( res.p_header.delivery === 1 ) {
        this.playSound(2);
        this.loadRetiroCashAtm();
      // }
    });


    this.socketService.onMonitorNotificaImpresionComanda()
    .subscribe((res: any) => {
      console.log('===== notifica-impresion-comanda =========== ', res);
      setTimeout(() => {
        this.notificaPedidoImpreso(res);
      }, 1000);
    });

    this.socketService.onDeliveryPedidoFin()
    .subscribe((res: any) => {
      console.log('===== repartidor-notifica-fin-pedido =========== ', res);
      const _repartidorPedido = this.dataRepartidores.data.filter(r => r.idrepartidor === res.idrepartidor)[0];
      if ( _repartidorPedido?.pedido_por_aceptar ) {
        _repartidorPedido.pedido_por_aceptar.cantidad_entregados++;
      }
    });

    this.socketService.onPedidoAsignadoManual()
    .subscribe((res: any) => {
      console.log('===== set-asigna-pedido-repartidor-manual =========== ', res);
      const _repartidorPedido = this.dataRepartidores.data.filter(r => r.idrepartidor === res.idrepartidor)[0];
      if ( _repartidorPedido?.pedido_por_aceptar ) {
        _repartidorPedido.pedido_por_aceptar.cantidad_pedidos_aceptados++;
      }
    });


    this.socketService.onRepartidorNotificaGrupoPedidoDinalizado()
    .subscribe((res: any) => {
      console.log('===== repartidor-grupo-pedido-finalizado =========== ', res);
      const _repartidorPedido = this.dataRepartidores.data.filter(r => r.idrepartidor === res)[0];
      if ( _repartidorPedido?.pedido_por_aceptar ) {
        _repartidorPedido.pedido_por_aceptar = null;
        _repartidorPedido.r_idpedido = null;
        _repartidorPedido.ocupado = 0;
        // _repartidorPedido.pedido_por_aceptar.cantidad_pedidos_aceptados++;
      }
    });


  }

  private loopLoad() {
    // this.processLoop = setInterval(() => this.loadPedidos(), 15000);
  }

  dateRangeSelected(range: any) {
    this.range = range;

    console.log(this.range);
    this.rangoFecha.desde = this.utilesService.getDateString(range.fromDate);
    this.rangoFecha.hasta = this.utilesService.getDateString(range.toDate);
    this.lastIdPedidoDate('sys::firts_id_pedido', this.rangoFecha.desde);
    // this.loadPedidos();
  }

  dateRangeAbonoSelected(range: any) {
    if ( this.tabIndexSelected !== 3) {return; }
    this.rangeAbono = range;

    console.log(this.range);
    this.rangoAbonoFecha.desde = this.utilesService.getDateString(range.fromDate);
    this.rangoAbonoFecha.hasta = this.utilesService.getDateString(range.toDate);
    this.lastIdPedidoDate('sys::firts_id_pedido_abono', this.rangoAbonoFecha.desde);

    // this.loadPedidosAbonos();
  }

  loadRetiroCashAtm() {
    this.crudService.postFree(this.range, 'monitor', 'get-retiros-cash-atm', true)
    .subscribe((res: any) => {
      console.log('pedido retiro cash atm', res);
      this.listPedidosRetirosCashAtmMaster = res.data;
      this.dataRetirosCashAtm.data = this.listPedidosRetirosCashAtmMaster.filter(x => x.pwa_estado === 'P');
      this.dataRetirosCashAtmEntregados = this.listPedidosRetirosCashAtmMaster.filter(x => x.pwa_estado === 'E');
      this.countPedidoRetirosAtm = this.listPedidosRetirosCashAtmMaster.length;
    });
  }

  private lastIdPedidoDate(keyStorage: string, fechaSeleted: string) {
    // return new Observable(observer => {
      // let listKeysFechaPedido = [];
      let isTomoElMayorId = false;
      const listKeysFechaPedido = JSON.parse(localStorage.getItem(keyStorage)) || [];
      if ( listKeysFechaPedido.length > 0 ) {
        // comprobar si perteneces a esa fecha

        const _itemRowFechaId = listKeysFechaPedido.filter(x => x.fecha === fechaSeleted)[0];
        if ( _itemRowFechaId ) {
          this.idFirstPedidoDateSelected = _itemRowFechaId.idpedido;
          this.runFuncPedidos(keyStorage);
          return;
        }

        // si es la primera vista, trae el mayor id
        const _idPSotrage = listKeysFechaPedido.map(x => x.idpedido).sort((a, b) => a - b)[0];
        if ( this.isFirstView ) {
          isTomoElMayorId = true;
          console.log('_idPSotrage', _idPSotrage);
          this.idFirstPedidoDateSelected = _idPSotrage;
          this.runFuncPedidos(keyStorage);
          // return;
        }
      }


    let rowKeyIdPedido;
    const _dateConvert  = this.utilesService.stringToDate(fechaSeleted);
    const _dateSend = {
      fromDate: this.utilesService.getDateString(_dateConvert, 1)
    };

    this.crudService.postFree(_dateSend, 'monitor', 'get-idpedido-firts-date', true)
      .subscribe((res: any) => {
        console.log('lastIdPedidoDate', res);
        const _idPedidoFirtsDate = res.data[0].idpedido;
        rowKeyIdPedido = {fecha: fechaSeleted, idpedido: _idPedidoFirtsDate};
        listKeysFechaPedido.push(rowKeyIdPedido);
        localStorage.setItem(keyStorage, JSON.stringify(listKeysFechaPedido));

        this.idFirstPedidoDateSelected = _idPedidoFirtsDate;

        // si toma el mayor solo guarda la fecha actual
        if ( !isTomoElMayorId ) {
          this.runFuncPedidos(keyStorage);
        }
        return;
      });
    // });
  }

  private runFuncPedidos(keyStorage: string) {
    switch (keyStorage) {
      case 'sys::firts_id_pedido':
        this.loadPedidos();
        break;
      case 'sys::firts_id_pedido_abono':
        this.loadPedidosAbonos();
        break;
    }

  }

  loadPedidos() {
    this.range.firtsIdPedidoDate = this.idFirstPedidoDateSelected;

    console.log('this.range', this.range);
    this.crudService.postFree(this.range, 'monitor', 'get-pedidos', true)
    .subscribe((res: any) => {
      console.log(res);
      this.listDataPedidosMaster = res.data;
      this.dataPedidos.data = res.data;
      this.countPedidos = res.data.length;
      this.countPedidosApp = 0;
      this.countPedidosPagoTarjeta = 0;
      this.countPedidosPagoYape = 0;

      this.countPedidosAndroid = 0;
      this.countPedidosIphone = 0;
      this.countPedidosWindos = 0;

      res.data.map(p => {
          // quita los espacion en blanco o saltos de pagina que pueda tener el string
          p.json_datos_delivery = p.json_datos_delivery.replace(/(\r\n|\n|\r)/g, '');
          p.json_datos_delivery = JSON.parse(p.json_datos_delivery);

        this.countPedidosApp += p.json_datos_delivery.p_header.isCliente === 1 ? 1 : 0;
        this.countPedidosPagoTarjeta += p.json_datos_delivery.p_header.arrDatosDelivery.metodoPago.idtipo_pago === 2 ? 1 : 0;
        this.countPedidosPagoYape += p.json_datos_delivery.p_header.arrDatosDelivery.metodoPago.idtipo_pago === 3 ? 1 : 0;

        this.countPedidosAndroid += p.json_datos_delivery.p_header.systemOS === 'Android' ? 1 : 0;
        this.countPedidosIphone += p.json_datos_delivery.p_header.systemOS === 'iOS' ? 1 : 0;
        this.countPedidosWindos += p.json_datos_delivery.p_header.systemOS === 'Windows' ? 1 : 0;
      });

      // this.dataPedidos.paginator = this.paginator;

      // this.verPedidoPagosVisa();
    });


    // atm retiros cash
    // if ( this.isFirstView ) {
      this.loadPedidosMandados();
      this.loadRetiroCashAtm();
      this.isFirstView = false;
    // }


  }

  loadPedidosMandados() {
    // load pedidos mandados y express
    this.crudService.postFree(this.range, 'monitor', 'get-pedidos-mandados', true)
    .subscribe((resp: any) => {
      console.log('pedidos mandados', resp);
      this.dataPedidosMandados.data = resp.data;
      this.countPedidoMandados = this.dataPedidosMandados.data.length;
      // this.lastCountPedidoMandadosNotify = this.lastCountPedidoMandadosNotify > 0 ? this.lastCountPedidoMandadosNotify - this.countPedidoMandados : this.countPedidoMandados;

      // this.countPedidoMandadosNotify = this.lastCountPedidoMandadosNotify;
      this.isPedidosMandadosNotify = this.countPedidoMandados > this.countPedidoMandadosNotify;
      this.lastCountPedidoMandadosNotify = this.countPedidoMandados;
    });
  }

  loadPedidosAbonos() {
    this.rangeAbono.firtsIdPedidoDate = this.idFirstPedidoDateSelected;
    this.crudService.postFree(this.rangeAbono, 'monitor', 'get-pedidos-abono', true)
    .subscribe((res: any) => {
      console.log(res);
      res.data.map(p => {p.json_datos_delivery = JSON.parse(p.json_datos_delivery); });

      this.dataPedidosAbonaMaster.data = res.data;
      // this.dataPedidosAbonaMaster.paginator = this.paginatorAbona;
      this.loadDatosVisaComsiones();

      // this.verPedidoPagosVisa();
    });
  }

  loadDatosVisaComsiones() {
    this.crudService.getAll('monitor', 'get-comisiones-visa-calc', false, false, true)
    .subscribe((res: any) => {
      console.log('comisiones-visa-calc', res);
      this.listComisionVisa = res.data[0];

      this.verPedidoPagosVisa();
    });
  }

  getDisplayColummsAbonado() {
    return this.displayedColumnsPedidosAbona.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadRepartidores(alIniciar = true ) {
    this.crudService.getAll('monitor', 'get-repartidores', false, false, true)
    .subscribe((res: any) => {
      console.log(res);
      this.dataRepartidores.data = res.data;
      this.dataRepartidores.paginator = this.paginatorRepartidor;

      if ( alIniciar ) {
        this.pedidosPendietesPorAtender();
      }
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

    this.loadClientesScanQr();
  }

  // sedes donde los clientes escanean los codigos qr - mozo virtual x fecha
  loadClientesScanQr(byDate = true) {
    const _dateSelected = byDate ? this.range : {fromDate: 0};
    // this.crudService.getAll(_dateSelected , 'monitor', 'get-clientes-scan-qr', false, false, true)
    this.crudService.postFree(_dateSelected, 'monitor', 'get-clientes-scan-qr', true)
    .subscribe((res: any) => {
      console.log(res);
      this.dataClientesScanQr.data = res.data;
      // this.countClientesScanQr = res.data.length;
      this.dataClientesScanQr.paginator = this.paginatorClienteScanQr;
    });

    // this.loadCalificacionClienteToComercio();
  }

  loadCalificacionClienteToComercio() {
    this.dataCalificacionComercio.data = null ;
    try {

      this.crudService.getAll('monitor', 'get-calificaciones-comercios', false, false, true)
      .subscribe((res: any) => {
        console.log('get-calificaciones-comercios',  res);
        this.dataCalificacionComercio.data = res.data.map(x => {
          x.style_calificacion = x.calificacion_cliente < 3 ? 0 : x.calificacion_cliente === 3 ? 1 : 2;
          x.json_datos_delivery = x.json_datos_delivery === '' ? null :  JSON.parse(x.json_datos_delivery);
          return x;
        });
        // this.countClientes = res.data.length;
        this.dataCalificacionComercio.paginator = this.paginatorCalificacion;
      });
    } catch (error) {
      console.log('loadCalificacionClienteToComercio', error);
    }
  }


  private pedidosPendietesPorAtender() {

    this.crudService.getAll('monitor', 'get-pedidos-pendientes', false, false, true)
    .subscribe((res: any) => {
      console.log('get-pedidos-pendientes', res.data);

      // const _list = res.data[0];

      // console.log('_list', _list);
      this.listPPendienteSocket = res.data;

      // if ( res.data.length === this.listPedidosPendientes.length ) { return; }

      this.listPedidosPendientes = [];

      res.data
      .map(p => {
        p.json_datos_delivery = JSON.parse(p.json_datos_delivery);
        const _row = {
          sede: p.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.nombre,
          pedido: p.idpedido,
          elpedido: p,
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
    .subscribe(res => {
      repartidor.pedidos_reasignados = 0;
    });
  }

  resetLiberarRepartidor(repartidor: any) {
    console.log('repartidor', repartidor);

    const _dataSend = {
      idrepartidor : repartidor.idrepartidor
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-liberar-repartidor', true)
    .subscribe(res => {
      repartidor.ocupado = 0;
      repartidor.pedido_por_aceptar = null;
      repartidor._flag_paso_pedido = 0;
    });
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
      laOrden: orden
    };

    // console.log('orden openDialogOrden', orden);
    // this.pedidoRepartidorService.setPedidoSelect(orden);
    const dialogRef = this.dialog.open(DialogOrdenDetalleComponent, _dialogConfig);
  }

  verPedidoExpress(orden: any) {
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
    const dialogRef = this.dialog.open(DialogOrdenExpressDetalleComponent, _dialogConfig);
  }

  verPedidoRetiroAtm(orden: any) {
    console.log('ver pedido atm');
    const _dialogConfig = new MatDialogConfig();

    // marcador para que no cierrre como repartidor propio en orden detalle.
    orden.isRepartidorRed = true;

    _dialogConfig.disableClose = true;
    _dialogConfig.hasBackdrop = true;
    _dialogConfig.width = '700px';
    _dialogConfig.panelClass = ['my-dialog-orden-detalle', 'my-dialog-scrool'];
    _dialogConfig.data = {
      laOrden: orden,
      from: 'cash-atm'
    };

    // console.log('orden openDialogOrden', orden);
    // this.pedidoRepartidorService.setPedidoSelect(orden);
    const dialogRef = this.dialog.open(DialogOrdenExpressDetalleComponent, _dialogConfig);
  }




  // depostios // depostios // depostios
  verPedidoPagosVisa() {
    this.sumTotalAbona = 0;
    this.countPedidosAbonar = 0;

    let importePropina: any;
    let importeEntrega: any;
    let importeTotal = 0;
    let _sutotales: any;
    let canal_consumo = '';
    let _establecimiento: DeliveryEstablecimiento;
    let costoDelivery = 0;

    this.listComercioPagar = [];
    this.listRepartidoresPagar = [];


    console.log('this.dataPedidosAbonaMaster.data', this.dataPedidosAbonaMaster.data);
    const _dataTpm = this.dataPedidosAbonaMaster.data
      // .filter(p => p.json_datos_delivery.p_header.arrDatosDelivery.metodoPago)
      // .filter(p => p.json_datos_delivery.p_header.arrDatosDelivery.metodoPago.idtipo_pago === 2)
      .map(p => {
        this.countPedidosAbonar ++;
        this.sumTotalAbona +=  parseFloat(p.total_r);
        p.visible = true;

        // totales
        // sub total

        // canal de consumo
        canal_consumo = p.json_datos_delivery.p_header.delivery === 1 ? 'Delivery' : p.json_datos_delivery.p_header.solo_llevar === 1 ? 'LLevar' : 'Local';
        p.canal_consumo = canal_consumo;
        console.log('p.canal_consumo', p.canal_consumo);

        // si es local o llevar entonces no tiene establecimiento grabado
        if ( canal_consumo !== 'Delivery' ) {
          _establecimiento = new DeliveryEstablecimiento;
          _establecimiento.idsede = p.idsede;
          _establecimiento.idorg = p.idorg;
          _establecimiento.nombre = p.nom_sede;
          _establecimiento.ciudad = p.ciudad_sede;
          p.json_datos_delivery.p_header.arrDatosDelivery.establecimiento = _establecimiento;
        } else {
          costoDelivery = p.json_datos_delivery.p_header.arrDatosDelivery.costoTotalDelivery;
        }


        _sutotales = p.json_datos_delivery.p_subtotales;
        importePropina = _sutotales.filter(s => s.id === -3)[0];
        importePropina = importePropina ? parseFloat(importePropina.importe) : 0;

        importeEntrega = _sutotales.filter(s => s.id === -2)[0];
        importeEntrega = importeEntrega ? parseFloat(importeEntrega.importe) : costoDelivery;

        importeTotal = parseFloat(_sutotales[_sutotales.length - 1]. importe);



        if ( p.idrepartidor ) {
          p.pp_propina = importePropina;
          p.pp_entrega = importeEntrega;
        } else {
          p.pp_propina = 0;
          p.pp_entrega = 0;
          importePropina = 0;
          importeEntrega = 0;
        }
        p.pp_repartidor = importePropina + importeEntrega;
        p.total_debitar = importeTotal - p.pp_repartidor;
        p.pp_comercio = importeTotal - p.pp_repartidor;
        p.pp_arr = this.calcImportePagar(p.pp_comercio, p.pwa_delivery_atendido === 1);

        this.addComercioToList(p.json_datos_delivery.p_header.arrDatosDelivery.establecimiento);
        this.addRepartidorToList(p);

        return p;
      });

      this.dataPedidosAbona.data = _dataTpm;

      this.listFiltroOrigin = JSON.parse(JSON.stringify(_dataTpm));

      this.dataPedidosAbona.paginator = this.paginatorAbona;
      console.log('this.dataPedidosAbona.data', this.dataPedidosAbona.data);
  }

  calcImportePagar(importe: number, isPedidoAnulado = false): any {
    const comisionVisa = parseFloat(this.listComisionVisa.comision_visa); // 0.0346; // 0.0399;
    const comisionFija = parseFloat(this.listComisionVisa.comision_transaccion); // 0.51;
    const comisionTransaccion = parseFloat(this.listComisionVisa.comision_papaya); // 0.19; // c. papaya
    const porcentaje_igv = parseFloat(this.listComisionVisa.igv);

    const _visa = ((importe * comisionVisa) + comisionFija);
    const _igv = (_visa * porcentaje_igv) + comisionTransaccion; // igv
    const _importe_restar = _visa + _igv;
    const _total = isPedidoAnulado ? 0 : importe - _importe_restar;


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

    if ( this.dataFiltroAbonar.por === '0' ) {
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

  checkAbonado (item: any) {
    const _dateSend = {
      idpedido: item.idpedido,
      idpwa_pago_transaction: item.idpwa_pago_transaction
    };

    this.crudService.postFree(_dateSend, 'monitor', 'set-check-abonado', true)
      .subscribe(res => {
        const _pedido = this.findPedido(item.idpedido);
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

  getTotalCostTotalDebitar() {
    return this.dataPedidosAbona.data.map(t => parseFloat(t.total_debitar)).reduce((acc, value) => acc + value, 0);
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

    // ocultar columns
    this.displayedColumnsPedidosAbona[4].hide = true; // repartidor
    this.displayedColumnsPedidosAbona[5].hide = true; // importe total
    this.displayedColumnsPedidosAbona[10].hide = true; // comision repartidor

    const opt = {
      margin:       1,
      filename:     'resumen.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    const element = document.getElementById('element-to-print');
    html2pdf().set(opt).from(element).save();


    setTimeout(() => {
      // ocultar columns
    this.displayedColumnsPedidosAbona[4].hide = false; // repartidor
    this.displayedColumnsPedidosAbona[5].hide = false; // importe total
    this.displayedColumnsPedidosAbona[10].hide = false; // comision repartidor
    }, 2000);
  }


  // refresh vista repartidor pedido por aceptar
  private refreshRepartidorPedidoPorAceptar( pedido ) {
    const _repartidor = this.dataRepartidores.data.filter( r => r.idrepartidor === pedido[0].idrepartidor )[0];
    const _pedidoInList = this.listPedidosPendientes.filter( p => p.pedido === pedido[1].pedidos[0])[0];

    _repartidor.nom_sede = _pedidoInList.elpedido.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.nombre;
    _repartidor.pedido_por_aceptar = pedido[1];
    _repartidor.r_idpedido = _pedidoInList.pedido;
    _repartidor.flag_paso_pedido = _pedidoInList.pedido;
    _repartidor.t_transcurrido = _pedidoInList.min_transcurridos;
  }

  private refreshRepartidorQuitaPedido( idrepartidor ) {
    const _repartidor = this.dataRepartidores.data.filter( r => r.idrepartidor === idrepartidor )[0];
    _repartidor.pedido_por_aceptar = null;
    _repartidor.r_idpedido = null;
    _repartidor.flag_paso_pedido = 0;
    _repartidor.t_transcurrido = null;
  }

  private refreshRepartidorAceptaPedido( pedido ) {
    const _repartidor = this.dataRepartidores.data.filter( r => r.idrepartidor === pedido[0].idrepartidor )[0];
    _repartidor.flag_paso_pedido = 0;
    _repartidor.ocupado = 1;
  }

  cerrarClima() {
    this.isClimaVisible = !this.isClimaVisible;
  }

  public playSound(id: number) {
    let nameSound = '';
    switch (id) {
      case 0: // notificacion pedido
        nameSound = 'notifica-pedido.mp3';
        break;
    }

    this.emitSound(nameSound);
  }

  private emitSound(name: string) {
    const audio = new Audio();
    audio.src = `./assets/audio/${name}`;
    audio.load();
    audio.play();
  }

  private buscarPedidoById(_id): any {
    if ( !_id || _id === 0 || !this.listDataPedidosMaster) {return null; }
    return this.listDataPedidosMaster.filter(x => x.idpedido = _id)[0];
  }

  private notificaPedidoImpreso(_id) {
    // const _elPedido = this.buscarPedidoById(_id);
    // if ( !_elPedido ) { return; }
    // _elPedido.pwa_estado = 'A';
  }

  tabSelected($event: any) {
    console.log('$event tab', $event);
    this.tabIndexSelected = $event.index;

    switch (this.tabIndexSelected) {
      case 1:
        if ( this.dataRepartidores.data.length > 0 ) {return; }
        this.loadRepartidores();
        break;
      case 2:
        if ( this.dataClientes.data.length > 0 ) {return; }
        this.loadClientes();
        break;
    }


  }

  goPagoServicioConfirmar() {
    this.router.navigate(['./comercio/comercios-cofirmar-pago-servicio']);
  }

}
