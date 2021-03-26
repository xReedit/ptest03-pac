import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-orden-express-detalle',
  templateUrl: './dialog-orden-express-detalle.component.html',
  styleUrls: ['./dialog-orden-express-detalle.component.css']
})
export class DialogOrdenExpressDetalleComponent implements OnInit {
  laOrden: any;

  isFromVistaSow = '';
  constructor(
    private dialogRef: MatDialogRef<DialogOrdenExpressDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    console.log('ver pedido atm');
    this.laOrden = data.laOrden;
    this.isFromVistaSow = data.from;

    this.isFromVistaSow = this.isFromVistaSow ? this.isFromVistaSow :  '';
  }

  ngOnInit(): void {
  }

  cerrarDialog(val: boolean) {
    if ( val ) {
      this.dialogRef.close(this.laOrden);
    }
  }

}
