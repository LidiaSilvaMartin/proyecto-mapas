
//lo que uso internamente para el sidebar y mapa
export interface Ruta{
    id: string;
    name: string;
    description?: string;
    image: string;
    distance?: string;
    difficulty?: string;
    itinerario?: string[]; //array de nombres de sitios por los que pasa
    kmlUrl?: string;
}

export interface RutaData {
    id:number;
    name: string;
    slug?: string;
    description?: string;
    cover_image?: {
        url:string;
    };
    kml_file?: {
        url:string;
    };
    itinerary?: any[];
    distance?:string;
    difficulty?:string;
}