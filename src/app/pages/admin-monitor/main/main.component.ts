import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogChangeComisionComponent } from 'src/app/componentes/dialog-change-comision/dialog-change-comision.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  showPanelRigth = false;
  constructor(
    private socketService: SocketService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.socketService.connect();
  }

  clickTab(op: any) {
    switch (op) {
      case 0:
        this.openDialogChangeComision();
        break;
    }
  }

  openDialogChangeComision() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(DialogChangeComisionComponent, _dialogConfig);
  }

  cerrarAllSession() {
    localStorage.clear();
    this.router.navigate(['../']);
  }

}
