//componente que solo "mira" lo que dice el servicio

import{ Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule} from '@angular/google-maps';
import { EnclaveService } from '../../core/services/enclave.service';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, GoogleMapsModule],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit{
    public enclaveSvc = inject(EnclaveService);
    public enclaves$ = this.enclaveSvc.enclaves$;

    center= { lat: 42.88, lng: -8.53 };
    zoom = 12;

    ngOnInit() {
        this.enclaveSvc.enclaveSeleccionado$.subscribe(p => {
        //si alguien selecciona en la lista, el mapa se mueve
        if (p) {
            this.center = { lat: p.latitud, lng: p.longitud };
            this.zoom = 17;
        }
    });
}
}