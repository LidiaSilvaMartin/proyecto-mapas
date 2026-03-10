import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

import { ViaVerde, MiPunto } from './enclave.model';
  
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, HttpClientModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;

  private http = inject(HttpClient);

  //Configuración inicial
  zoom = 17;
  center: google.maps.LatLngLiteral = { lat: 42.87337, lng: -8.52414 }; 
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    maxZoom: 18,
    minZoom: 8,
  };
  
  puntoApi: any = null; 

  // COORDENADAS EN BRUTO: Parque del Lago
  puntoManual = {
    position: { lat: 42.87337, lng: -8.52414 },
    title: 'Parque del Lago (Marcador Fijo)'
  };

  markers: any[] = [];  
  infoContent = '';

  ngOnInit() {
    // Establecemos el centro en el Lago nada más arrancar
    this.center = this.puntoManual.position;
    this.zoom = 17;

    this.cargarPuntoApi();
  }

cargarPuntoApi() {
  this.http.get<ViaVerde>('https://mapa.viaverdectl.gal/api/v1/enclaves')
    .subscribe(respuesta => {
      // Extraemos los datos de la API
      const item = respuesta.data[0]; 
      const coords = item.locations[0].coords;

      // Uso mi interfaz para guardar el punto
      const nuevoEnclave: MiPunto = {
        nombre: item.name,
        latitud: parseFloat(coords.latitude),
        longitud: parseFloat(coords.longitude)
      };

      this.puntoApi = {
        position: { lat: nuevoEnclave.latitud, lng: nuevoEnclave.longitud },
        title: nuevoEnclave.nombre
      };
      
      console.log('Enclave cargado usando interfaces:', nuevoEnclave);
    });
}

  zoomIn() {
    if (this.zoom < (this.options.maxZoom ?? 18)) this.zoom++;
  }

  zoomOut() {
    if (this.zoom > (this.options.minZoom ?? 8)) this.zoom--;
  }

  click(event: any) {
    console.log(event);
  }

  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()));
  }

  addMarker() {
    this.markers.push({
      position: {
        lat: this.center.lat + ((Math.random() - 0.5) * 2) / 100,
        lng: this.center.lng + ((Math.random() - 0.5) * 2) / 100,
      },
      label: { color: 'white', text: 'M' },
      title: 'Marcador manual',
      info: 'Punto creado con el botón',
      options: { animation: google.maps.Animation.BOUNCE },
    });
  }

  //eliminar los marcadores aleatorios
  limpiarMarcadores() {
    this.markers = [];
}
  openInfo(marker: MapMarker, content: any) {
    this.infoContent = content;
    this.info.open(marker);
  }
}