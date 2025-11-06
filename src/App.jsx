import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
  useParams
} from 'react-router-dom';
import * as api from './api';

function Buscador() {
  const navigate = useNavigate();
  const [q, setQ] = React.useState('');
  function buscar(e) {
    e.preventDefault();
    if (q.trim()) navigate(`/items?search=${encodeURIComponent(q)}`);
  }
  return (
    <form onSubmit={buscar} className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-3xl font-bold mb-4">Bazar Online</h1>
      <input
        className="border rounded px-4 py-2 w-64"
        placeholder="Buscar producto..."
        value={q}
        onChange={e => setQ(e.target.value)}
        autoFocus
      />
      <button className="bg-black text-white px-6 py-2 rounded" type="submit">Buscar</button>
    </form>
  );
}

function Resultados() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get('search') || '';
  const [productos, setProductos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.buscarProductos(q).then(data => {
      setProductos(data);
      setLoading(false);
    });
  }, [q]);
  return (
    <div className="p-4">
      <Buscador />
      <div className="mt-6 text-sm text-gray-500">Resultados de la búsqueda: <b>{q}</b></div>
      {loading && <div className="mt-4">Cargando...</div>}
      <div className="mt-4 flex flex-col gap-4">
        {productos.map(prod => (
          <Link key={prod.id} to={`/item/${prod.id}`} className="block border rounded p-4 hover:bg-gray-50">
            <div className="flex gap-4 items-center">
              <img src={prod.thumbnail} alt={prod.title} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-bold">{prod.title}</div>
                <div className="text-xs text-gray-500">{prod.category}</div>
                <div className="text-sm mt-1">{prod.description}</div>
                <div className="mt-1 font-semibold">${prod.price}</div>
                <div className="text-yellow-500">{'★'.repeat(Math.round(prod.rating || 0))}</div>
              </div>
            </div>
          </Link>
        ))}
        {!loading && productos.length === 0 && q && (
          <div className="text-center text-gray-400">No se encontraron productos.</div>
        )}
      </div>
    </div>
  );
}

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [comprando, setComprando] = React.useState(false);
  const [compraOk, setCompraOk] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    api.obtenerProducto(id).then(data => {
      setProducto(data);
      setLoading(false);
    });
  }, [id]);

  async function comprar() {
    setComprando(true);
    const res = await api.registrarVenta({ productoId: id, cantidad: 1 });
    setCompraOk(res.ok);
    setComprando(false);
  }

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!producto) return <div className="p-4">Producto no encontrado</div>;
  return (
    <div className="p-4">
      <div className="mb-4">
        <input className="border rounded px-4 py-2 w-64" placeholder="Buscar producto..." />
      </div>
      <div className="flex flex-col items-center">
        <div className="font-bold text-xl mb-2">{producto.title}</div>
        <div className="mb-2 text-gray-500">{producto.category}</div>
        <div className="flex gap-2 mb-2">
          {producto.images && producto.images.map((img, i) => (
            <img key={i} src={img} alt={producto.title} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
        <div className="mb-2">{producto.description}</div>
        <div className="mb-2">Marca: {producto.brand}</div>
        <div className="mb-2">Stock: {producto.stock}</div>
        <div className="mb-2">Precio: <span className="font-bold">${producto.price}</span></div>
        <div className="mb-2">Puntuacion: <span className="text-yellow-500">{'★'.repeat(Math.round(producto.rating || 0))}</span></div>
        <button
          className="bg-black text-white px-6 py-2 rounded mt-4"
          onClick={comprar}
          disabled={comprando || compraOk}
        >
          {compraOk ? 'Comprado' : comprando ? 'Comprando...' : 'Comprar'}
        </button>
        {compraOk && <div className="mt-2 text-green-600">Compra registrada correctamente</div>}
      </div>
    </div>
  );
}

function Ventas() {
  const navigate = useNavigate();
  const [ventas, setVentas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    api.obtenerVentas().then(data => {
      setVentas(data);
      setLoading(false);
    });
  }, []);
  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Compras registradas</h2>
      {loading && <div>Cargando...</div>}
      <div className="w-full max-w-md flex flex-col gap-4">
        {ventas.map(v => (
          <div key={v.id} className="border rounded p-4 text-left">
            <div className="font-bold">{v.producto?.title}</div>
            <div className="text-xs text-gray-500">{v.producto?.category}</div>
            <div className="text-sm">Cantidad: {v.cantidad}</div>
            <div className="text-sm">Precio: ${v.producto?.price}</div>
            <div className="text-xs text-gray-400">{new Date(v.fecha).toLocaleString()}</div>
          </div>
        ))}
        {!loading && ventas.length === 0 && <div className="text-gray-400 text-center">No hay compras registradas.</div>}
      </div>
      <button className="bg-black text-white px-6 py-2 rounded mt-8" onClick={() => navigate('/')}>Salir</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Buscador />} />
        <Route path="/items" element={<Resultados />} />
        <Route path="/item/:id" element={<DetalleProducto />} />
        <Route path="/sales" element={<Ventas />} />
      </Routes>
    </Router>
  );
}

export default App
