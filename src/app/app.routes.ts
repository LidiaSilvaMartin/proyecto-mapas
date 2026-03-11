import { Routes } from '@angular/router';
import { MapaPageComponent } from './features/mapa-page/mapa-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'mapa', pathMatch: 'full'},
    { path: 'mapa', component: MapaPageComponent }
];
