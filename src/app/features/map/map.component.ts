//componente que solo "mira" lo que dice el servicio
//componente de visualización geográfica
import { Component, inject, effect, computed } from '@angular/core';
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

    public puntosAMostrar = computed(() => {
        const seleccionado = this.enclaveSvc.enclaveSeleccionado();
        const todos = this.enclaveSvc.enclaves();

        if (seleccionado) {
            return [seleccionado];
        }
        return todos;
    });

    center: google.maps.LatLngLiteral = { lat: 42.8805, lng: -8.5457 };
    zoom = 10;

    constructor() {
        effect(() => {
            const todos = this.enclaveSvc.enclaves();
            const seleccionado = this.enclaveSvc.enclaveSeleccionado();
            // Si acaban de cargar los puntos y NO hay nada seleccionado
            if (todos.length > 0 && !seleccionado) {
                // Centramos el mapa en el primer punto de la lista para "ir" a la zona
                this.center = { lat: todos[0].latitude, lng: todos[0].longitude };
                this.zoom = 12; // Un zoom que permita ver varios puntos
            }
        }, { allowSignalWrites: true });

        // EFECTO 2: Cuando seleccionas un enclave específico
        effect(() => {
            const p = this.enclaveSvc.enclaveSeleccionado();
            if (p) {
                this.center = { lat: p.latitude, lng: p.longitude };
                this.zoom = 17; // Zoom de detalle
            }
        }, { allowSignalWrites: true });
    }
}


//effect: angular rastrea que señales usa dentro.
//Cuando enclaveSeleccionado cambia, el codigo dentro del effect
//se dispara para mover el "center" del mapa.
