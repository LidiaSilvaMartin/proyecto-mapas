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
            map(res => {
                const rutasApi = res.data.map(item => this.normalizarRuta(item));
                const misRutas: Ruta[] = [
                    {
                        id: 'garganta-verde',
                        name: 'Sendero de la Garganta Verde',
                        description: 'Un espectacular cañón excavado por el río Bocaleones.',
                        image: 'https://milyunarutas.com/wp-content/uploads/IMG_0950-1.webp',
                        kmlUrl: 'https://raw.githubusercontent.com/LidiaSilvaMartin/proyecto-mapas/refs/heads/master/garganta-verde',
                        distance: '2.5 km',
                        difficulty: 'Alta',
                        itinerario: ['Aparcamiento Inicio', 'Mirador de la Garganta', 'Descenso por el sendero', 'La Ermita (Cueva', 'Cauce  del Río Bocaleones']
                    },
                    {
                        id: 'sendero-acantilado',
                        name: 'Sendero del Acantilado',
                        description: 'Ruta con vistas increíbles al mar desde los acantilados de Barbate.',
                        image: 'https://i0.wp.com/milyunarutas.com/wp-content/uploads/Sendero-del-acantilado-1-scaled.jpg?fit=2560%2C1621&quality=89&ssl=1',
                        kmlUrl: 'https://raw.githubusercontent.com/LidiaSilvaMartin/proyecto-mapas/refs/heads/master/sendero-acantilado',
                        distance: '6 km',
                        difficulty: 'Media',
                        itinerario: ['Puerto de Barbate', 'Playa de la Hierbabuena', 'Acantilados del Tajo', 'Torre del Tajo', 'Pinar de la Breña', 'Ermita de San Ambrosio', 'Caños de Meca']
                    }
                ];

                return [...misRutas, ...rutasApi];
            }),
        ),
        { initialValue: [] as Ruta[] }
    );


    public rutaSeleccionada = signal<Ruta | null>(null);


    private normalizarRuta(item: RutaData): Ruta {

        return {
            id: item.slug || item.id.toString(),
            name: item.name || 'Sin nombre',
            description: item.description || 'Descripción no disponible',
            image: item.cover_image?.url || 'https://via.placeholder.com/400x250',
            kmlUrl: item.kml_file?.url || '',
            itinerario: item.itinerary || [],
            distance: item.distance || '',
            difficulty: item.difficulty || ''
        };
    }


    abrirEnMaps(ruta: any) {

        if (!ruta.kmlUrl) {
            alert('Esta ruta no tiene un archivo de mapa disponible todavia.');
            return;
        }

        window.open(ruta.kmlUrl, '_blank');

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
        // Esto crea: http://localhost:4200/mapa/rutas/garganta-verde
        const urlDetalle = `${window.location.origin}/mapa/rutas/${ruta.id}`;

        navigator.clipboard.writeText(urlDetalle).then(() => {
            alert('Enlace de la ruta copiado al portapapeles');
        });
    }
}