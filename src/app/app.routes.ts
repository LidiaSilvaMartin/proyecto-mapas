import { Routes } from '@angular/router';
import { MapaPageComponent } from './features/mapa-page/mapa-page.component';

export const routes: Routes = [

    //al abrir la web, te manda directamente a mapa/enclaves
    { path: '', redirectTo: 'mapa', pathMatch: 'full'},
    { path: 'mapa', 
      component: MapaPageComponent, 
    children: [
       
        { path: '', redirectTo: 'enclaves', pathMatch: 'full'},
        //parte de enclaves
       { path: 'enclaves', component: MapaPageComponent }, //listado
       { path: 'enclaves/:slug', component: MapaPageComponent }, //detalle de un sitio

       //parte de rutas
       { path: 'rutas', component: MapaPageComponent},
       { path: 'rutas/:slugRuta', component: MapaPageComponent} //una ruta concreta
    ]
    }
];
