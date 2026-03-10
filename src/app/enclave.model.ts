//Interfaz para lo que recibo de la API
export interface ViaVerde {
  data: Array<{
    name: string;
    locations: Array<{
      coords: {
        latitude: string;
        longitude: string;
      }
    }>
  }>;
}

//Mi interfaz, la que uso en el codigo
export interface MiPunto {
  nombre: string;
  latitud: number;
  longitud: number;
}