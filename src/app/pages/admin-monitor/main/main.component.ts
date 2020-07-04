import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.socketService.connect();
  }

}
