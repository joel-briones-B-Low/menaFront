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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-block bg-white p-4 rounded-full mb-4 shadow-lg">
          <svg className="w-12 h-12 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">Bazar Online</h1>
        <p className="text-gray-400">Encuentra los mejores productos</p>
      </div>
      <form onSubmit={buscar} className="w-full max-w-md">
        <div className="relative">
          <input
            className="w-full bg-white border-2 border-gray-300 rounded-full px-6 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 shadow-xl"
            placeholder="Buscar producto..."
            value={q}
            onChange={e => setQ(e.target.value)}
            autoFocus
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors shadow-lg"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
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
  const navigate = useNavigate();
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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="text-center text-white text-lg sm:text-xl">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-white mx-auto mb-4"></div>
        Cargando...
      </div>
    </div>
  );

  if (!producto) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="text-center text-white text-lg sm:text-xl">Producto no encontrado</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
            <button onClick={() => navigate(-1)} className="text-white hover:bg-white/20 p-2 rounded-full transition">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="bg-white p-2 rounded-full">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{producto.brand || 'Producto'}</h1>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{producto.title}</h2>
              <p className="text-base sm:text-lg text-gray-500 capitalize">{producto.category}</p>
            </div>

            <div className="flex gap-2 mb-4 sm:mb-6 justify-center flex-wrap">
              {producto.images && producto.images.slice(0, 3).map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={producto.title}
                    className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg sm:rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{producto.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-1">Marca</div>
                <div className="text-sm sm:text-base text-gray-900 font-bold truncate">{producto.brand || 'N/A'}</div>
              </div>
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-green-600 font-semibold mb-1">Stock</div>
                <div className="text-sm sm:text-base text-gray-900 font-bold">{producto.stock} unid.</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
              <div className="text-white text-base sm:text-lg mb-1 sm:mb-2">Precio</div>
              <div className="text-white text-3xl sm:text-5xl font-bold">${producto.price}</div>
            </div>

            <div className="text-center mb-4 sm:mb-6">
              <div className="text-yellow-500 text-2xl sm:text-3xl mb-2">
                {'★'.repeat(Math.round(producto.rating || 0))}
                {'☆'.repeat(5 - Math.round(producto.rating || 0))}
              </div>
              <div className="text-sm sm:text-base text-gray-600">{producto.rating?.toFixed(1)} / 5.0</div>
            </div>

            <button
              className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg ${compraOk
                ? 'bg-green-500 text-white'
                : comprando
                  ? 'bg-gray-400 text-white cursor-wait'
                  : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95'
                }`}
              onClick={comprar}
              disabled={comprando || compraOk}
            >
              {compraOk ? '✓ Comprado' : comprando ? 'Comprando...' : 'Comprar'}
            </button>

            {compraOk && (
              <div className="mt-3 sm:mt-4 bg-green-50 border-2 border-green-500 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-green-700 font-semibold text-base sm:text-lg">¡Compra registrada correctamente!</div>
                <button
                  onClick={() => navigate('/sales')}
                  className="mt-2 sm:mt-3 text-sm sm:text-base text-green-600 hover:text-green-800 font-semibold underline"
                >
                  Ver mis compras →
                </button>
              </div>
            )}
          </div>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-white p-2 sm:p-3 rounded-full">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">Compras registradas</h2>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading && (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-gray-900 mx-auto mb-4"></div>
                <div className="text-sm sm:text-base text-gray-600">Cargando compras...</div>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              {ventas.map(v => (
                <div key={v.id} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-xl transition-all hover:scale-[1.01] sm:hover:scale-[1.02]">
                  <div className="flex gap-3 sm:gap-4">
                    {v.producto?.thumbnail && (
                      <img
                        src={v.producto.thumbnail}
                        alt={v.producto.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base sm:text-lg text-gray-900 mb-1 truncate">{v.producto?.title}</div>
                      <div className="text-xs sm:text-sm text-gray-500 capitalize mb-2">{v.producto?.category}</div>
                      <div className="flex items-center gap-2 sm:gap-4 mb-2 flex-wrap">
                        <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                          Cant: {v.cantidad}
                        </div>
                        <div className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                          ${v.producto?.price}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">
                          {new Date(v.fecha).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && ventas.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gray-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="text-gray-500 text-base sm:text-lg font-semibold">No hay compras registradas</div>
                <div className="text-gray-400 text-sm mt-2">¡Comienza a explorar productos!</div>
              </div>
            )}

            <button
              className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg mt-6 sm:mt-8 hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg active:scale-95"
              onClick={() => navigate('/')}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
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
