import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MiPunto, ViaVerde } from '../models/enclave.model';

@Injectable({
  providedIn: 'root'
})
export class EnclaveService {
  private http = inject(HttpClient);

//Guardado de lista de puntos
  private _enclaves = new BehaviorSubject<MiPunto[]>([]);
  enclaves$ = this._enclaves.asObservable();

  //Guardamos que punto esta seleccionado
  private _enclaveSeleccionado = new BehaviorSubject<MiPunto | null>(null);
  enclaveSeleccionado$ = this._enclaveSeleccionado.asObservable();

 //Pide los datos a la API y los transforma al formato MiPunto
  cargarEnclaves() {
    this.http.get<ViaVerde>('https://mapa.viaverdectl.gal/api/v1/enclaves')
      .pipe(
        map(res => res.data.map(item => ({
          id: item.id.toString(),
          nombre: item.name,
          latitud: parseFloat(item.locations?.[0]?.coords?.latitude || '42.88'),
          longitud: parseFloat(item.locations?.[0]?.coords?.longitude || '-8.53'),
          imagen: item.cover_image?.url || 'https://via.placeholder.com/400x250',
          direccion: item.locations?.[0]?.address || 'Dirección no disponible',
        })))
      )
      .subscribe(datos => {
        this._enclaves.next(datos);
      });
  }

   //Cambia el punto seleccionado
  seleccionarEnclave(punto: MiPunto | null) {
    this._enclaveSeleccionado.next(punto);
  }

  abrirEnGoogleMaps(punto:MiPunto) {
   const query = encodeURIComponent(`${punto.latitud},${punto.longitud}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`);
  }

  copiarLink(punto: MiPunto) {
    const url = `${window.location.origin}${window.location.pathname}?id=${punto.id}`;
    navigator.clipboard.writeText(url).then(() => alert('Enlace copiado al portapapeles.'));
  }

}