import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ComerciosComponent } from './comercios/comercios.component';
import { ComercioResumenPagoComponent } from './comercio-resumen-pago/comercio-resumen-pago.component';
import { ConfirmarPagoServicioComponent } from './confirmar-pago-servicio/confirmar-pago-servicio.component';


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
        },
        {
            path: 'comercios-cofirmar-pago-servicio',
            component: ConfirmarPagoServicioComponent,
            data: { titulo: 'Comercios pago servicio' }
        },
        {
            path: 'comercio-pago',
            component: ComercioResumenPagoComponent,
            data: { titulo: 'Comercios Pago' }
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminMonitorRoutingModule { }
