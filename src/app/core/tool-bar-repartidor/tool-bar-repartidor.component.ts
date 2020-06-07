import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { InfoTockenService } from 'src/app/shared/services/info-token.service';
import { ComercioService } from 'src/app/shared/services/comercio.service';
import { Router } from '@angular/router';
// import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-tool-bar-repartidor',
  templateUrl: './tool-bar-repartidor.component.html',
  styleUrls: ['./tool-bar-repartidor.component.css']
})
export class ToolBarRepartidorComponent implements OnInit {
  @Output() public openMenuLateral = new EventEmitter<boolean>(false);

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  abrirMenuLateral() {
    // console.log('this.openMenuLateral', true);
    this.openMenuLateral.emit(true);
  }

  // repartidorOnLine() {
  //   const _dialogConfig = new MatDialogConfig();
  //   _dialogConfig.disableClose = true;
  //   _dialogConfig.hasBackdrop = true;

  //   const dialogReset = this.dialog.open(DialogEfectivoRepartidorComponent, _dialogConfig);
  // }

  cerrarSession() {
    localStorage.clear();
    this.router.navigate(['../']);
  }

}
