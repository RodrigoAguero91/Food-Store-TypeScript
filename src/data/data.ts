import type { IProduct } from '../types/product';
import type { ICategoria } from '../types/categoria';
import { resolveAppPath } from '../utils/navigate';

const CATEGORIES_KEY = 'foodstore_categories';
const PRODUCTS_KEY = 'foodstore_products';

const DEFAULT_CATEGORIES: ICategoria[] = [
  { id: '1', nombre: 'Pizzas', descripcion: 'Pizzas artesanales al horno', eliminado: false },
  { id: '2', nombre: 'Hamburguesas', descripcion: 'Hamburguesas caseras con papas', eliminado: false },
  { id: '3', nombre: 'Bebidas', descripcion: 'Gaseosas, jugos y aguas', eliminado: false },
  { id: '4', nombre: 'Postres', descripcion: 'Tortas, helados y dulces', eliminado: false },
  { id: '5', nombre: 'Empanadas', descripcion: 'Empanadas horneadas y fritas', eliminado: false },
  { id: '6', nombre: 'Ensaladas', descripcion: 'Opciones frescas y saludables', eliminado: false },
];

const DEFAULT_PRODUCTS: IProduct[] = [
  {
    id: 1,
    eliminado: false,
    createdAt: '2024-02-01T08:00:00',
    nombre: 'Pizza Muzzarella',
    precio: 4500.0,
    descripcion: 'Pizza clásica con salsa de tomate y muzzarella derretida',
    stock: 20,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '1',
  },
  {
    id: 2,
    eliminado: false,
    createdAt: '2024-02-01T08:30:00',
    nombre: 'Pizza Napolitana',
    precio: 5200.0,
    descripcion: 'Pizza con rodajas de tomate fresco, ajo y albahaca',
    stock: 15,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '1',
  },
  {
    id: 3,
    eliminado: false,
    createdAt: '2024-02-02T09:00:00',
    nombre: 'Pizza Especial 4 Quesos',
    precio: 6800.0,
    descripcion: 'Muzzarella, provolone, roquefort y parmesano',
    stock: 10,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '1',
  },
  {
    id: 4,
    eliminado: false,
    createdAt: '2024-02-02T09:30:00',
    nombre: 'Hamburguesa Clásica',
    precio: 3800.0,
    descripcion: 'Medallón de carne, lechuga, tomate, cebolla y mayo',
    stock: 30,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '2',
  },
  {
    id: 5,
    eliminado: false,
    createdAt: '2024-02-03T10:00:00',
    nombre: 'Hamburguesa BBQ Bacon',
    precio: 5100.0,
    descripcion: 'Doble medallón, bacon crocante y salsa barbacoa ahumada',
    stock: 25,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '2',
  },
  {
    id: 6,
    eliminado: false,
    createdAt: '2024-02-03T11:00:00',
    nombre: 'Hamburguesa Veggie',
    precio: 4200.0,
    descripcion: 'Medallón de lentejas y garbanzo, cheddar vegano y rúcula',
    stock: 0,
    imagen: 'pizza.jpg',
    disponible: false,
    categoria: '2',
  },
  {
    id: 7,
    eliminado: false,
    createdAt: '2024-02-04T09:00:00',
    nombre: 'Coca-Cola 500ml',
    precio: 1200.0,
    descripcion: 'Gaseosa Coca-Cola fría, botella personal',
    stock: 100,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '3',
  },
  {
    id: 8,
    eliminado: false,
    createdAt: '2024-02-04T10:00:00',
    nombre: 'Jugo de Naranja Natural',
    precio: 1800.0,
    descripcion: 'Jugo exprimido en el momento, vaso 400ml',
    stock: 40,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '3',
  },
  {
    id: 9,
    eliminado: false,
    createdAt: '2024-02-05T08:00:00',
    nombre: 'Agua Mineral 500ml',
    precio: 800.0,
    descripcion: 'Agua mineral sin gas, botella personal',
    stock: 150,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '3',
  },
  {
    id: 10,
    eliminado: false,
    createdAt: '2024-02-05T09:00:00',
    nombre: 'Torta Rogel',
    precio: 3500.0,
    descripcion: 'Torta rogel tradicional con dulce de leche y merengue',
    stock: 12,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '4',
  },
  {
    id: 11,
    eliminado: false,
    createdAt: '2024-02-06T08:00:00',
    nombre: 'Helado Artesanal 2 gustos',
    precio: 2800.0,
    descripcion: 'Pote de 250g, elegí 2 gustos entre 12 opciones',
    stock: 30,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '4',
  },
  {
    id: 12,
    eliminado: false,
    createdAt: '2024-02-06T09:00:00',
    nombre: 'Brownie con Helado',
    precio: 2200.0,
    descripcion: 'Brownie de chocolate tibio con bocha de vainilla',
    stock: 0,
    imagen: 'pizza.jpg',
    disponible: false,
    categoria: '4',
  },
  {
    id: 13,
    eliminado: false,
    createdAt: '2024-02-07T09:00:00',
    nombre: 'Empanadas de Carne x6',
    precio: 3000.0,
    descripcion: 'Empanadas criollas de carne cortada a cuchillo, horneadas',
    stock: 50,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '5',
  },
  {
    id: 14,
    eliminado: false,
    createdAt: '2024-02-07T10:00:00',
    nombre: 'Empanadas de Pollo x6',
    precio: 2800.0,
    descripcion: 'Empanadas de pollo con morrón y verdeo, horneadas',
    stock: 45,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '5',
  },
  {
    id: 15,
    eliminado: false,
    createdAt: '2024-02-08T08:00:00',
    nombre: 'Empanadas de Jamón y Queso x6',
    precio: 2500.0,
    descripcion: 'Empanadas fritas con jamón cocido y queso fundido',
    stock: 60,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '5',
  },
  {
    id: 16,
    eliminado: false,
    createdAt: '2024-02-08T09:00:00',
    nombre: 'Ensalada César',
    precio: 3200.0,
    descripcion: 'Lechuga romana, crutones, parmesano y aderezo césar',
    stock: 20,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '6',
  },
  {
    id: 17,
    eliminado: false,
    createdAt: '2024-02-09T08:00:00',
    nombre: 'Ensalada Caprese',
    precio: 2900.0,
    descripcion: 'Tomate, muzzarella fresca, albahaca y aceite de oliva',
    stock: 18,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '6',
  },
  {
    id: 18,
    eliminado: false,
    createdAt: '2024-02-09T09:00:00',
    nombre: 'Pizza Fugazzeta',
    precio: 5500.0,
    descripcion: 'Pizza rellena de muzzarella con cebolla caramelizada',
    stock: 10,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '1',
  },
  {
    id: 19,
    eliminado: false,
    createdAt: '2024-02-10T08:00:00',
    nombre: 'Hamburguesa Crispy Chicken',
    precio: 4600.0,
    descripcion: 'Pollo apanado crocante, coleslaw y salsa honey mustard',
    stock: 0,
    imagen: 'pizza.jpg',
    disponible: false,
    categoria: '2',
  },
  {
    id: 20,
    eliminado: false,
    createdAt: '2024-02-10T09:00:00',
    nombre: 'Ensalada Mixta',
    precio: 2400.0,
    descripcion: 'Lechuga, tomate, zanahoria rallada y aceitunas',
    stock: 25,
    imagen: 'pizza.jpg',
    disponible: true,
    categoria: '6',
  },
];

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