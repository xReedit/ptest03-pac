import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { MonitorComponent } from './monitor/monitor.component';
import { AdminMonitorRoutingModule } from './admin.monitor.routing';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { MaterialModule } from 'src/app/core/material/material.module';



@NgModule({
  declarations: [MainComponent, MonitorComponent],
  imports: [
    CommonModule,
    AdminMonitorRoutingModule,
    CoreModule,
    ComponentesModule,
    MaterialModule,
  ]
})
export class AdminMonitorModule { }
