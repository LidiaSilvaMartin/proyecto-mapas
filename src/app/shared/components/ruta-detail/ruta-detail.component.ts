import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaService } from '../../../core/services/ruta.service';

@Component({
  selector: 'app-ruta-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ruta-detail.component.html',
  styleUrl: './ruta-detail.component.css'
})
export class RutaDetailComponent {
  public rutaSvc = inject(RutaService);
}