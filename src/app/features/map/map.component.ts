//componente que solo "mira" lo que dice el servicio
//componente de visualización geográfica
import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { EnclaveService } from '../../core/services/enclave.service';
import { RutaService } from '../../core/services/ruta.service';


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
    public rutaSvc = inject(RutaService);

    center: google.maps.LatLngLiteral = { lat: 36.5297, lng: -6.2946 }; 
    zoom = 10;

    constructor() {
        effect(() => {
            const p = this.enclaveSvc.enclaveSeleccionado();
            if (p) {
                this.center = { lat: p.latitude, lng: p.longitude };
                this.zoom = 17;
            }
        }, { allowSignalWrites: true });

        effect(() => {
            const r = this.rutaSvc.rutaSeleccionada();
            if (r && r.kmlUrl) {
                this.zoom = 12;

            } else {
                this.zoom = 10;
                this.center = { lat: 36.5297, lng: -6.2946 };
            }
        }, { allowSignalWrites: true });
    }
}

//effect: angular rastrea que señales usa dentro.
//Cuando enclaveSeleccionado cambia, el codigo dentro del effect
//se dispara para mover el "center" del mapa.
