import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnclaveService } from '../../core/services/enclave.service';
import { EnclaveDetailComponent } from '../../shared/components/enclave-detail/enclave-detail.component';
import { EnclaveListComponent } from '../../shared/components/enclave-list/enclave-list.component';
import { RouterModule, Router } from '@angular/router';

import { RutaListComponent } from '../../shared/components/ruta-list/ruta-list.component';
import { RutaDetailComponent } from '../../shared/components/ruta-detail/ruta-detail.component';

import { RutaService } from '../../core/services/ruta.service';


@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterModule, CommonModule, EnclaveListComponent, EnclaveDetailComponent, RutaDetailComponent, RutaListComponent],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
    private router = inject(Router);
    public enclaveSvc = inject(EnclaveService);
    public enclaves = this.enclaveSvc.enclaves;
    public seleccionado = this.enclaveSvc.enclaveSeleccionado;
    public rutaSvc = inject(RutaService);

    get tabActual() {
        return this.router.url.includes('/rutas') ? 'rutas' : 'puntos';
    }
    navegarA(destino: 'puntos' | 'rutas') {
        if (destino === 'puntos') {
            this.router.navigate(['/mapa']);
        } else {
            this.router.navigate(['/mapa/rutas']);
        }
    }
}