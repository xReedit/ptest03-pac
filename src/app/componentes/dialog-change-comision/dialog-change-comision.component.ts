import { Component, OnInit } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MatDialogRef } from '@angular/material/dialog';
import { TimetChangeCostoService } from 'src/app/shared/services/timet-change-costo.service';

@Component({
  selector: 'app-dialog-change-comision',
  templateUrl: './dialog-change-comision.component.html',
  styleUrls: ['./dialog-change-comision.component.css']
})
export class DialogChangeComisionComponent implements OnInit {
  listPlazas: [];
  plazaSelected: any = {};
  listDays = [];
  listProgramacion: any = [];
  rowProgramacion = {
    dia: 0,
    hora: '',
    costo: 0
  };

  constructor(
    private crudService: CrudHttpService,
    private dialogRef: MatDialogRef<DialogChangeComisionComponent>,
    // private timeChangeService: TimetChangeCostoService
  ) { }

  ngOnInit(): void {
    // this.timeChangeService.initTime();

    this.listProgramacion = [];
    this.loadPlazas();

    const day = new Date();
    console.log('day.getDay()', day.getDay());
    this.listDays = [
      {num: -1, des: 'Todos los dias'},
      {num: 1, des: 'Lunes'},
      {num: 2, des: 'Martes'},
      {num: 3, des: 'Miercoles'},
      {num: 4, des: 'Jueves'},
      {num: 5, des: 'Viernes'},
      {num: 6, des: 'Sabado'},
      {num: 7, des: 'Domingo'}
    ];
  }

  loadPlazas() {
    this.crudService.getAll('monitor', 'get-sede-con-servicio-express', false, false, true)
    .subscribe((res: any) => {
      console.log(res);
      this.listPlazas = res.data;
    });
  }

  changePlaza() {
    console.log('plazaSelected', this.plazaSelected);

    this.loadProgramacionCostoPlaza();
  }

  loadProgramacionCostoPlaza() {
    this.listProgramacion = this.plazaSelected.comand_costo || [];
  }

  addRowProgramacion() {
    console.log('rowProgramacion', this.rowProgramacion);
    const _addRow = {... this.rowProgramacion, id: this.listProgramacion.length};

    this.listProgramacion.push(_addRow);
  }

  quitarRowProgramacion(itemRow: any) {
    this.listProgramacion = this.listProgramacion.filter(x => x.id !== itemRow.id);
  }

  guardarCambios() {
    this.plazaSelected.dia_cambios = new Date().getDay();
    this.plazaSelected.comand_costo = this.listProgramacion;
    // this.plazaSelected.listProgramacion = this.listProgramacion;
    const _dataSend = {
      obj: this.plazaSelected,
      listPlazas: this.listPlazas
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-options-plaza', true)
    .subscribe(res => {
      console.log(res);
      this.dialogRef.close();

      this.loadPlazasRunTimerChangeCosto();
    });
  }


  loadPlazasRunTimerChangeCosto() {
    this.crudService.getAll('monitor', 'get-sede-con-servicio-express', false, false, true)
    .subscribe((res: any) => {
      console.log(res);
      this.listPlazas = res.data;

      const _dataSend = {
        list: this.listPlazas
      };

      this.crudService.postFree(_dataSend, 'monitor', 'run-timer-change-costo-delivery', true)
      .subscribe((_res: any) => {
        console.log('res list response', _res);
      });
    });
  }

  // testChangeCosto() {
  //   this.timeChangeService.runComandList();
  // }

}
