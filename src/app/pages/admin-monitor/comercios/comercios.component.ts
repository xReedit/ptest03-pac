import { Component, OnInit } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogPagoSedeComponent } from 'src/app/componentes/dialog-pago-sede/dialog-pago-sede.component';

@Component({
  selector: 'app-comercios',
  templateUrl: './comercios.component.html',
  styleUrls: ['./comercios.component.css']
})
export class ComerciosComponent implements OnInit {

  dataComercios = new MatTableDataSource<any>();
  displayedColumnsPedidos: string[] = ['num', 'comercio', 'abierto', 'ultimo_pedido', 'num_pedidos_total', 'x_consumo', 'num_pedidos_delivery_total_app', 'num_pedidos_delivery_total_app_last_fpago'
  , 'total_pendiente', 'comision', 'importe_pagar', 'fijo_restobar', 'neto_pagar', 'f_last_pago', 'op' ];

  constructor(
    private crudService: CrudHttpService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  loadComercios() {
    this.crudService.getAll('monitor', 'get-comercios-resumen', false, false, true)
    .subscribe((res: any) => {
      console.log(res);

      this.dataComercios.data = res.data;
    });
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

}
