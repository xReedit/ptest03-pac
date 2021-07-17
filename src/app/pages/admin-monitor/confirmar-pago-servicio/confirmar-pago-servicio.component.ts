import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';

@Component({
  selector: 'app-confirmar-pago-servicio',
  templateUrl: './confirmar-pago-servicio.component.html',
  styleUrls: ['./confirmar-pago-servicio.component.css']
})
export class ConfirmarPagoServicioComponent implements OnInit {

  dataConfirmarPagoServicio = new MatTableDataSource<any>();

  displayedColumns: string[] = ['#', 'comercio', 'cuenta', 'n_operacion', 'subtotales', 'importe_pagado', 'accion' ];

  constructor(
    private crudService: CrudHttpService
  ) { }

  ngOnInit(): void {
    this.loadPendientesConfirmacion();
  }

  loadPendientesConfirmacion() {
    this.crudService.getAll('monitor', 'get-confirmacion-pago-servicio', false, false, true)
    .subscribe((res: any) => {
      console.log('get-confirmacion-pago-servicio', res);

      this.dataConfirmarPagoServicio.data = res.data;
    });
  }

}
