function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-[#3A7CA5] fixed top-0 w-full z-50 shadow-lg h-[4.5rem]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
          <h1 className="text-2xl font-bold text-white">Reservify</h1>
          <div className="space-y-1 cursor-pointer md:hidden">
            <div className="w-6 h-1 bg-white rounded" />
            <div className="w-6 h-1 bg-white rounded" />
            <div className="w-6 h-1 bg-white rounded" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#E0F4FF] pt-24 pb-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Reserva en tu restaurante favorito</h2>
        <p className="text-lg mb-8">Desde comida gourmet hasta cocina casera, encuentra el lugar ideal</p>
        <input
          type="text"
          placeholder="🔍 ¿Dónde quieres comer hoy?"
          className="w-11/12 max-w-2xl px-6 py-4 rounded-full text-lg border border-gray-300 bg-white shadow-md"
        />
        <p className="mt-4 text-gray-600">📍 Usa tu ubicación actual</p>
      </section>

      {/* Categorías Populares */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-semibold mb-6 text-center">Tipos de Cocina</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-100 p-6 rounded-xl shadow">🍝 Italiana</div>
          <div className="bg-gray-100 p-6 rounded-xl shadow">🍣 Japonesa</div>
          <div className="bg-gray-100 p-6 rounded-xl shadow">🌮 Mexicana</div>
          <div className="bg-gray-100 p-6 rounded-xl shadow">🥗 Vegetariana</div>
        </div>
      </section>

      {/* Restaurantes Destacados */}
      <section className="bg-[#F8FAFC] py-16 px-4">
        <h3 className="text-2xl font-semibold text-center mb-10">Restaurantes Destacados</h3>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Restaurante 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1555992336-03a23c7b20b0?auto=format&fit=crop&w=800&q=80"
              alt="La Terraza"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-xl font-bold">La Terraza</h4>
              <p className="text-gray-600">Cocina mediterránea con vista al mar</p>
              <p className="text-sm text-gray-500 mt-2">📍 Cartagena</p>
            </div>
          </div>

          {/* Restaurante 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
              alt="Sushi House"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-xl font-bold">Sushi House</h4>
              <p className="text-gray-600">Experiencia japonesa tradicional</p>
              <p className="text-sm text-gray-500 mt-2">📍 Bogotá</p>
            </div>
          </div>

          {/* Restaurante 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80"
              alt="El Rincón Mexicano"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-xl font-bold">El Rincón Mexicano</h4>
              <p className="text-gray-600">Tacos, tequila y tradición</p>
              <p className="text-sm text-gray-500 mt-2">📍 Medellín</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#3A7CA5] text-white py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">¿Listo para reservar?</h3>
        <p className="mb-6">Miles de mesas disponibles para ti ahora mismo</p>
        <button className="bg-white text-[#3A7CA5] px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-gray-200">
          Ver restaurantes
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 mt-12">
        <p>&copy; {new Date().getFullYear()} Reservify. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

export default Home;
