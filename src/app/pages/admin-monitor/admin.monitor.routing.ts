import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ComerciosComponent } from './comercios/comercios.component';


const routes: Routes = [{
    path: '', component: MainComponent,
    data: { titulo: 'Inicio' },
    children: [
        {
            path: '', redirectTo: 'monitor'
        },
        {
            path: 'monitor',
            component: MonitorComponent,
            data: { titulo: 'Monitor' }
        },
        {
            path: 'comercios',
            component: ComerciosComponent,
            data: { titulo: 'Comercios' }
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminMonitorRoutingModule { }
