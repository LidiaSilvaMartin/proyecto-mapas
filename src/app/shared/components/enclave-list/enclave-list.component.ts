import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnclaveService } from '../../../core/services/enclave.service';
import { MiPunto } from '../../../core/models/enclave.model';

@Component({
  selector: 'app-enclave-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enclave-list.component.html',
  styleUrls: ['./enclave-list.component.css']
})
export class EnclaveListComponent {
  @Input() puntos: MiPunto[] | null = [];
  public enclaveSvc = inject(EnclaveService);
}