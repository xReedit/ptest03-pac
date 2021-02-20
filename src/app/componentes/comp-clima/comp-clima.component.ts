import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comp-clima',
  templateUrl: './comp-clima.component.html',
  styleUrls: ['./comp-clima.component.css']
})
export class CompClimaComponent implements OnInit, OnDestroy {
  timeRefresh = 180000; // 3minutos
  timeInterval: any;

  listSede: any;
  private listTablaPrecipitacion: any;
  private urlApiClima = `https://api.openweathermap.org/data/2.5/weather`;
  private urlImageClima = '//openweathermap.org/img/wn/';

  constructor(
    private crudService: CrudHttpService
  ) { }

  ngOnInit(): void {
    this.loadTablaPrecipitacion();
  }

  ngOnDestroy(): void {
    this.timeInterval = null;
  }

  private loadTablaPrecipitacion() {
    this.crudService.getAll('monitor', 'get-tabla-precipitacion', false, false, true)
      .subscribe((res: any) => {
        this.listTablaPrecipitacion = res.data;
        this.loadSede();
      });
  }

  private loadSede() {
    this.crudService.getAll('monitor', 'get-sede-con-servicio-express', false, false, true)
      .subscribe((res: any) => {
        this.listSede = res.data.map(s => {
          s.ultimoUptate = 0;
          return s;
        });

        this.recordListSede();
        this.runLoopgetClima();
      });
  }

  private runLoopgetClima() {
    this.timeInterval = setInterval(() => this.recordListSede(), this.timeRefresh);
  }

  private recordListSede() {
    this.listSede.map((s: any) => {
    // for await (let index = 0; index < this.listSede.length; index++) {
    //   const s = this.listSede[index];
      if ( s.id_api_clima_ciudad !== '0' ) {
        this.getClimaCiudadApi(s.id_api_clima_ciudad).subscribe((res: any) => {
          const isRain = res.rain ? res.rain['1h'] : null;
          s.clima_img = `${this.urlImageClima}${res.weather[0].icon}.png`;
          s.clima_des = res.weather[0].description;
          s.isSubeComision = false;
          s.isRain = 0;
          s.res_api_clima =  res;
          this.calcCostoSegunClima(s, isRain);

          if ( s.clima_comision ) {
            s.rain = res.rain;
            s.clima_des = s.clima_comision.descripcion;
            s.clima_comision.costo_show = parseFloat( s.clima_comision.costo ) + s.c_minimo_base;
            s.clima_comision.costo_x_km_adicional_show = parseFloat( s.clima_comision.costo_x_km_adicional ) + s.c_km_base;

            s.isSubeComision = parseFloat( s.clima_comision.costo ) > 0;
          } else {
            s.clima_comision = {};
            s.clima_comision.costo_show = s.c_minimo_base;
            s.clima_comision.costo_x_km_adicional_show = s.c_km_base;
            s.clima_comision.costo = 0;
            s.clima_comision.costo_x_km_adicional = 0;

          }

          if ( s.ultimoUptate !== s.clima_comision.costo) {
            s.isRain = s.isSubeComision ? 1 : 0;
            s.ultimoUptate = s.clima_comision.costo;
            // this.updateImporteComision(s);
          }

          // guarda en la bd si la comision es diferente {}
          // s.comisiones = isRain ? this.calcCostoSegunClima(isRain) : null;

          console.log('s========', s);
        });
      }
    // }
    });
  }

  private updateImporteComision(sede: any) {
    this.crudService.postFree(sede, 'monitor', 'set-importe-comsion-lluvia', true)
    .subscribe(res => {
      console.log(res);
    });
  }

  private getClimaCiudadApi(id_api_clima_ciudad) {
      const url = `${this.urlApiClima}?id=${id_api_clima_ciudad}&lang=sp&appid=040cb09571cceb79febb7ba02e9713d9`;
      return new Observable(observer => {
        this.crudService.getFree(url)
        .subscribe(res => {
          observer.next(res);
        });
      });
  }

  // rain_mmh > intensidad de lluvia
  private calcCostoSegunClima(s: any, rain_mmh: number) {
    s.clima_comision = null;
    if ( !rain_mmh ) {return; }
    this.listTablaPrecipitacion.map((i: any) => {
      const rango = i.mm_h.split('-');
      if ( rain_mmh >= parseFloat(rango[0]) && rain_mmh <= parseFloat(rango[1]) ) {
        s.clima_comision = i;
        return;
      }
    });
  }

}
