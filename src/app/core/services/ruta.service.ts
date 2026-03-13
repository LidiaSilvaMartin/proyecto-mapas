import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AjaxData } from '../interface/ajax-data.interface';
import { RutaData, Ruta } from '../interface/ruta.interface';

@Injectable({
    providedIn: 'root'
})
export class RutaService {
    private http = inject(HttpClient);
    private router = inject(Router);

    public rutas = toSignal(
        this.http.get<AjaxData<RutaData[]>>("https://mapa.viaverdectl.gal/api/v1/routes").pipe(
            map(res => res.data.map(item => this.normalizarRuta(item)))
        ),
        { initialValue: [] as Ruta[] }
    );

    public rutaSeleccionada = signal<Ruta | null>(null);

    // 3. Función para transformar los datos de la API y asignar tus KML de GitHub
    private normalizarRuta(item: RutaData): Ruta {
        // Creamos primero el objeto 'ruta'
        const ruta: Ruta = {
            id: item.slug || item.id.toString(),
            name: item.name || 'Sin nombre',
            description: item.description || 'Descripción no disponible',
            image: item.cover_image?.url || 'https://via.placeholder.com/400x250',
            kmlUrl: item.kml_file?.url || '',
            itinerario: item.itinerary || [],
            distance: item.distance || '',
            difficulty: item.difficulty || ''
        };

        // Ahora que 'ruta' existe, comparamos el nombre para meter tus KML
        const nombreLimpio = ruta.name.toLowerCase();

        if (nombreLimpio.includes('garganta verde')) {
            ruta.kmlUrl = 'https://raw.githubusercontent.com/LidiaSilvaMartin/proyecto-mapas/master/Sendero%20de%20la%20Garganta%20Verde.kml';
        } else if (nombreLimpio.includes('acantilado')) {
            ruta.kmlUrl = 'https://raw.githubusercontent.com/LidiaSilvaMartin/proyecto-mapas/master/Sendero%20del%20Acantilado.kml';
        }

        // Devolvemos el objeto final
        return ruta;
    }
    seleccionarRuta(ruta: Ruta | null) {
        this.rutaSeleccionada.set(ruta);
        if (ruta) {
            this.router.navigate(['/mapa/rutas', ruta.id]);
        } else {
            this.router.navigate(['/mapa/rutas']);
        }
    }

    copiarLinkRuta(ruta: Ruta) {
        const url = `${window.location.origin}/mapa/rutas/${ruta.id}`;
        navigator.clipboard.writeText(url).then(() => alert('Enlace de la ruta copiado.'));
    }
}