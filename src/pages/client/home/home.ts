import { getProducts, getCategories, resolveProductImage } from '../../../data/data';
import type { IProduct } from '../../../types/product';
import { addToCart, getCart } from '../../../utils/cart';
import { getSessionUser, logout } from '../../../utils/auth';
import { protectRoute, replaceRoute, isAdminRole } from '../../../utils/navigate';

if (!protectRoute(false)) {
  throw new Error('Acceso no autorizado');
}

const productsContainer = document.getElementById('contenedor-productos') as HTMLDivElement;
const categoriesContainer = document.getElementById('categories-container') as HTMLDivElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const cartCountSpan = document.getElementById('cart-count') as HTMLSpanElement | null;
const linkAdmin = document.getElementById('link-admin') as HTMLAnchorElement | null;
const userInfoSpan = document.getElementById('user-info') as HTMLSpanElement | null;
const btnLogout = document.querySelector('#btn-logout') as HTMLButtonElement | null;

const sessionUser = getSessionUser();
if (userInfoSpan && sessionUser) {
  userInfoSpan.textContent = `${sessionUser.nombre || sessionUser.email} (${sessionUser.rol})`;
}
if (linkAdmin && isAdminRole(sessionUser?.rol)) {
  linkAdmin.style.display = 'inline-block';
}

function updateCartBadge() {
  if (!cartCountSpan) return;
  const totalItems = getCart().reduce((sum, item) => sum + item.cantidad, 0);
  cartCountSpan.textContent = totalItems.toString();
}

let currentCategory = 'todas';
let currentSearch = '';
const categorias = getCategories();
const categoryMap = new Map(categorias.map((c) => [String(c.id), c.nombre]));

function renderCategories() {
  categoriesContainer.innerHTML = '';

  const btnTodas = document.createElement('button');
  btnTodas.type = 'button';
  btnTodas.textContent = 'Todas';
  btnTodas.className = `cat-btn ${currentCategory === 'todas' ? 'active' : ''}`;
  btnTodas.addEventListener('click', () => {
    currentCategory = 'todas';
    renderCategories();
    filterAndRenderProducts();
  });
  categoriesContainer.appendChild(btnTodas);

  categorias.forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat.nombre;
    btn.className = `cat-btn ${currentCategory === String(cat.id) ? 'active' : ''}`;
    btn.addEventListener('click', () => {
      currentCategory = String(cat.id);
      renderCategories();
      filterAndRenderProducts();
    });
    categoriesContainer.appendChild(btn);
  });
}

function renderProducts(listaProductos: IProduct[]) {
  productsContainer.innerHTML = '';

  if (listaProductos.length === 0) {
    productsContainer.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  listaProductos.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'producto-card';

    const canBuy = !product.eliminado && product.disponible && product.stock > 0;
    const catName = categoryMap.get(String(product.categoria)) || 'General';
    const imgSrc = resolveProductImage(product.imagen);

    card.innerHTML = `
      <div>
        <img src="${imgSrc}" alt="${product.nombre}" />
        <span class="tag-cat">${catName}</span>
        <h3>${product.nombre}</h3>
        <p>${product.descripcion || ''}</p>
        <p class="stock-info ${canBuy ? 'stock-ok' : 'stock-empty'}">
          ${canBuy ? `Stock disponible: ${product.stock}` : 'Sin stock / No disponible'}
        </p>
        <div class="precio">$${product.precio.toFixed(2)}</div>
      </div>
      <button type="button" class="btn-add" data-id="${product.id}" ${canBuy ? '' : 'disabled'}>
        ${canBuy ? 'Agregar al Carrito' : 'No Disponible'}
      </button>
    `;

    const addBtn = card.querySelector('.btn-add') as HTMLButtonElement;
    if (canBuy) {
      addBtn.addEventListener('click', () => {
        const res = addToCart(product);
        if (res.ok) {
          updateCartBadge();
          alert(res.message);
        } else {
          alert(res.message);
        }
      });
    }

    productsContainer.appendChild(card);
  });
}

function filterAndRenderProducts() {
  let filtered = getProducts();

  if (currentCategory !== 'todas') {
    filtered = filtered.filter((p) => String(p.categoria) === String(currentCategory));
  }

  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q))
    );
  }

  renderProducts(filtered);
}

searchInput.addEventListener('input', (e) => {
  currentSearch = (e.target as HTMLInputElement).value;
  filterAndRenderProducts();
});

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    logout();
    replaceRoute('src/pages/auth/login/index.html');
  });
}

updateCartBadge();
renderCategories();
filterAndRenderProducts();