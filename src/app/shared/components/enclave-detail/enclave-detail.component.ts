import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnclaveService } from '../../../core/services/enclave.service';
import { MiPunto } from '../../../core/interface/enclave.interface';

console.log('EL SERVICIO SE HA CARGADO CORRECTAMENTE');

@Component({
  selector: 'app-enclave-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enclave-detail.component.html',
  styleUrls: ['./enclave-detail.component.css']
})
export class EnclaveDetailComponent {
  @Input() punto!: MiPunto;
  public enclaveSvc = inject(EnclaveService);


  ngOnChanges(){
    console.log('!El componente de detalle ha recibido datos!', this.punto);
  }

  info() {
    return this.enclaveSvc.getEstadoHorario(this.punto.horarios);
  }
}
