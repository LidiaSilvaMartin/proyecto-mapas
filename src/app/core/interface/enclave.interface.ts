//Interfaz para lo que recibo de la API
//mapea la respuesta exacta de la api
//de los nombres de campos que vienen del servidor
export interface EnclaveData {
    id: number;
    name: string;
    slug?: string;
    schedule: any[];
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
}

//Mi interfaz, la que uso en el codigo
//el objeto que uso internamente 
export interface MiPunto {
  id:string;
  name: string;
  latitude: number;
  longitude: number;
  image:string;
  address:string;
  horarios:any[];
}
