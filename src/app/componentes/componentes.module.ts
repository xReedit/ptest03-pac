import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosDeliveryComponent } from './datos-delivery/datos-delivery.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material/material.module';
// import { GoogleMapsModule } from '@angular/google-maps';
import { DebounceClickDirective } from '../shared/directivas/debounce-click.directive';
import { EncuestaOpcionComponent } from './encuesta-opcion/encuesta-opcion.component';
// import { DialogUbicacionComponent } from './dialog-ubicacion/dialog-ubicacion.component';
import { AgregarDireccionComponent } from './agregar-direccion/agregar-direccion.component';

import { AgmCoreModule } from '@agm/core';
import { ItemComercioComponent } from './item-comercio/item-comercio.component';
import { SeleccionarDireccionComponent } from './seleccionar-direccion/seleccionar-direccion.component';
import { ConfirmarDeliveryComponent } from './confirmar-delivery/confirmar-delivery.component';
import { MenuLateralClienteComponent } from './menu-lateral-cliente/menu-lateral-cliente.component';
import { DialogMetodoPagoComponent } from './dialog-metodo-pago/dialog-metodo-pago.component';
import { DialogVerificarTelefonoComponent } from './dialog-verificar-telefono/dialog-verificar-telefono.component';
import { DialogDesicionComponent } from './dialog-desicion/dialog-desicion.component';
import { DialogEfectivoRepartidorComponent } from './dialog-efectivo-repartidor/dialog-efectivo-repartidor.component';
import { ProgressTimeLimitComponent } from './progress-time-limit/progress-time-limit.component';
import { ItemPedidoComponent } from './item-pedido/item-pedido.component';
import { MapaSoloComponent } from './mapa-solo/mapa-solo.component';
import { CompPedidoDetalleComponent } from './comp-pedido-detalle/comp-pedido-detalle.component';
import { DialogImgItemComponent } from './dialog-img-item/dialog-img-item.component';
import { CompCalificacionComponent } from './comp-calificacion/comp-calificacion.component';
import { DialogCalificacionComponent } from './dialog-calificacion/dialog-calificacion.component';

import { StarRatingModule } from 'angular-star-rating';
import { ComResumenPedidoComponent } from './com-resumen-pedido/com-resumen-pedido.component';
import { CompOrdenDetalleComponent } from './comp-orden-detalle/comp-orden-detalle.component';
import { DialogOrdenDetalleComponent } from './dialog-orden-detalle/dialog-orden-detalle.component';
import { ComFacturadorComponent } from './com-facturador/com-facturador.component';
import { ComRegistrarPagoComponent } from './com-registrar-pago/com-registrar-pago.component';
import { ComResumenAllPedidosComponent } from './com-resumen-all-pedidos/com-resumen-all-pedidos.component';
import { MapaOrdenesComponent } from './mapa-ordenes/mapa-ordenes.component';
import { DialogAddRepartidorComponent } from './dialog-add-repartidor/dialog-add-repartidor.component';
import { ComDateFilterComponent } from './com-date-filter/com-date-filter.component';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
import { CompSelectRepartidorComponent } from './comp-select-repartidor/comp-select-repartidor.component';
import { DialogPagoSedeComponent } from './dialog-pago-sede/dialog-pago-sede.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapaRepartidoresPedidosComponent } from './mapa-repartidores-pedidos/mapa-repartidores-pedidos.component';
import { DialogInfoSedeComponent } from './dialog-info-sede/dialog-info-sede.component';
import { DialogSelectSedeComponent } from './dialog-select-sede/dialog-select-sede.component';
import { DialogSedeDescuentosComponent } from './dialog-sede-descuentos/dialog-sede-descuentos.component';
import { CompClimaComponent } from './comp-clima/comp-clima.component';
import { CompOrdeExpressComponent } from './comp-orde-express/comp-orde-express.component';
import { DialogOrdenExpressDetalleComponent } from './dialog-orden-express-detalle/dialog-orden-express-detalle.component';
import { DialogChangeComisionComponent } from './dialog-change-comision/dialog-change-comision.component';
import { CompOrdenRetiroCashComponent } from './comp-orden-retiro-cash/comp-orden-retiro-cash.component';
// import { DialogSelectDireccionComponent } from './dialog-select-direccion/dialog-select-direccion.component';

@NgModule({
  declarations: [
    DatosDeliveryComponent,
    DebounceClickDirective,
    EncuestaOpcionComponent,
    AgregarDireccionComponent,
    ItemComercioComponent,
    SeleccionarDireccionComponent,
    ConfirmarDeliveryComponent,
    MenuLateralClienteComponent,
    DialogMetodoPagoComponent,
    DialogVerificarTelefonoComponent,
    DialogDesicionComponent,
    DialogDesicionComponent,
    DialogEfectivoRepartidorComponent,
    ProgressTimeLimitComponent,
    ItemPedidoComponent,
    MapaSoloComponent,
    CompPedidoDetalleComponent,
    DialogImgItemComponent,
    CompCalificacionComponent,
    DialogCalificacionComponent,
    ComResumenPedidoComponent,
    CompOrdenDetalleComponent,
    DialogOrdenDetalleComponent,
    ComFacturadorComponent,
    ComRegistrarPagoComponent,
    ComResumenAllPedidosComponent,
    MapaOrdenesComponent,
    DialogAddRepartidorComponent,
    ComDateFilterComponent,
    CompSelectRepartidorComponent,
    DialogPagoSedeComponent,
    MapaRepartidoresPedidosComponent,
    DialogInfoSedeComponent,
    DialogSelectSedeComponent,
    DialogSedeDescuentosComponent,
    CompClimaComponent,
    CompOrdeExpressComponent,
    DialogOrdenExpressDetalleComponent,
    DialogChangeComisionComponent,
    CompOrdenRetiroCashComponent
    // DialogSelectDireccionComponent,
    // DialogUbicacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    GoogleMapsModule,
    NgxMatDrpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAr1MuAvI3b3nvg_WONnOMLf7aLjPm3lC4',
      libraries: ['places']
    }),
    StarRatingModule.forRoot()
  ],
  exports: [
    DatosDeliveryComponent,
    DebounceClickDirective,
    EncuestaOpcionComponent,
    AgregarDireccionComponent,
    ItemComercioComponent,
    SeleccionarDireccionComponent,
    ConfirmarDeliveryComponent,
    DialogMetodoPagoComponent,
    DialogVerificarTelefonoComponent,
    DialogDesicionComponent,
    DialogEfectivoRepartidorComponent,
    ProgressTimeLimitComponent,
    ItemPedidoComponent,
    MapaSoloComponent,
    CompPedidoDetalleComponent,
    DialogImgItemComponent,
    CompCalificacionComponent,
    DialogCalificacionComponent,
    ComResumenPedidoComponent,
    CompOrdenDetalleComponent,
    DialogOrdenDetalleComponent,
    ComFacturadorComponent,
    ComResumenAllPedidosComponent,
    MapaOrdenesComponent,
    ComDateFilterComponent,
    CompSelectRepartidorComponent,
    DialogPagoSedeComponent,
    MapaRepartidoresPedidosComponent,
    DialogInfoSedeComponent,
    DialogSelectSedeComponent,
    DialogSedeDescuentosComponent,
    CompClimaComponent,
    CompOrdeExpressComponent,
    DialogOrdenExpressDetalleComponent,
    DialogChangeComisionComponent,
    CompOrdenRetiroCashComponent
  ],

  // entryComponents: [
  //   DialogMetodoPagoComponent,
  //   DialogVerificarTelefonoComponent,
  //   DialogDesicionComponent,
  //   DialogImgItemComponent,
  //   DialogCalificacionComponent
  // ]
})
export class ComponentesModule { }
