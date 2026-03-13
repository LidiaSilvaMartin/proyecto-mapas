import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnclaveService } from '../../../core/services/enclave.service';
import { MiPunto } from '../../../core/interface/enclave.interface';

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


//Cuando el usuario hace clic en un elemento de la EnclaveList,
//esta llama a una funcion del servicio que actualiza otra Signal:
// enclaveSeleccionado

//se actualizan automaticamente porque
//Map y EnclaveDetail están vigilando esa Signal