import { Component, OnInit } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-select-sede',
  templateUrl: './dialog-select-sede.component.html',
  styleUrls: ['./dialog-select-sede.component.css']
})
export class DialogSelectSedeComponent implements OnInit {

  listSede: any;
  listSedeMaster: any;
  loading = false;
  constructor(
    private dialogRef: MatDialogRef<DialogSelectSedeComponent>,
    private crudService: CrudHttpService
  ) { }

  ngOnInit(): void {

    this.loadSede();
  }

  private loadSede() {
    this.loading = true;
    this.crudService.getAll('monitor', 'get-all-sedes', false, false, true)
      .subscribe((res: any) => {
        console.log(res);
        this.listSede = res.data;
        this.listSede.map(x => x.descripcion_bus = x.nombre + x.ciudad);

        this.listSedeMaster = JSON.parse(JSON.stringify(this.listSede));
        this.loading = false;
      });
  }

  buscar(searchText: string) {
    this.listSede = this.listSedeMaster.filter((x: any) => x.descripcion_bus.toLocaleLowerCase().includes(searchText));
  }

  selectedSede(sede: any) {
    this.dialogRef.close(sede);
  }

}
