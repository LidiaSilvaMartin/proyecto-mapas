import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnclaveService } from '../../core/services/enclave.service';
import { EnclaveDetailComponent } from '../../shared/components/enclave-detail/enclave-detail.component';
import { EnclaveListComponent } from '../../shared/components/enclave-list/enclave-list.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, EnclaveListComponent, EnclaveDetailComponent],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
    public enclaveSvc = inject(EnclaveService);
    public enclaves$ = this.enclaveSvc.enclaves$;
    public seleccionado$ = this.enclaveSvc.enclaveSeleccionado$;

    tabActual: 'puntos' | 'rutas' = 'puntos';

}