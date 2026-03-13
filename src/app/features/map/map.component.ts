//componente que solo "mira" lo que dice el servicio
//componente de visualización geográfica
import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { EnclaveService } from '../../core/services/enclave.service';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, GoogleMapsModule],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent {
    public enclaveSvc = inject(EnclaveService);
    public enclaves = this.enclaveSvc.enclaves;

    center = { lat: 42.88, lng: -8.53 };
    zoom = 12;

    constructor() {
        effect(() => {
            const p = this.enclaveSvc.enclaveSeleccionado();
            if (p) {
                this.center = { lat: p.latitude, lng: p.longitude };
                this.zoom = 17;
            }
        });
    }
}

//effect: angular rastrea que señales usa dentro.
//Cuando enclaveSeleccionado cambia, el codigo dentro del effect
//se dispara para mover el "center" del mapa.
