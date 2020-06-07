import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitariosService {

  constructor() { }

  primeraConMayusculas(field: string): string {
    field = field.toLowerCase();
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  reformatDate(dateStr: string): string {
    const dArr = dateStr.split('-');  // ex input "2010-01-18"
    return dArr[2] + '/' + dArr[1] + '/' + dArr[0]; // ex out: "18/01/10"
  }

    // format 0 = 'dd/mm/yyyy' 1 = 'yyyy-mm-dd'
    getDateString(fecha: any, format: number = 0): any {
      fecha = fecha === null ? new Date() : fecha;
      const today = fecha;
      const d = today;
      const m = today.getMonth() + 1;
      const mes = (m < 10) ? '0' + m : m;
      const yy = today.getFullYear();
      // const year = (yy < 1000) ? yy + 1900 : yy;

      // const sFecha = today.getDate() + '/' + mes + '/' + year;

      return format === 0 ? [today.getDate(), mes, yy].join('/') : [yy, mes, today.getDate()].join('-');

    }

  xTiempoTranscurridos_2(h2: any) {
    const h1 = this.xDevolverHora();
    const hora1 = h1.split(':');
    const hora2 = h2.split(':');
    const t1 = new Date();
    const t2 = new Date();

    if ( hora2[2] === null) { hora2[2] = '00'; }
    t2.setHours( hora1[0], hora1[1], hora1[2]);
    t1.setHours( hora2[0], hora2[1], hora2[2]);

    const dif = <number><unknown>t2 - <number><unknown>t1; // diferencia en milisegundos
    const difSeg = Math.floor(dif / 1000);
    const segundos = difSeg % 60; // segundos
    const difMin = Math.floor(difSeg / 60);
    const minutos = difMin % 60; // minutos
    const difHs = Math.floor(difMin / 60);
    const horas = difHs % 24; // horas
    return this.xCeroIzq(horas, 2) + ':' + this.xCeroIzq(minutos, 2);

    }


  xDevolverHora(): any {
    const d = new Date();
    return this.xCeroIzq(d.getHours() , 2) + ':' + this.xCeroIzq(d.getMinutes(), 2) + ':' + this.xCeroIzq(d.getSeconds(), 2);
  }

  xCeroIzq(Num, CantidadCeros): string {
    Num = Num.toString();
    while ( Num.length < CantidadCeros ) {Num = '0' + Num; }
    return Num;
 }
}
