
//Hace la petición HTTP. Los datos se transforman 
// y se guardan en una Signal que es enclaves

//Los componentes Sidebar y Map estan contectados a esa Signal
//No necesitan pedir los datos, solo los miran.


//en este archivo se sabe de donde vienen los datos y como se manipulan
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AjaxData } from '../interface/ajax-data.interface';
import { EnclaveData, MiPunto } from '../interface/enclave.interface';


//toSignal ejecuta la petición HTTP y guarda el resultado.
//cualquier cambio notifica a los componentes.

@Injectable({
  providedIn: 'root'
})
export class EnclaveService {
  private http = inject(HttpClient);
  private router = inject(Router);


  public enclaves = toSignal(
    this.http.get<AjaxData<EnclaveData[]>>("https://mapa.viaverdectl.gal/api/v1/enclaves").pipe(
      map(res => res.data.map(item => this.normalizarEnclave(item)))
    ),
    { initialValue: [] as MiPunto[] }
  )
  //Guardamos que punto esta seleccionado mediante signal, que es como una caja que guarda el punto que clickas.
  public enclaveSeleccionado = signal<MiPunto | null>(null);
  //empieza en null porque al abrir la web no hay nada clicado.


  private normalizarEnclave(item: EnclaveData): MiPunto {
    const loc = item.locations?.[0];
    return {
      id: item.slug || item.name.toLowerCase().trim().replace(/\s+/g, '-'),
      name: item.name,
      latitude: parseFloat(loc?.coords?.latitude || '42.88'),
      longitude: parseFloat(loc?.coords?.longitude || '-8.53'),
      image: item.cover_image?.url || 'https://via.placeholder.com/400x250',
      address: loc?.address || 'Dirección no disponible',
      horarios: item.schedule || []
    };
  }

  //.pipe(map): es como un tunel que coge el JSON bruto de la API 
  //y lo convierte en objetos "MiPunto".

  //Metodo que permite a los componentes cambiar el estado global de la app
  seleccionarEnclave(punto: MiPunto | null) {
    this.enclaveSeleccionado.set(punto);
    if (punto) {
      // Al clicar: http://localhost:4200/mapa/enclaves/nombre-del-sitio
      this.router.navigate(['/mapa/enclaves', punto.id]);
    } else {
      // Al cerrar: http://localhost:4200/mapa/enclaves
      this.router.navigate(['/mapa/enclaves']);
    }
  }

  //Abrir "como llegar" en google maps 
  abrirEnGoogleMaps(punto: MiPunto) {
    const coords = `${punto.latitude},${punto.longitude}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${coords}`, '_blank');
  }

  copiarLink(punto: MiPunto) {
    const url = `${window.location.origin}/mapa/enclaves/${punto.id}`;
    navigator.clipboard.writeText(url).then(() => alert('Enlace copiado al portapapeles.'));
  }

  //funcion para conseguir el horario del sitio abierto o cerrado
  getEstadoHorario(horarios: any[]) {
   if (!horarios || horarios.length === 0) return { abierto: false, mensaje: 'Horario no disponible' };

  const ahora = new Date();
  const diaHoy = ahora.getDay() === 0 ? 7 : ahora.getDay(); // Viernes = 5

  // 1. Buscamos el horario de hoy. 
  // Usamos Number() porque en tu consola vimos que a veces vienen como strings.
  const hoy = horarios.find(h => Number(h.day) === diaHoy);

  // 2. Si no hay datos para hoy, o la API dice explícitamente que está cerrado
  if (!hoy || hoy.is_closed === true || hoy.is_closed === 1) {
    return { abierto: false, mensaje: 'Cerrado por descanso o temporada' };
  }

  // 3. Intentamos sacar las horas del primer turno (first_shift)
  let opening = '';
  let closing = '';

  if (hoy.first_shift && hoy.first_shift.opening && hoy.first_shift.closing) {
    opening = hoy.first_shift.opening;
    closing = hoy.first_shift.closing;
  } else if (hoy.opening && hoy.closing) {
    // Por si acaso algunos vienen sin 'first_shift'
    opening = hoy.opening;
    closing = hoy.closing;
  }

  // 4. Si no hemos encontrado horas válidas
  if (!opening || !closing) {
    return { abierto: false, mensaje: 'Cerrado hoy (sin horario definido)' };
  }

  // 5. Comparación final
  const actual = ahora.getHours() * 100 + ahora.getMinutes();
  const abre = parseInt(opening.replace(/:/g, '').substring(0, 4), 10);
  const cierre = parseInt(closing.replace(/:/g, '').substring(0, 4), 10);

  if (actual >= abre && actual < cierre) {
    return { abierto: true, mensaje: `Abierto. Cierra a las ${closing.substring(0, 5)}` };
  } else if (actual < abre) {
    return { abierto: false, mensaje: `Cerrado. Abre a las ${opening.substring(0, 5)}` };
  } else {
    return { abierto: false, mensaje: 'Cerrado por hoy' };
  }
}
}