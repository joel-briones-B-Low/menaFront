// Detecta automáticamente el entorno
// En desarrollo usa localhost, en producción usa la URL de Render
export const API_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : 'https://menaback.onrender.com/api');

export async function buscarProductos(q) {
    const res = await fetch(`${API_URL}/items?q=${encodeURIComponent(q)}`);
    return res.json();
}

export async function obtenerProducto(id) {
    const res = await fetch(`${API_URL}/items/${id}`);
    return res.json();
}

export async function registrarVenta({ productoId, cantidad, datosUsuario }) {
    const res = await fetch(`${API_URL}/addSale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId, cantidad, datosUsuario })
    });
    return res.json();
}

export async function obtenerVentas() {
    const res = await fetch(`${API_URL}/sales`);
    return res.json();
}
