import { Component, Input, inject, effect } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MapComponent } from '../map/map.component';
import { EnclaveService } from '../../core/services/enclave.service'
import { RutaService } from '../../core/services/ruta.service';

@Component({
  selector: 'app-mapa-page',
  standalone: true,
  imports: [SidebarComponent, MapComponent],
  templateUrl: './mapa-page.component.html',
  styleUrls: ['./mapa-page.component.css']
})
export class MapaPageComponent {

  private rutaSvc = inject(RutaService);
  private enclaveSvc = inject(EnclaveService);

  @Input() slug!: string;
  @Input() slugRuta!: string;


  constructor() {
    effect(() => {
      const valor = this.slug;
      const puntos = this.enclaveSvc.enclaves();

      if (valor && puntos.length > 0) {
        const encontrado = puntos.find(p => p.id === valor);
        if (encontrado) {
          this.enclaveSvc.enclaveSeleccionado.set(encontrado);
        }
      }
    });


    // 1. Este @Input recibe automáticamente el ":id" de la URL 
    // (Funciona gracias al withComponentInputBinding que pusimos en app.config)

    // 2. Usamos un effect para esperar a que los datos lleguen de la API.
    // Cuando la lista de enclaves tenga datos, buscamos el que coincida con el ID de la URL.

    // EFECTO PARA RUTAS
    effect(() => {
      const valorRuta = this.slugRuta; // Escuchamos el input de la ruta
      const listaRutas = this.rutaSvc.rutas(); // Escuchamos el signal de rutas

      if (valorRuta && listaRutas.length > 0) {
        const encontrada = listaRutas.find(r => r.id === valorRuta);
        if (encontrada) {
          this.rutaSvc.rutaSeleccionada.set(encontrada);
        }
      }
    });
  }
}

//esto serviria para organizar los dos componentes hijos
//SidebarComponent y MapComponent
