import type { EstadoPedido, FormaPago, IPedido } from '../types/pedido';
import type { ICartItem } from '../types/product';
import { decrementStockBatch } from '../data/data';
import { clearCart } from './cart';

const ORDERS_KEY = 'foodstore_orders';

export function getAllOrders(): IPedido[] {
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as IPedido[];
    return parsed.filter((o) => !o.eliminado);
  } catch {
    return [];
  }
}

export function getOrdersByUser(userId: string): IPedido[] {
  return getAllOrders().filter((o) => o.usuarioId === userId);
}

export function createOrderFromCart(
  cart: ICartItem[],
  user: { id: string; email: string },
  formaPago: FormaPago
): { ok: boolean; order?: IPedido; error?: string } {
  if (cart.length === 0) {
    return { ok: false, error: 'El carrito está vacío.' };
  }

  const stockCheck = decrementStockBatch(
    cart.map((item) => ({ productId: item.producto.id, cantidad: item.cantidad }))
  );
  if (!stockCheck.ok) {
    return { ok: false, error: stockCheck.error || 'No se pudo descontar el stock.' };
  }

  const detalles = cart.map((item) => ({
    productoId: item.producto.id,
    nombreProducto: item.producto.nombre,
    precioUnitario: item.producto.precio,
    cantidad: item.cantidad,
    subtotal: item.producto.precio * item.cantidad,
  }));

  const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

  const newOrder: IPedido = {
    id: `PED-${Date.now().toString().slice(-6)}`,
    fecha: new Date().toISOString().split('T')[0],
    usuarioId: user.id,
    usuarioEmail: user.email,
    estado: 'PENDIENTE',
    formaPago,
    detalles,
    total,
    eliminado: false,
  };

  const raw = localStorage.getItem(ORDERS_KEY);
  const all: IPedido[] = raw ? (JSON.parse(raw) as IPedido[]) : [];
  all.unshift(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  clearCart();

  return { ok: true, order: newOrder };
}

export function updateOrderStatus(orderId: string, estado: EstadoPedido): void {
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) return;
  const all: IPedido[] = JSON.parse(raw) as IPedido[];
  const updated = all.map((o) => (o.id === orderId ? { ...o, estado } : o));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
}