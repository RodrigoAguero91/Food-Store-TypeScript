import type { IUser } from '../types/IUser';
import type { EstadoPedido, FormaPago, IDetallePedido, IPedido } from '../types/pedido';
import type { Rol } from '../types/Rol';
import usuariosJson from './usuarios.json';
import pedidosJson from './pedidos.json';

const USERS_SEED_KEY = 'foodstore_seed_users';
const ORDERS_SEED_KEY = 'foodstore_seed_orders';

interface UsuarioJsonItem {
  id: number | string;
  nombre?: string;
  apellido?: string;
  mail?: string;
  email?: string;
  celular?: string;
  rol: Rol | string;
  password?: string;
  eliminado?: boolean;
}

interface PedidoDetalleJsonItem {
  cantidad: number;
  subtotal: number;
  producto: {
    id: number;
    nombre: string;
    precio: number;
  };
}

interface PedidoJsonItem {
  id: number | string;
  fecha: string;
  estado: string;
  total: number;
  formaPago: FormaPago | string;
  detalles: PedidoDetalleJsonItem[];
  eliminado?: boolean;
  usuarioDto?: {
    id: number | string;
    nombre?: string;
    apellido?: string;
    mail?: string;
    email?: string;
    celular?: string;
    rol?: Rol | string;
  };
}

function normalizeEstado(estado: string): EstadoPedido {
  switch (estado.toUpperCase()) {
    case 'PENDIENTE':
      return 'PENDIENTE';
    case 'CONFIRMADO':
    case 'EN_PREPARACION':
      return 'CONFIRMADO';
    case 'TERMINADO':
    case 'ENTREGADO':
      return 'TERMINADO';
    case 'CANCELADO':
      return 'CANCELADO';
    default:
      return 'PENDIENTE';
  }
}

function normalizeFormaPago(formaPago: string): FormaPago {
  switch (formaPago.toUpperCase()) {
    case 'TARJETA':
      return 'TARJETA';
    case 'TRANSFERENCIA':
      return 'TRANSFERENCIA';
    case 'EFECTIVO':
    default:
      return 'EFECTIVO';
  }
}

export function getSeedUsers(): IUser[] {
  const raw = localStorage.getItem(USERS_SEED_KEY);
  if (!raw) {
    const initial: IUser[] = (usuariosJson as UsuarioJsonItem[]).map((u) => ({
      id: String(u.id),
      nombre: u.nombre,
      apellido: u.apellido,
      email: (u.email ?? u.mail ?? '').trim(),
      celular: u.celular,
      password: u.password ?? '',
      rol: u.rol as Rol,
      eliminado: u.eliminado ?? false,
    }));
    localStorage.setItem(USERS_SEED_KEY, JSON.stringify(initial));
    return initial.filter((u) => !u.eliminado);
  }

  try {
    const parsed = JSON.parse(raw) as IUser[];
    return parsed.filter((u) => !u.eliminado);
  } catch {
    return [];
  }
}

export function getSeedOrders(): IPedido[] {
  const raw = localStorage.getItem(ORDERS_SEED_KEY);
  if (!raw) {
    const users = getSeedUsers();
    const initial: IPedido[] = (pedidosJson as PedidoJsonItem[]).map((p) => {
      const dto = p.usuarioDto;
      const matchedUser = users.find(
        (u) =>
          String(u.id) === String(dto?.id ?? '') ||
          u.email.toLowerCase() === (dto?.email ?? dto?.mail ?? '').toLowerCase()
      );

      const usuarioId = matchedUser?.id ?? (dto?.id !== undefined ? String(dto.id) : '');
      const usuarioEmail = matchedUser?.email ?? dto?.email ?? dto?.mail ?? '';

      const detalles: IDetallePedido[] = (p.detalles ?? []).map((d) => ({
        productoId: d.producto.id,
        nombreProducto: d.producto.nombre,
        precioUnitario: d.producto.precio,
        cantidad: d.cantidad,
        subtotal: d.subtotal,
      }));

      return {
        id: String(p.id),
        fecha: p.fecha,
        usuarioId,
        usuarioEmail,
        estado: normalizeEstado(p.estado),
        formaPago: normalizeFormaPago(p.formaPago),
        detalles,
        total: p.total,
        eliminado: p.eliminado ?? false,
      };
    });

    localStorage.setItem(ORDERS_SEED_KEY, JSON.stringify(initial));
    return initial.filter((p) => !p.eliminado);
  }

  try {
    const parsed = JSON.parse(raw) as IPedido[];
    return parsed.filter((p) => !p.eliminado);
  } catch {
    return [];
  }
}