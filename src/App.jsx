import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

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
  // Aquí se hará fetch a la API en el siguiente paso
  return (
    <div className="p-4">
      <Buscador />
      <div className="mt-6 text-sm text-gray-500">Resultados de la búsqueda: <b>{q}</b></div>
      {/* Aquí irá la lista de productos */}
    </div>
  );
}

function DetalleProducto() {
  // Aquí se hará fetch a la API en el siguiente paso
  return (
    <div className="p-4">
      <div className="mb-4">
        <input className="border rounded px-4 py-2 w-64" placeholder="Buscar producto..." />
      </div>
      <div>Detalle del producto</div>
    </div>
  );
}

function Ventas() {
  // Aquí se hará fetch a la API en el siguiente paso
  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Compras registradas</h2>
      <button className="bg-black text-white px-6 py-2 rounded">Salir</button>
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
