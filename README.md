# Food Store - TypeScript (Evaluación 1 - Programación III)

Aplicación web frontend desarrollada como parte de la Tecnicatura Universitaria en Programación (UTN). Consiste en un catálogo de productos dinámico con un sistema de carrito de compras persistente, buscador y filtros por categoría.

## 🚀 Funcionalidades Principales

* **Catálogo Dinámico:** Visualización de productos organizados por tarjetas con imagen, descripción, precio y botón de compra.
* **Búsqueda y Filtros:** Buscador por nombre en tiempo real y filtrado de productos mediante un menú lateral de categorías[cite: 10].
* **Carrito de Compras:** Funcionalidad para agregar productos, actualizar cantidades (acumulando ítems repetidos) y calcular el monto total[cite: 10].
* **Persistencia de Datos:** Almacenamiento local utilizando `localStorage` bajo la clave `"cart"`[cite: 10].

## 🛠️ Tecnologías Utilizadas

* **HTML5** y **CSS3** (Diseño adaptable)[cite: 10]
* **JavaScript** / **TypeScript** (Tipado estricto mediante interfaces: `IProduct`, `ICartItem`, `ICategoria`)[cite: 10]
* **Vite** como empaquetador y servidor de desarrollo[cite: 10]

---

## ⚙️ Instrucciones de Ejecución

Asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu equipo.

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone [https://github.com/RodrigoAguero91/Food-Store-TypeScript.git](https://github.com/RodrigoAguero91/Food-Store-TypeScript.git)
   cd Food-Store-TypeScript
