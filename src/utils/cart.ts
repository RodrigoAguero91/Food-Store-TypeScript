import type { ICartItem, IProduct } from '../types/product';

const CART_KEY = 'cart';

export const getCart = (): ICartItem[] => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: ICartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: IProduct): void => {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.producto.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].cantidad += 1;
  } else {
    cart.push({ producto: product, cantidad: 1 });
  }

  saveCart(cart);
};

export const updateQuantity = (productId: number, quantity: number): void => {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(item => item.producto.id !== productId);
  } else {
    const item = cart.find(i => i.producto.id === productId);
    if (item) {
      item.cantidad = quantity;
    }
  }
  saveCart(cart);
};

export const calculateTotal = (): number => {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
};