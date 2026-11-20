import { getCart, updateQuantity, removeFromCart, clearCart, calculateTotal } from '../../../utils/cart';
import { createOrderFromCart } from '../../../utils/orders';
import { getSessionUser, logout } from '../../../utils/auth';
import { protectRoute, replaceRoute } from '../../../utils/navigate';
import type { FormaPago } from '../../../types/pedido';

if (!protectRoute(false)) {
  throw new Error('Acceso no autorizado');
}

const cartContainer = document.getElementById('cart-container') as HTMLDivElement;
const cartSummary = document.getElementById('cart-summary') as HTMLDivElement;
const cartTotalSpan = document.getElementById('cart-total') as HTMLSpanElement;
const formaPagoSelect = document.getElementById('forma-pago') as HTMLSelectElement;
const btnCheckout = document.getElementById('btn-checkout') as HTMLButtonElement;
const btnClearCart = document.getElementById('btn-clear-cart') as HTMLButtonElement;
const userInfoSpan = document.getElementById('user-info') as HTMLSpanElement | null;
const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement | null;

const currentUser = getSessionUser();
if (userInfoSpan && currentUser) {
  userInfoSpan.textContent = currentUser.nombre || currentUser.email;
}

function renderCart() {
  const cart = getCart();
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Tu carrito está vacío. <a href="../home/home.html">Ir al catálogo</a></p>';
    cartSummary.style.display = 'none';
    return;
  }

  cartSummary.style.display = 'block';
  cartTotalSpan.textContent = calculateTotal().toFixed(2);

  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-row';

    row.innerHTML = `
      <div>
        <h4>${item.producto.nombre}</h4>
        <p class="muted">Precio unitario: $${item.producto.precio.toFixed(2)} | Stock: ${item.producto.stock}</p>
      </div>
      <div class="cart-row-controls">
        <button type="button" class="btn-qty btn-decrease" data-id="${item.producto.id}">-</button>
        <span>${item.cantidad}</span>
        <button type="button" class="btn-qty btn-increase" data-id="${item.producto.id}">+</button>
        <p class="subtotal">$${(item.producto.precio * item.cantidad).toFixed(2)}</p>
        <button type="button" class="btn-remove" data-id="${item.producto.id}">Eliminar</button>
      </div>
    `;

    const decBtn = row.querySelector('.btn-decrease') as HTMLButtonElement;
    const incBtn = row.querySelector('.btn-increase') as HTMLButtonElement;
    const remBtn = row.querySelector('.btn-remove') as HTMLButtonElement;

    decBtn.addEventListener('click', () => {
      updateQuantity(item.producto.id, item.cantidad - 1);
      renderCart();
    });

    incBtn.addEventListener('click', () => {
      updateQuantity(item.producto.id, item.cantidad + 1);
      renderCart();
    });

    remBtn.addEventListener('click', () => {
      removeFromCart(item.producto.id);
      renderCart();
    });

    cartContainer.appendChild(row);
  });
}

btnClearCart.addEventListener('click', () => {
  clearCart();
  renderCart();
});

btnCheckout.addEventListener('click', () => {
  const user = getSessionUser();
  if (!user) {
    alert('Debés iniciar sesión para confirmar un pedido.');
    replaceRoute('src/pages/auth/login/index.html');
    return;
  }

  const cart = getCart();
  const formaPago = formaPagoSelect.value as FormaPago;
  const result = createOrderFromCart(cart, { id: user.id, email: user.email }, formaPago);

  if (!result.ok || !result.order) {
    alert(result.error || 'No se pudo confirmar el pedido.');
    renderCart();
    return;
  }

  alert(`¡Pedido ${result.order.id} confirmado! Total: $${result.order.total.toFixed(2)}`);
  replaceRoute('src/pages/client/orders/orders.html');
});

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    logout();
    replaceRoute('src/pages/auth/login/index.html');
  });
}

renderCart();