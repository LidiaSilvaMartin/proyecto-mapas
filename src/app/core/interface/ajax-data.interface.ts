export interface AjaxData<T = any> {
  message: string;
  data: T;
  error?: Error;
}

export interface AjaxOptions {
  headers?: { [header: string]: string | string[] };
  params?: { [param: string]: string | string[] };
  skipNormalize?: boolean; // Si es true, devuelve la respuesta tal cual sin normalizar
}

export interface Error {
  message: string;
  error_code: number;
  validation_errors: { [key: string]: string[] };
}
