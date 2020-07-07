import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-mapa-repartidores-pedidos',
  templateUrl: './mapa-repartidores-pedidos.component.html',
  styleUrls: ['./mapa-repartidores-pedidos.component.css']
})
export class MapaRepartidoresPedidosComponent implements OnInit, OnChanges {
  @Input() listpedidos: any;
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  center: any;
  zoom = 15;
  // zoom = 15;
  // center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    // mapTypeId: 'hybrid'
  };

  // markerOptionsRepartidor = {draggable: false, icon: './assets/images/delivery-man.png'};

  private dataComercio: any;
  private dataRepartidores: any;
  private dataPedidos: any;
  markerComercio: any;
  markerRepartidor: any;
  markerPedidos: any;

  listCiudad: any;
  constructor(
    private crudService: CrudHttpService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.loadCiudades();
    // this.laodComercioAfiliados();
    this.listenSockets();
    // console.log('listpedidos', this.listpedidos);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( !this.listpedidos ) {return; }
    console.log('listpedidos', this.listpedidos);
    this.addMarkerPedidos();
    this.loadRepartidoresPedidosAsignados();
    // this.listaPedidos = this.listaPedidos;
    // this.addMarkerPedidos();
    // console.log('cambios en listaPediods', this.listaPedidos);
    // console.log('cambios en listaRepartidoresRed', this.listaRepartidoresRed);
    // console.log('cambios en list', this.listaPedidos);
  }

  listenSockets() {
    this.socketService.onRepartidorNotificaUbicacion()
    .subscribe(res => {
      // console.log('onRepartidorNotificaUbicacion', res);
      this.updateUbiucacion(res);
    });

    this.socketService.onGetPedidoAceptadoByReparidor()
    .subscribe(res => {
      // console.log('onRepartidorNotificaUbicacion', res);
      // this.updateUbiucacion(res);
      console.log('onGetPedidoAceptadoByReparidor', res);
    });
  }

  loadCiudades() {
    this.listCiudad = [];
    this.listCiudad.push({descripcion: 'Moyobamba', lat: -6.0364034, lng: -76.9835764});
    this.listCiudad.push({descripcion: 'Rioja', lat: -6.0610125, lng: -77.184148});

    this.center = this.listCiudad[0];

    // console.log('this.listCiudad', this.listCiudad);
  }

  laodComercioAfiliados() {
    this.crudService.getAll('monitor', 'get-historial-pago', false, false, true)
    .subscribe((res: any) => {
      // console.log('laodComercioAfiliados', res);
      this.dataComercio = res.data;

      this.loadRepartidores();
      // this.addMarkerComercio();
    });
  }

  loadRepartidores() {
    this.crudService.getAll('monitor', 'get-repartidores-conectado', false, false, true)
    .subscribe((res: any) => {
      this.dataRepartidores = res.data;
      this.addMarkerComercio();

      this.loadRepartidoresPedidosAsignados();
    });
  }

  loadRepartidoresPedidosAsignados() {
    this.crudService.getAll('monitor', 'get-repartidores-pedidos-asignados', false, false, true)
    .subscribe((res: any) => {
      res.data.map(p => {
        this.updatePedidos(p);
      });
    });
  }

  selectCiudad($event: any) {
    console.log($event);
    this.center = $event.value;
  }

  private addMarkerComercio(): void {
    this.markerComercio = [];
    this.markerRepartidor = [];

    this.dataComercio.map(c => {
      const _comercio = {
        position: {
          lat: parseFloat(c.latitude),
          lng: parseFloat(c.longitude)
        },
        label: {
          color: '#212121',
          fontWeight: '600',
          text: c.nombre
        },
        title: 'Comercio',
        info: c.nombre,
        options: {
          draggable: false,
          icon: `./assets/images/marker-5.png`
        }
      };

      this.markerComercio.push(_comercio);
    });

    // repartidores
    this.dataRepartidores.map(c => {
      const _repartidor = {
        idrepartidor: c.idrepartidor,
        position: {
          lat: parseFloat(c.position_now.latitude),
          lng: parseFloat(c.position_now.longitude)
        },
        label: {
          color: '#212121',
          fontWeight: '600',
          text: c.nombre
        },
        title: 'Repartidor',
        info: c.nombre,
        options: {
          // draggable: false,
          icon: `./assets/images/delivery-man.png`
        }
      };

      this.markerRepartidor.push(_repartidor);
    });


    console.log('markerComercio', this.markerComercio);
  }

  private addMarkerPedidos() {
    this.markerPedidos = [];
    this.listpedidos.map((c: any) => {

      const _pedido = {
        idpedido: c.idpedido,
        position: {
          lat: parseFloat(c.json_datos_delivery.p_header.arrDatosDelivery.direccionEnvioSelected.latitude),
          lng: parseFloat(c.json_datos_delivery.p_header.arrDatosDelivery.direccionEnvioSelected.longitude)
        },
        label: {
          color: '#212121',
          fontWeight: '600',
          text: c.idpedido.toString()
        },
        title: 'Pedido',
        info: c.idpedido.toString(),
        options: {
          draggable: false,
          animation: 1,
          icon: `./assets/images/marker-0.png`
        }
      };

      this.markerPedidos.push(_pedido);

    });

    // console.log('this.markerPedidos', this.markerPedidos);
  }

  updateUbiucacion(repartidor: any) {
    const _repartidor = this.markerRepartidor.filter((r: any) => r.idrepartidor === repartidor.idrepartidor)[0];
    if (  _repartidor ) {
      // _repartidor.position.lat = repartidor.coordenadas.latitude;
      // _repartidor.position.lng = repartidor.coordenadas.longitude;

      const _positionActual: google.maps.LatLngLiteral = {
        lat: repartidor.coordenadas.latitude,
        lng: repartidor.coordenadas.longitude
      };

      _repartidor.position = _positionActual;
    }
  }

  private updatePedidos(p: any) {
    p.json_datos_delivery = JSON.parse(p.json_datos_delivery);
    const iconMarker = p.idrepartidor ? 'marker-1.png' : 'marker-0.png';
    this.markerPedidos.push({
      idpedido: p.idpedido,
      position: {
        lat: parseFloat(p.json_datos_delivery.p_header.arrDatosDelivery.direccionEnvioSelected.latitude),
        lng: parseFloat(p.json_datos_delivery.p_header.arrDatosDelivery.direccionEnvioSelected.longitude)
      },
      label: {
        color: '#0d47a1',
        fontWeight: '600',
        text: p.idpedido
      },
      title: 'Pedido',
      info: p.idpedido,
      options: {
        animation: p.idrepartidor ? 0 : google.maps.Animation.BOUNCE,
        draggable: false,
        icon: `./assets/images/${iconMarker}`
      }
    });
  }

}
