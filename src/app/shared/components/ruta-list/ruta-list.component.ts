import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaService } from '../../../core/services/ruta.service';

@Component({
  selector: 'app-ruta-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ruta-list.component.html',
  styleUrl: './ruta-list.component.css'
})
export class RutaListComponent {
  public rutaSvc = inject(RutaService);
}