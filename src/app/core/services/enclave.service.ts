
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
  private http = inject(HttpClient); //para hacer peticiones HTTP
  private router = inject(Router); //para movernos entre rutas

//enclaves es una signal que tiene la lista de todos los puntos
  public enclaves = toSignal(
    this.http.get<AjaxData<EnclaveData[]>>("https://mapa.viaverdectl.gal/api/v1/enclaves").pipe(
   //Transformamos la respuesta, mapeamos cada item de la API a nuestro formato "MiPunto"
      map(res => res.data.map(item => this.normalizarEnclave(item)))
    ),
    { initialValue: [] as MiPunto[] } //valor inicial vacio mientras carga la api
  )
  //Guardamos que punto esta seleccionado mediante signal, que es como una caja que guarda el punto que clickas.
  public enclaveSeleccionado = signal<MiPunto | null>(null);
  //empieza en null porque al abrir la web no hay nada clicado.


  private normalizarEnclave(item: EnclaveData): MiPunto {
    const loc = item.locations?.[0]; //coge la primera ubi de la lista que trae el item
    return {
      //si no hay slug, creamos un ID basado en el nombre (limpiando espacios y poniendo guiones)
      id: item.slug || item.name.toLowerCase().trim().replace(/\s+/g, '-'),
      name: item.name, //nombre del sitio
      latitude: parseFloat(loc?.coords?.latitude || '42.88'), //convertir texto a numero decimal
      longitude: parseFloat(loc?.coords?.longitude || '-8.53'), //coordenadas por defecto si fallan
      image: item.cover_image?.url || 'https://via.placeholder.com/400x250', //foto
      address: loc?.address || 'Dirección no disponible',
      horarios: item.schedule || [] //lista de horarios
    };
  }

  //.pipe(map): es como un tunel que coge el JSON bruto de la API 
  //y lo convierte en objetos "MiPunto".

  //Se ejecuta cuando haces clic en un punto de la lista o un marcador
  seleccionarEnclave(punto: MiPunto | null) {
    this.enclaveSeleccionado.set(punto); //actualizamos la signal con el nuevo punto
    if (punto) {
      // Al clicar: http://localhost:4200/mapa/enclaves/nombre-del-sitio
      this.router.navigate(['/mapa/enclaves', punto.id]);
    } else {
      // Al cerrar: http://localhost:4200/mapa/enclaves, volvemos a la lista general
      this.router.navigate(['/mapa/enclaves']);
    }
  }

  //Abrir "como llegar" en google maps 
  abrirEnGoogleMaps(punto: MiPunto) {
    const coords = `${punto.latitude},${punto.longitude}`; //preparamos la longitud y latitud
    window.open(`https://www.google.com/maps/search/?api=1&query=${coords}`, '_blank');
  }

  copiarLink(punto: MiPunto) {
    const url = `${window.location.origin}/mapa/enclaves/${punto.id}`;

    navigator.clipboard.writeText(url).then(() => alert('Enlace listo para compartir')).catch(err => {
      console.error('Error al copiar el enlace: ', err);
    });

  }

  //funcion para conseguir el horario del sitio abierto o cerrado
  getEstadoHorario(horarios: any[]) {

    //si no hay horarios, devolvemos un mensaje de error

    if (!horarios || horarios.length === 0) {
      return { abierto: false, mensaje: 'Horario no disponible' };
    }

    const ahora = new Date(); //fecha y hora actual del ordenador
    // Domingo es 0 en JS, la API parece usar 7 para domingo, 4 para Jueves (Thu), etc.
    const diaSemanaActual = ahora.getDay() === 0 ? 7 : ahora.getDay();

    //Buscamos el horario que coincida con el dia de hoy
    const hoy = horarios.find(h => h.day?.id === diaSemanaActual);

    //si no encontramos el dia, decimos que esta cerrado
    if (!hoy) {
      return { abierto: false, mensaje: 'Cerrado hoy' };
    }

    //Función para extraer solo la hora "13:00" de una cadena "2026-01-19 13:00:00"
    // y convertirla a minutos totales
    const extraerMinutos = (fechaStr: string | undefined) => {
      if (!fechaStr) return -1;
      const horaParte = fechaStr.split(' ')[1]; // Nos quedamos con "13:00:00"
      const [hrs, mins] = horaParte.split(':').map(Number); //sacamos horas y minutos como numeros
      return hrs * 60 + mins;
    };

    const actual = ahora.getHours() * 60 + ahora.getMinutes(); //hora actual en minutos totales

    //Calculamos los minutos de apertura y cierre de los dos turnos
    const abre1 = extraerMinutos(hoy.first_shift?.open);
    const cierra1 = extraerMinutos(hoy.first_shift?.close);
    const abre2 = extraerMinutos(hoy.second_shift?.open);
    const cierra2 = extraerMinutos(hoy.second_shift?.close);

    //Si el momento actual esta dentro del turno 1 0  dentro del turno 2, esta abierto
    if ((actual >= abre1 && actual < cierra1) || (actual >= abre2 && actual < cierra2)) {
      return { abierto: true, mensaje: 'Abierto ahora' };
    }

    //si aun no ha llegado la hora de abrir el primer turno
    if (abre1 !== -1 && actual < abre1) {
      return { abierto: false, mensaje: `Cerrado (Abre a las ${hoy.first_shift.open.split(' ')[1].substring(0, 5)})` };
    }

    //si estamos en el descanso entre el turno de mañana y tarde
    if (abre2 !== -1 && actual > cierra1 && actual < abre2) {
      return { abierto: false, mensaje: `Cerrado (Vuelve a abrir a las ${hoy.second_shift.open.split(' ')[1].substring(0, 5)})` };
    }

    //si ya ha pasado la hora de cierre del ultimo turno
    return { abierto: false, mensaje: 'Cerrado por hoy' };
  }
}