import type { ICartItem, IProduct } from '../types/product';

const CART_KEY = 'cart';

export const getCart = (): ICartItem[] => {
  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as ICartItem[];
  } catch {
    return [];
  }
};

export const saveCart = (cart: ICartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: IProduct): { ok: boolean; message: string } => {
  if (product.eliminado || !product.disponible || product.stock <= 0) {
    return { ok: false, message: `"${product.nombre}" no está disponible o no tiene stock.` };
  }

  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.producto.id === product.id);
  const currentQty = existingIndex > -1 ? cart[existingIndex].cantidad : 0;

  if (currentQty + 1 > product.stock) {
    return {
      ok: false,
      message: `No hay más stock disponible de "${product.nombre}" (máximo: ${product.stock}).`,
    };
  }

  if (existingIndex > -1) {
    cart[existingIndex].cantidad += 1;
  } else {
    cart.push({ producto: product, cantidad: 1 });
  }

  saveCart(cart);
  return { ok: true, message: `¡${product.nombre} agregado al carrito!` };
};

export const updateQuantity = (productId: number, quantity: number): void => {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((item) => item.producto.id !== productId);
  } else {
    const item = cart.find((i) => i.producto.id === productId);
    if (item) {
      const maxStock = item.producto.stock > 0 ? item.producto.stock : quantity;
      item.cantidad = Math.min(quantity, maxStock);
    }
  }
  saveCart(cart);
};

export const removeFromCart = (productId: number): void => {
  const cart = getCart().filter((item) => item.producto.id !== productId);
  saveCart(cart);
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const calculateTotal = (): number => {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
};