import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-mapa-page',
  standalone: true,
  imports: [SidebarComponent, MapComponent],
  template: `
    <aside class="sidebar">
      <app-sidebar></app-sidebar>
    </aside>
    <main class="map-container">
      <app-map></app-map>
    </main>
  `,
  styleUrls: ['./mapa-page.component.css'] 
})
export class MapaPageComponent {}