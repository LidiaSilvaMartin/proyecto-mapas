import { Component, inject, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { EnclaveService } from './core/services/enclave.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],

})

export class AppComponent {
  private enclaveSvc = inject(EnclaveService); 
    
  }



