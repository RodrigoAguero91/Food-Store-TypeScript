import { getCart, updateQuantity, calculateTotal } from '../../../utils/cart';

const cartContainer = document.getElementById('cart-container') as HTMLDivElement;
const cartSummary = document.getElementById('cart-summary') as HTMLDivElement;
const cartTotalSpan = document.getElementById('cart-total') as HTMLSpanElement;

function renderCart() {
  const cart = getCart();
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    cartSummary.style.display = 'none';
    return;
  }

  cartSummary.style.display = 'block';
  cartTotalSpan.textContent = calculateTotal().toString();

  cart.forEach(item => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.borderBottom = '1px solid #ddd';
    row.style.padding = '10px 0';

    row.innerHTML = `
      <div>
        <h4 style="margin: 0;">${item.producto.nombre}</h4>
        <p style="margin: 5px 0 0 0; color: #666;">Precio Unitario: $${item.producto.precio}</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button class="btn-decrease" data-id="${item.producto.id}" style="padding: 4px 8px;">-</button>
        <span>${item.cantidad}</span>
        <button class="btn-increase" data-id="${item.producto.id}" style="padding: 4px 8px;">+</button>
        <p style="font-weight: bold; width: 80px; text-align: right; margin: 0;">$${item.producto.precio * item.cantidad}</p>
      </div>
    `;

    const decBtn = row.querySelector('.btn-decrease') as HTMLButtonElement;
    const incBtn = row.querySelector('.btn-increase') as HTMLButtonElement;

    decBtn.addEventListener('click', () => {
      updateQuantity(item.producto.id, item.cantidad - 1);
      renderCart();
    });

    incBtn.addEventListener('click', () => {
      updateQuantity(item.producto.id, item.cantidad + 1);
      renderCart();
    });

    cartContainer.appendChild(row);
  });
}

renderCart();