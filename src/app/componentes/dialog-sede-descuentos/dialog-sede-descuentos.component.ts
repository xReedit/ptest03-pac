import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { startWith, map } from 'rxjs/operators';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { UtilitariosService } from 'src/app/shared/services/utilitarios.service';

@Component({
  selector: 'app-dialog-sede-descuentos',
  templateUrl: './dialog-sede-descuentos.component.html',
  styleUrls: ['./dialog-sede-descuentos.component.css']
})
export class DialogSedeDescuentosComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  listDescuentosSede: any = [];
  listAplica: any = [];
  listItems: any = [];
  options: any = [];

  itemSelected: any;

  datosDescuento: any = {};

  viewList = true;

  @Input() sedeInfo: any;

  constructor(
    private crudService: CrudHttpService,
    private utilService: UtilitariosService
  ) { }

  ngOnInit(): void {

    this.datosDescuento.numero_pedidos = 0;

    this.listAplica.push({id: 0, descripcion: 'Item Carta'});
    this.listAplica.push({id: 1, descripcion: 'Seccion Carta'});
    this.listAplica.push({id: 2, descripcion: 'Producto Almacen'});
    this.listAplica.push({id: 3, descripcion: 'Producto Familia'});

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.loadListDescuentos();
  }

  private _filter(value: any): string[] {
    const filterValue = value.descripcion ? value.descripcion.toLowerCase() : value.toLowerCase();

    return this.options.filter(option => option.descripcion.toLowerCase().includes(filterValue));
  }

  selectedAplica($event) {

    const _dataSend = {
      op: $event.value,
      idsede: this.sedeInfo.idsede
    };

    this.datosDescuento.tipo = $event.value;

    this.crudService.postFree(_dataSend, 'monitor', 'get-select-tipo-aplica', true)
      .subscribe(res => {
        console.log(res);
        this.options = res.data;
      });
  }

  displayFn(item: any): string {
    return item && item.descripcion ? item.descripcion : '';
  }

  additemList(item: any) {
    this.itemSelected = item.option.value;
  }

  additem(porcentaje: number) {
    this.itemSelected.porcentaje = porcentaje;
    this.itemSelected.tipo = this.datosDescuento.tipo;
    this.listItems.push( this.itemSelected );

    this.datosDescuento.detalle = this.listItems;

    this.datosDescuento.f_desde = this.utilService.setDateTimeFormat(this.datosDescuento.f_ini);
    this.datosDescuento.f_hasta = this.utilService.setDateTimeFormat(this.datosDescuento.f_fin);

    this.datosDescuento.idsede = this.sedeInfo.idsede;

    console.log('this.datosDescuento', this.datosDescuento);
  }

  removeItem(item) {
    this.listItems = this.listItems.filter(x => x.id !== item.id );
  }

  guardarDescuento() {
    const _dataSend = {
      obj: this.datosDescuento
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-registrar-descuento', true)
    .subscribe(res => {
      this.vistaComponente();
    });
  }

  loadListDescuentos() {
    const _dataSend = {
      idsede: this.sedeInfo.idsede
    };

    this.crudService.postFree(_dataSend, 'monitor', 'get-all-sedes-descuentos', true)
    .subscribe((res: any) => {
      console.log(res);
      this.listDescuentosSede = res.data;
    });
  }

  editRow(item: any) {
    this.datosDescuento.idsede_descuento = item.idsede_descuento;
    this.datosDescuento.f_desde = item.f_desde;
    this.datosDescuento.f_hasta = item.f_fin;
    this.datosDescuento.numero_pedidos = item.numero_pedidos;

    this.crudService.postFree(this.datosDescuento, 'monitor', 'get-item-sedes-descuentos', true)
    .subscribe((res: any) => {
      console.log(res);
      this.datosDescuento.detalle = res.data;
      this.listItems = res.data;

      this.vistaComponente();
    });

  }

  deleteRow(item: any) {
    this.crudService.postFree(item, 'monitor', 'delete-item-sedes-descuentos', true)
    .subscribe((res: any) => {
      this.listDescuentosSede = this.listDescuentosSede.filter(x => x.idsede_descuento !== item.idsede_descuento);
    });
  }

  vistaComponente() {
    this.viewList = !this.viewList;
  }

  nuevoDescuento() {
    this.listItems = [];
    this.datosDescuento = {};
    this.datosDescuento.numero_pedidos = 0;
    this.vistaComponente();
  }

}
