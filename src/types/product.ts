export interface IProduct {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  descripcion?: string;
  stock: number;
  disponible: boolean;
  eliminado: boolean;
  createdAt: string;
}

export interface ICartItem {
  producto: IProduct;
  cantidad: number;
}