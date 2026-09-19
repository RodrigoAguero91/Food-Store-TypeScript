export interface IProduct {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  descripcion?: string;
}

export interface ICartItem {
  producto: IProduct;
  cantidad: number;
}