import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudHttpService } from 'src/app/shared/services/crud-http.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-info-sede',
  templateUrl: './dialog-info-sede.component.html',
  styleUrls: ['./dialog-info-sede.component.css']
})
export class DialogInfoSedeComponent implements OnInit {
  dataSede: any;
  registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudHttpService,
    private dialogRef: MatDialogRef<DialogInfoSedeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.dataSede = data.dataSede;
    console.log(data);
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      idsede: this.dataSede.idsede,
      comision: this.dataSede.comsion_entrega,
      restobar: this.dataSede.costo_restobar_fijo_mensual
    });
  }

  guardarSede() {
    const dataSend = {
      registro: this.registerForm.value
    };

    console.log('registro', dataSend);

    this.crudService.postFree(dataSend, 'monitor', 'set-sede-info', true)
    .subscribe(res => {
      this.dialogRef.close(this.registerForm.value);
    });
  }

}
