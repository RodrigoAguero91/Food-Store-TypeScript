import { PRODUCTS as productos, getCategories } from '../../../data/data';
import type { IProduct } from '../../../types/product';
import { addToCart } from '../../../utils/cart';

const productsContainer = document.getElementById('contenedor-productos') as HTMLDivElement;
const categoriesContainer = document.getElementById('categories-container') as HTMLDivElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

let currentCategory = 'todas';
let currentSearch = '';

const categorias = getCategories();

function renderCategories() {
  categoriesContainer.innerHTML = '';

  
  const btnTodas = document.createElement('button');
  btnTodas.textContent = 'Todas';
  btnTodas.style.padding = '6px 10px';
  btnTodas.style.cursor = 'pointer';
  btnTodas.style.border = '1px solid #ccc';
  btnTodas.style.borderRadius = '4px';
  btnTodas.style.background = currentCategory === 'todas' ? '#ff6347' : '#fff';
  btnTodas.style.color = currentCategory === 'todas' ? '#fff' : '#333';
  
  btnTodas.addEventListener('click', () => {
    currentCategory = 'todas';
    renderCategories();
    filterAndRenderProducts();
  });

  categoriesContainer.appendChild(btnTodas);

 
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.nombre;
    btn.style.padding = '6px 10px';
    btn.style.cursor = 'pointer';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '4px';
    btn.style.background = currentCategory === cat.id ? '#ff6347' : '#fff';
    btn.style.color = currentCategory === cat.id ? '#fff' : '#333';
    
    btn.addEventListener('click', () => {
      currentCategory = cat.id;
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

  listaProductos.forEach(product => {
    const card = document.createElement('div');
    card.className = 'producto-card';

    card.innerHTML = `
      <div>
        <img src="${product.imagen}" alt="${product.nombre}" />
        <h3>${product.nombre}</h3>
        <p>${product.descripcion || ''}</p>
        <div class="precio">$${product.precio}</div>
      </div>
      <button class="btn-add" data-id="${product.id}">
        Agregar al Carrito
      </button>
    `;

    const addBtn = card.querySelector('.btn-add') as HTMLButtonElement;
    addBtn.addEventListener('click', () => {
      addToCart(product);
      alert(`¡${product.nombre} agregado al carrito!`);
    });

    productsContainer.appendChild(card);
  });
}

function filterAndRenderProducts() {
  let filtered = productos;

  if (currentCategory !== 'todas') {
    filtered = filtered.filter(p => 
      String(p.categoria) === String(currentCategory) || 
      String(p.categoria).toLowerCase() === String(currentCategory).toLowerCase()
    );
  }

  if (currentSearch.trim() !== '') {
    filtered = filtered.filter(p => p.nombre.toLowerCase().includes(currentSearch.toLowerCase()));
  }

  renderProducts(filtered);
}

searchInput.addEventListener('input', (e) => {
  currentSearch = (e.target as HTMLInputElement).value;
  filterAndRenderProducts();
});


renderCategories();
renderProducts(productos);


const btnLogout = document.querySelector('#btn-logout') as HTMLButtonElement | null;

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('user'); 
        window.location.href = '../login/index.html'; 
    });
}