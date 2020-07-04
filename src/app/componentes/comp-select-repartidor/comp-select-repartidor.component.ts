import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';


@Component({
  selector: 'app-comp-select-repartidor',
  templateUrl: './comp-select-repartidor.component.html',
  styleUrls: ['./comp-select-repartidor.component.css']
})
export class CompSelectRepartidorComponent implements OnInit {
  @Input() codigo_postal: string;
  @Input() label_select: string;
  @Output() repartidorSelected: any = new EventEmitter(null);

  listRepartidor: any;
  constructor(
    private crudService: CrudHttpService
  ) { }

  ngOnInit(): void {
    const _dataSend = {
      codigo_postal: this.codigo_postal
    };

    this.crudService.postFree(_dataSend, 'monitor', 'get-repartidores-ciudad', true)
    .subscribe((res: any) => {
      console.log(res);
      this.listRepartidor = res.data;
    });


  }

  setRepartidor(repartidor: any) {
    this.repartidorSelected.emit(repartidor.value);
  }

}
