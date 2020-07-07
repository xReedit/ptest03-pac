import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-pago-sede',
  templateUrl: './dialog-pago-sede.component.html',
  styleUrls: ['./dialog-pago-sede.component.css']
})
export class DialogPagoSedeComponent implements OnInit {

  registerForm: FormGroup;
  listHistorialPago: any;

  dataSede: any;
  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudHttpService,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.dataSede = data.dataSede;
    console.log(data);
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      idsede: this.dataSede.idsede,
      fecha: '',
      descripcion: '',
      importe: ''
    });


    this.loadHistorialPago();
  }

  guardarPago() {
    const dataSend = {
      registro: this.registerForm.value
    };

    this.dataSede.last_date_pago = this.registerForm.value.fecha;

    this.crudService.postFree(dataSend, 'monitor', 'set-registrar-pago', true)
    .subscribe(res => {
      console.log(res);
    });
  }

  loadHistorialPago() {
    const dataSend = {
      idsede: this.dataSede.idsede
    };
    this.dataSede.last_date_pago = this.registerForm.value.fecha;

    this.crudService.postFree(dataSend, 'monitor', 'set-historial-pago', true)
    .subscribe((res: any) => {
      this.listHistorialPago = res.data;
      console.log(res);
    });
  }

}
