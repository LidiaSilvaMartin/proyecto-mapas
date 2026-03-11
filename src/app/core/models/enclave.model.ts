//Interfaz para lo que recibo de la API
export interface ViaVerde {
  data: Array<{
    id: number;
    name: string;
    cover_image?: {
      url:string;
    };
    locations: Array<{
      coords: {
        latitude: string;
        longitude: string;
      };
      address?: string;
      municipality?: {
        name: string
      };
    }>;
    category?: {
      name: string
    };
  }>;
}

//Mi interfaz, la que uso en el codigo
export interface MiPunto {
  id:string;
  nombre: string;
  latitud: number;
  longitud: number;
  imagen:string;
  direccion:string;
}

export interface Ruta {
  id: string;
  nombre: string;
  kml: string;
  imagen: string;
}