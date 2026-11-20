export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'TERMINADO' | 'CANCELADO';
export type FormaPago = 'TARJETA' | 'TRANSFERENCIA' | 'EFECTIVO';

export interface IDetallePedido {
  productoId: number;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface IPedido {
  id: string;
  fecha: string;
  usuarioId: string;
  usuarioEmail: string;
  estado: EstadoPedido;
  formaPago: FormaPago;
  detalles: IDetallePedido[];
  total: number;
  eliminado: boolean;
}