import { Injectable } from '@angular/core';
import { CrudHttpService } from './crud-http.service';


@Injectable({
  providedIn: 'root'
})
export class TimetChangeCostoService {
  timeRefesh = 20000;
  listProgramacionPlaza: any = [];



  constructor(
    private crudService: CrudHttpService
  ) {
    this.initTime();
  }

  initTime() {
    this.loadListProgramations();
  }

  private loadListProgramations() {
    this.crudService.getAll('monitor', 'get-sede-con-servicio-express', false, false, true)
    .subscribe(res => {
      console.log('listprogramations', res);
      this.listProgramacionPlaza = res;

      this.runComandList();
    });
  }

  private runComandList() {
    setInterval(() => {
      this.comandList();
    }, this.timeRefesh);
  }

  private comandList() {
    const _date = new Date();
    const _dayNow = _date.getDay();
    const _hourNow = _date.getHours();
    let costoChange = 0;

    this.listProgramacionPlaza.data.map((p: any) => {
      const _dayLastChange = p.dia_cambios;
      const _costoNow  = p.c_minimo;

      if ( p.comand_costo ) {
         // verifica dia
         p.comand_costo.map(c => {

           const comand_costo = c;
           const _dayComand = comand_costo.dia.num;

           const _hourComand = parseInt(comand_costo.hora, 0);

           // si es -1 es todos los dias
           if ( _dayComand === -1 || _dayComand === _dayNow ) {

              // pasamos a verifcicar la hora de
              if ( _hourNow >= _hourComand ) {
                // si el costo actual es mayor no cambiamos
                costoChange = _costoNow >= comand_costo.costo ? 0 : comand_costo.costo;
                costoChange = _dayLastChange < _dayNow ? comand_costo.costo : costoChange;

              }
           }

        });

        if (costoChange !== 0) {
          p.c_minimo = costoChange;
          this.guardarCambios(p);
        }

      }
    });
  }

  guardarCambios(plazaSelected) {
    plazaSelected.dia_cambios = new Date().getDay();
    const _dataSend = {
      obj: plazaSelected
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-options-plaza', true)
    .subscribe(res => {
      console.log(res);
    });
  }

}
