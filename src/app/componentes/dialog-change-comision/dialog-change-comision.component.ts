import { Component, OnInit } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-change-comision',
  templateUrl: './dialog-change-comision.component.html',
  styleUrls: ['./dialog-change-comision.component.css']
})
export class DialogChangeComisionComponent implements OnInit {
  listPlazas: [];
  plazaSelected: any = {};
  constructor(
    private crudService: CrudHttpService,
    private dialogRef: MatDialogRef<DialogChangeComisionComponent>,
  ) { }

  ngOnInit(): void {
    this.loadPlazas();
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
  }

  guardarCambios() {
    const _dataSend = {
      obj: this.plazaSelected
    };

    this.crudService.postFree(_dataSend, 'monitor', 'set-options-plaza', true)
    .subscribe(res => {
      console.log(res);
      this.dialogRef.close();
    });
  }

}
