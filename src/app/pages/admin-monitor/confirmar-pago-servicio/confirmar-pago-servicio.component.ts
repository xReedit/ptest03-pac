import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { FacturacionElectronicaService } from 'src/app/shared/services/facturacion-electronica.service';

@Component({
  selector: 'app-confirmar-pago-servicio',
  templateUrl: './confirmar-pago-servicio.component.html',
  styleUrls: ['./confirmar-pago-servicio.component.css']
})
export class ConfirmarPagoServicioComponent implements OnInit {

  dataConfirmarPagoServicio = new MatTableDataSource<any>();

  displayedColumns: string[] = ['#', 'comercio', 'cuenta', 'n_operacion', 'subtotales', 'importe_pagado', 'accion' ];

  private listTipoComprobantes: any;
  private tipoComprobanteEmitir: any;
  private infoSedeFactRecepator: any;
  private sedeInfoEmisor: any;

  constructor(
    private crudService: CrudHttpService,
    private facturacionService: FacturacionElectronicaService,
  ) { }

  ngOnInit(): void {
    this.loadPendientesConfirmacion();

    this.facturacionService.getTipoComprobantes()
    .subscribe(res => {
      console.log('comprobantes', res);
      this.listTipoComprobantes = res;
    });
  }

  loadPendientesConfirmacion() {
    this.crudService.getAll('monitor', 'get-confirmacion-pago-servicio', false, false, true)
    .subscribe((res: any) => {
      console.log('get-confirmacion-pago-servicio', res);

      this.dataConfirmarPagoServicio.data = res.data;
      this.loadSedeInfoEmisor();
    });
  }

  loadSedeInfoEmisor() {
    const _dataSend = {ruc: '20600161050'};

    this.crudService.postFree(_dataSend, 'monitor', 'get-sede-info-facturacion-by-ruc', true)
    .subscribe(res => {
      this.sedeInfoEmisor = res.data[0];
      console.log('get-sede-info-facturacion-by-ruc', res);
    });
  }

  // anular confirmacion, no se realizo el deposito
  anularPago(item: any) {
    const _dataSend = {umf_pago: item.ufm_pago_reset, idsede: item.idsede, idsede_pago_confirmacion: item.idsede_pago_confirmacion};
    this.crudService.postFree(_dataSend, 'monitor', 'set-anular-confirmacion-pago-servicio', true)
      .subscribe(res => {
        item.no_confirmado = 1;
      });
  }

  confirmarPago(item: any) {
    console.log('item', item);

    const _dataSend = {idsede: item.idsede};

    item.loader_confirmado = true;
    this.crudService.postFree(_dataSend, 'monitor', 'get-sede-info-fact', true)
      .subscribe(res => {
        console.log(res);
        this.infoSedeFactRecepator = res.data[0];

        const tipoComprobanteFiltrar = this.infoSedeFactRecepator.tipo_contribuyente === 'PJ' ? 'factura' : 'boleata';
        this.tipoComprobanteEmitir = this.listTipoComprobantes.filter((f: any) => f.descripcion.toLowerCase() === tipoComprobanteFiltrar)[0];
        console.log('this.tipoComprobanteEmitir', this.tipoComprobanteEmitir);

        // item
        const element: any = {};
        element.id = item.idsede_plan_contratado;
        element.des_seccion = 'Planes';
        element.des = 'Servicio de alquiler espacio virtual VM';
        element.punitario = item.importe_facturar;
        element.precio_total = item.importe_facturar;
        element.cantidad = 1;

        const itemsFact = [];
        itemsFact.push({items: [element]});

        // subtotales
        const _subTotles = this.cocinarSubtotales(item.importe_facturar);

        this.sedeInfoEmisor.is_exonerado_igv = 1;
        this.sedeInfoEmisor.porcentaje_igv = 0;
        this.sedeInfoEmisor.ubigeo = '150101';
        this.infoSedeFactRecepator.num_doc = this.infoSedeFactRecepator.ruc;
        this.infoSedeFactRecepator.nombres = this.infoSedeFactRecepator.nombre;

        this.facturacionService.cocinarFacturaComercio(
          item.idsede_pago_confirmacion,
          itemsFact,
          _subTotles,
          this.tipoComprobanteEmitir,
          this.infoSedeFactRecepator, this.sedeInfoEmisor);

          setTimeout(() => {
            item.loader_confirmado = false;
            item.confirmado = 1;
          }, 3000);
      });
  }

  cocinarSubtotales(_importe: string): any {
    const rpt = [];
    let itemSub = {};

    // subtotal
    itemSub = {
      descripcion: 'SUB TOTAL',
      esImpuesto: 0,
      id: 0,
      importe: _importe,
      quitar: false,
      tachado: false,
      visible: true,
      visible_cpe: true
    };

    rpt.push(itemSub);

    // igv
    itemSub = {
      descripcion: 'I.V.G',
      esImpuesto: 1,
      id: 0,
      importe: 0,
      quitar: false,
      tachado: false,
      visible: true,
      visible_cpe: true
    };

    rpt.push(itemSub);

    // total
    itemSub = {
      descripcion: 'TOTAL',
      esImpuesto: 0,
      id: 0,
      importe: _importe,
      quitar: false,
      tachado: false,
      visible: true,
      visible_cpe: true
    };

    rpt.push(itemSub);

    return rpt;

  }

}
