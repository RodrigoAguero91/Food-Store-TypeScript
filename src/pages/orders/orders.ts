import { getOrdersByUser } from '../../utils/orders';
import { getSessionUser, logout } from '../../utils/auth';
import { protectRoute, replaceRoute } from '../../utils/navigate';
import type { IPedido, IDetallePedido } from '../../types/pedido';

if (!protectRoute(false)) {
  throw new Error('Acceso no autorizado');
}

const ordersContainer = document.getElementById('orders-container') as HTMLDivElement;
const userInfoSpan = document.getElementById('user-info') as HTMLSpanElement | null;
const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement | null;

const user = getSessionUser()!;
if (userInfoSpan) {
  userInfoSpan.textContent = user.nombre || user.email;
}

function renderOrders(): void {
  const orders = getOrdersByUser(user.id);
  ordersContainer.innerHTML = '';

  if (orders.length === 0) {
    ordersContainer.innerHTML =
      '<div class="cart-box"><p>Todavía no realizaste pedidos. <a href="../client/home/home.html">Ir al catálogo</a></p></div>';
    return;
  }

  orders.forEach((order: IPedido) => {
    const card = document.createElement('div');
    card.className = 'order-card';

    const itemsHtml = order.detalles
      .map(
        (d: IDetallePedido) =>
          `<li>${d.nombreProducto} x${d.cantidad} ($${d.precioUnitario.toFixed(2)} c/u) — <strong>$${d.subtotal.toFixed(2)}</strong></li>`
      )
      .join('');

    card.innerHTML = `
      <div class="order-header">
        <div>
          <h3>Pedido ${order.id}</h3>
          <p class="muted">Fecha: ${order.fecha} | Pago: ${order.formaPago}</p>
        </div>
        <span class="status-pill status-${order.estado.toLowerCase()}">${order.estado}</span>
      </div>
      <ul class="order-items">${itemsHtml}</ul>
      <div class="order-total">Total: <strong>$${order.total.toFixed(2)}</strong></div>
    `;

    ordersContainer.appendChild(card);
  });
}

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    logout();
    replaceRoute('src/pages/auth/login/index.html');
  });
}

renderOrders();