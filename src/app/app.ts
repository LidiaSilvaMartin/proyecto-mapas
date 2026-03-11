import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

//MOVER ESTA INTERFAZ A SU ARCHIVO enclave.models.ts
interface Ruta {
  id: string;
  nombre: string;
  kml: string;
  imagen: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, HttpClientModule, MatCheckboxModule, MatExpansionModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  //CONFIGURACIÓN MAPA
  zoom = 12;
  center: google.maps.LatLngLiteral = { lat: 42.88, lng: -8.53 };
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
    styles: [] 
  };

  // ESTADO DE LA INTERFAZ
  tabActual: 'puntos' | 'rutas' = 'puntos'; // Controla qué pestaña vemos

  //DATOS PUNTOS DE INTERÉS
  listaEnclaves: any[] = [];
  listaFiltrada: any[] = [];
  enclaveSeleccionado: any = null;

  //DATOS RUTAS
  listaRutas: Ruta[] = [];
  rutaSeleccionadaUrl: string | null = null; 

  // categorias no validas
  categorias: string[] = ['Naturaleza', 'Patrimonio', 'Patrimonio militar', 'Restauración', 'Sendero', 'Alojamiento', 'Hostal', 'Hotel', 'Camping', 'Albergue', 'Aparcamiento', 'Área de descanso', 'Empresa turística', 'Monumento', 'Museo'];
  ayuntamientos: string[] = ['Cerceda', 'Ordes', 'Oroso', 'Santiago de Compostela', 'Tordoia'];

  categoriasSeleccionadas: Set<string> = new Set();
  ayuntamientosSeleccionados: Set<string> = new Set();

  ngOnInit() {
    this.cargarEnclaves();
  }

 

  seleccionarRuta(ruta: Ruta) {
    // Si haces clic en la misma ruta, la quitamos del mapa. Si no, la cargamos.
    if (this.rutaSeleccionadaUrl === ruta.kml) {
      this.rutaSeleccionadaUrl = null;
    } else {
      this.rutaSeleccionadaUrl = ruta.kml;
      // Ajustamos el zoom para ver la ruta completa
      this.zoom = 11;
      this.center = { lat: 42.95, lng: -8.45 }; 
    }
  }

  cambiarTab(nuevaTab: 'puntos' | 'rutas') {
    this.tabActual = nuevaTab;
    this.enclaveSeleccionado = null;
    
    // Si volvemos a puntos, solemos querer limpiar la ruta del mapa
    if (nuevaTab === 'puntos') {
      this.rutaSeleccionadaUrl = null;
    }
  }

  limpiar(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  cargarEnclaves() {
    this.http.get<any>('https://mapa.viaverdectl.gal/api/v1/enclaves')
      .subscribe({
        next: (respuesta) => {
          this.listaEnclaves = respuesta.data.map((item: any) => ({
            id: item.id.toString(),
            nombre: item.name,
            latitud: parseFloat(item.locations?.[0]?.coords?.latitude || '42.88'),
            longitud: parseFloat(item.locations?.[0]?.coords?.longitude || '-8.53'),
            imagen: item.cover_image?.url || 'https://via.placeholder.com/400x250',
            direccion: item.locations?.[0]?.address || 'Dirección no disponible',
            catAPI: this.limpiar(item.category?.name),
            ayunAPI: this.limpiar(item.locations?.[0]?.municipality?.name)
          }));

          const params = new URLSearchParams(window.location.search);
          const idUrl = params.get('id');
          if (idUrl) {
            const sitio = this.listaEnclaves.find(p => p.id === idUrl);
            if (sitio) {
              this.enclaveSeleccionado = sitio;
              this.center = { lat: sitio.latitud, lng: sitio.longitud };
              this.zoom = 17;
            }
          }
          this.listaFiltrada = [...this.listaEnclaves];
          this.cdr.detectChanges();
        }
      });
  }

  toggleCategoria(cat: string, checked: boolean) {
    const valor = this.limpiar(cat);
    if (checked) this.categoriasSeleccionadas.add(valor);
    else this.categoriasSeleccionadas.delete(valor);
    this.aplicarFiltros();
  }

  toggleAyuntamiento(ayun: string, checked: boolean) {
    const valor = this.limpiar(ayun);
    if (checked) this.ayuntamientosSeleccionados.add(valor);
    else this.ayuntamientosSeleccionados.delete(valor);
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.listaFiltrada = this.listaEnclaves.filter(punto => {
      const coincideCat = this.categoriasSeleccionadas.size === 0 || this.categoriasSeleccionadas.has(punto.catAPI);
      const coincideAyun = this.ayuntamientosSeleccionados.size === 0 || this.ayuntamientosSeleccionados.has(punto.ayunAPI);
      return coincideCat && coincideAyun;
    });

    if (this.listaFiltrada.length > 0 && !this.enclaveSeleccionado) {
      this.center = { lat: this.listaFiltrada[0].latitud, lng: this.listaFiltrada[0].longitud };
    }
    this.cdr.detectChanges();
  }
  volverALista() {
    this.enclaveSeleccionado = null;
    this.zoom = 12;
    this.center = { lat: 42.88, lng: -8.53 };
    window.history.replaceState({}, '', window.location.pathname);
  }

  copiarLink(punto: any, event: Event) {
    event.stopPropagation();
    const url = window.location.origin + window.location.pathname + '?id=' + punto.id;
    navigator.clipboard.writeText(url).then(() => alert('Enlace copiado.'));
  }

  abrirEnGoogleMaps(punto: any, event: Event) {
    event.stopPropagation();
    const query = encodeURIComponent(`${punto.nombre}, ${punto.latitud},${punto.longitud}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }
}