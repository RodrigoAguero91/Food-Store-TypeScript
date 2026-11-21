import { getSessionUser, logout } from '../../utils/auth';
import { protectRoute, replaceRoute } from '../../utils/navigate';
import {
  getCategories,
  saveCategory,
  deleteCategoryLogical,
  getProducts,
  saveProduct,
  deleteProductLogical,
} from '../../data/data';
import { getSeedOrders, getSeedUsers } from '../../data/seedExtra';
import { getAllOrders, updateOrderStatus } from '../../utils/orders';
import type { EstadoPedido } from '../../types/pedido';

if (!protectRoute(true)) {
  throw new Error('Acceso denegado');
}

const user = getSessionUser()!;
const spanUserInfo = document.querySelector('#user-info');
if (spanUserInfo) {
  spanUserInfo.textContent = `Admin: ${user.nombre || user.email}`;
}

const btnLogout = document.querySelector('#btn-logout') as HTMLButtonElement | null;
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    logout();
    replaceRoute('src/pages/auth/login/index.html');
  });
}

// Categorías
const formCategoria = document.getElementById('form-categoria') as HTMLFormElement;
const catNombreInput = document.getElementById('cat-nombre') as HTMLInputElement;
const catDescInput = document.getElementById('cat-desc') as HTMLInputElement;
const adminCategoriesList = document.getElementById('admin-categories-list') as HTMLDivElement;
const prodCategoriaSelect = document.getElementById('prod-categoria') as HTMLSelectElement;

function renderAdminCategories() {
  const cats = getCategories();
  prodCategoriaSelect.innerHTML = '';
  adminCategoriesList.innerHTML = '';

  cats.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = String(c.id);
    opt.textContent = c.nombre;
    prodCategoriaSelect.appendChild(opt);

    const chip = document.createElement('div');
    chip.className = 'cat-chip';
    chip.innerHTML = `
      <span><strong>${c.nombre}</strong>${c.descripcion ? ` — ${c.descripcion}` : ''}</span>
      <button type="button" class="btn-mini-danger" data-id="${c.id}">Baja</button>
    `;
    chip.querySelector('.btn-mini-danger')?.addEventListener('click', () => {
      const res = deleteCategoryLogical(String(c.id));
      alert(res.message);
      if (res.ok) {
        renderAdminCategories();
        renderAdminProducts();
      }
    });
    adminCategoriesList.appendChild(chip);
  });
}

formCategoria.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = catNombreInput.value.trim();
  const descripcion = catDescInput.value.trim();
  if (!nombre) return;

  saveCategory({ nombre, descripcion });
  catNombreInput.value = '';
  catDescInput.value = '';
  renderAdminCategories();
  alert('Categoría creada.');
});

// Productos
const formProducto = document.getElementById('form-producto') as HTMLFormElement;
const prodIdInput = document.getElementById('prod-id') as HTMLInputElement;
const prodNombreInput = document.getElementById('prod-nombre') as HTMLInputElement;
const prodPrecioInput = document.getElementById('prod-precio') as HTMLInputElement;
const prodStockInput = document.getElementById('prod-stock') as HTMLInputElement;
const prodDescInput = document.getElementById('prod-desc') as HTMLInputElement;
const prodDisponibleInput = document.getElementById('prod-disponible') as HTMLInputElement;
const btnCancelEdit = document.getElementById('btn-cancel-edit') as HTMLButtonElement;
const adminProductsList = document.getElementById('admin-products-list') as HTMLDivElement;

function resetProductForm() {
  prodIdInput.value = '';
  formProducto.reset();
  prodDisponibleInput.checked = true;
  btnCancelEdit.style.display = 'none';
}

btnCancelEdit.addEventListener('click', resetProductForm);

function renderAdminProducts() {
  const prods = getProducts();
  const cats = new Map(getCategories().map((c) => [String(c.id), c.nombre]));

  if (prods.length === 0) {
    adminProductsList.innerHTML = '<p>No hay productos activos.</p>';
    return;
  }

  adminProductsList.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${prods
          .map(
            (p) => `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${cats.get(String(p.categoria)) || p.categoria}</td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>${p.disponible && p.stock > 0 ? 'Disponible' : 'No disp.'}</td>
            <td class="table-actions">
              <button type="button" class="btn-mini btn-edit" data-id="${p.id}">Editar</button>
              <button type="button" class="btn-mini-danger btn-del" data-id="${p.id}">Baja</button>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  adminProductsList.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);
      const target = getProducts().find((p) => p.id === id);
      if (!target) return;
      prodIdInput.value = String(target.id);
      prodNombreInput.value = target.nombre;
      prodCategoriaSelect.value = String(target.categoria);
      prodPrecioInput.value = String(target.precio);
      prodStockInput.value = String(target.stock);
      prodDescInput.value = target.descripcion || '';
      prodDisponibleInput.checked = Boolean(target.disponible);
      btnCancelEdit.style.display = 'inline-block';
    });
  });

  adminProductsList.querySelectorAll('.btn-del').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);
      deleteProductLogical(id);
      renderAdminProducts();
      alert('Producto dado de baja lógicamente.');
    });
  });
}

formProducto.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = prodNombreInput.value.trim();
  const categoria = prodCategoriaSelect.value;
  const precio = Number(prodPrecioInput.value);
  const stock = Number(prodStockInput.value);
  const descripcion = prodDescInput.value.trim();
  const disponible = prodDisponibleInput.checked;

  if (!nombre || !categoria || isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0) {
    alert('Revisá los datos: nombre y categoría obligatorios, precio > 0 y stock >= 0.');
    return;
  }

  const editId = prodIdInput.value ? Number(prodIdInput.value) : undefined;
  saveProduct({
    id: editId,
    nombre,
    categoria,
    precio,
    stock,
    descripcion,
    disponible,
    imagen: 'pizza.jpg',
  });

  resetProductForm();
  renderAdminProducts();
  alert(editId ? 'Producto actualizado.' : 'Producto creado.');
});

// Pedidos
const adminOrdersList = document.getElementById('admin-orders-list') as HTMLDivElement;
const ESTADOS: EstadoPedido[] = ['PENDIENTE', 'CONFIRMADO', 'TERMINADO', 'CANCELADO'];

function renderAdminOrders() {
  const orders = getAllOrders();
  if (orders.length === 0) {
    adminOrdersList.innerHTML = '<p>No hay pedidos registrados todavía.</p>';
    return;
  }

  adminOrdersList.innerHTML = '';
  orders.forEach((order) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    const optionsHtml = ESTADOS.map(
      (st) => `<option value="${st}" ${order.estado === st ? 'selected' : ''}>${st}</option>`
    ).join('');

    card.innerHTML = `
      <div class="order-header">
        <div>
          <strong>${order.id}</strong> — ${order.usuarioEmail} (${order.fecha})
        </div>
        <div class="order-status-control">
          <select class="select-estado" data-id="${order.id}">${optionsHtml}</select>
          <strong>$${order.total.toFixed(2)}</strong>
        </div>
      </div>
    `;

    card.querySelector('.select-estado')?.addEventListener('change', (ev) => {
      const sel = ev.target as HTMLSelectElement;
      updateOrderStatus(order.id, sel.value as EstadoPedido);
      renderAdminOrders();
    });

    adminOrdersList.appendChild(card);
  });
}

getSeedUsers();
getSeedOrders();

renderAdminCategories();
renderAdminProducts();
renderAdminOrders();