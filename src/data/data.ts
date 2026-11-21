import type { IProduct } from '../types/product';
import type { ICategoria } from '../types/categoria';
import { resolveAppPath } from '../utils/navigate';
import categoriasJson from './categorias.json';
import productosJson from './productos.json';

const CATEGORIES_KEY = 'foodstore_categories';
const PRODUCTS_KEY = 'foodstore_products';

interface CategoriaSeedItem {
  id: number | string;
  nombre: string;
  descripcion?: string;
  eliminado?: boolean;
}

interface ProductoCategoriaSeed {
  id: number | string;
  nombre?: string;
  descripcion?: string;
}

interface ProductoSeedItem {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  stock: number;
  imagen?: string;
  disponible: boolean;
  categoria: ProductoCategoriaSeed | number | string;
  eliminado?: boolean;
  createdAt?: string;
}

const DEFAULT_CATEGORIES: ICategoria[] = (categoriasJson as CategoriaSeedItem[]).map((cat) => ({
  id: String(cat.id),
  nombre: cat.nombre,
  descripcion: cat.descripcion ?? '',
  eliminado: cat.eliminado ?? false,
}));

const DEFAULT_PRODUCTS: IProduct[] = (productosJson as ProductoSeedItem[]).map((prod, index) => {
  const categoriaId =
    typeof prod.categoria === 'object' && prod.categoria !== null
      ? String(prod.categoria.id)
      : String(prod.categoria);

  return {
    id: prod.id,
    eliminado: prod.eliminado ?? false,
    createdAt: prod.createdAt ?? `2026-06-01T08:${String(index % 60).padStart(2, '0')}:00`,
    nombre: prod.nombre,
    precio: prod.precio,
    descripcion: prod.descripcion ?? '',
    stock: prod.stock,
    imagen: prod.imagen ?? 'pizza.jpg',
    disponible: prod.disponible,
    categoria: categoriaId,
  };
});

export function resolveProductImage(imagen?: string): string {
  if (!imagen) return resolveAppPath('src/assets/hero.png');
  if (imagen.startsWith('http://') || imagen.startsWith('https://') || imagen.startsWith('data:')) {
    return imagen;
  }
  if (imagen === 'pizza.jpg') {
    return resolveAppPath('src/assets/hero.png');
  }
  return resolveAppPath(`src/assets/${imagen.replace(/^\.?\/?/, '')}`);
}

export function getCategories(): ICategoria[] {
  const raw = localStorage.getItem(CATEGORIES_KEY);
  if (!raw) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES.filter((c) => !c.eliminado);
  }
  try {
    const parsed = JSON.parse(raw) as ICategoria[];
    return parsed.filter((c) => !c.eliminado);
  } catch {
    return DEFAULT_CATEGORIES.filter((c) => !c.eliminado);
  }
}

export function saveCategory(cat: Omit<ICategoria, 'id'>): ICategoria {
  const raw = localStorage.getItem(CATEGORIES_KEY);
  const all: ICategoria[] = raw ? (JSON.parse(raw) as ICategoria[]) : [...DEFAULT_CATEGORIES];
  const nextId = (all.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1).toString();
  const created: ICategoria = {
    id: nextId,
    nombre: cat.nombre.trim(),
    descripcion: cat.descripcion?.trim() || '',
    eliminado: false,
  };
  all.push(created);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(all));
  return created;
}

export function deleteCategoryLogical(id: string): { ok: boolean; message: string } {
  const rawCats = localStorage.getItem(CATEGORIES_KEY);
  const allCats: ICategoria[] = rawCats ? (JSON.parse(rawCats) as ICategoria[]) : [...DEFAULT_CATEGORIES];
  const activeProds = getProducts().filter((p) => String(p.categoria) === String(id));
  if (activeProds.length > 0) {
    return {
      ok: false,
      message: `No se puede dar de baja: tiene ${activeProds.length} producto(s) activo(s) asociado(s).`,
    };
  }
  const updated = allCats.map((c) => (String(c.id) === String(id) ? { ...c, eliminado: true } : c));
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  return { ok: true, message: 'Categoría dada de baja lógicamente.' };
}

export function getProducts(): IProduct[] {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS.filter((p) => !p.eliminado);
  }
  try {
    const parsed = JSON.parse(raw) as IProduct[];
    return parsed.filter((p) => !p.eliminado);
  } catch {
    return DEFAULT_PRODUCTS.filter((p) => !p.eliminado);
  }
}

export function saveProduct(
  data: Omit<IProduct, 'id' | 'eliminado' | 'createdAt'> & { id?: number }
): IProduct {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  const all: IProduct[] = raw ? (JSON.parse(raw) as IProduct[]) : [...DEFAULT_PRODUCTS];

  if (data.id !== undefined) {
    const updated = all.map((p) =>
      p.id === data.id
        ? {
            ...p,
            nombre: data.nombre.trim(),
            descripcion: data.descripcion?.trim() || '',
            precio: data.precio,
            stock: data.stock,
            disponible: data.stock > 0 && data.disponible,
            categoria: String(data.categoria),
            imagen: data.imagen || p.imagen || 'pizza.jpg',
          }
        : p
    );
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return updated.find((p) => p.id === data.id)!;
  }

  const nextId = all.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const created: IProduct = {
    id: nextId,
    nombre: data.nombre.trim(),
    descripcion: data.descripcion?.trim() || '',
    precio: data.precio,
    stock: data.stock,
    disponible: data.stock > 0 && data.disponible,
    categoria: String(data.categoria),
    imagen: data.imagen || 'pizza.jpg',
    eliminado: false,
    createdAt: new Date().toISOString(),
  };
  all.push(created);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
  return created;
}

export function deleteProductLogical(id: number): void {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  const all: IProduct[] = raw ? (JSON.parse(raw) as IProduct[]) : [...DEFAULT_PRODUCTS];
  const updated = all.map((p) => (p.id === id ? { ...p, eliminado: true } : p));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
}

export function decrementStockBatch(items: { productId: number; cantidad: number }[]): { ok: boolean; error?: string } {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  const all: IProduct[] = raw ? (JSON.parse(raw) as IProduct[]) : [...DEFAULT_PRODUCTS];

  for (const item of items) {
    const found = all.find((p) => p.id === item.productId && !p.eliminado);
    if (!found) {
      return { ok: false, error: `El producto #${item.productId} no está disponible.` };
    }
    if (!found.disponible || found.stock < item.cantidad) {
      return {
        ok: false,
        error: `Stock insuficiente para "${found.nombre}" (disponible: ${found.stock}).`,
      };
    }
  }

  const updated = all.map((p) => {
    const match = items.find((i) => i.productId === p.id);
    if (!match) return p;
    const nextStock = p.stock - match.cantidad;
    return {
      ...p,
      stock: nextStock,
      disponible: nextStock > 0 ? p.disponible : false,
    };
  });

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  return { ok: true };
}