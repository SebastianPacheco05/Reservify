import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, Loader2, MapPin, Search as SearchIcon, Star } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { getApiEndpoint } from "../config/api";
import { ROUTES } from "../routes/paths";
import type { Restaurante } from "../types/restaurant.types";

type PagedResponse = {
  items: Restaurante[];
  total: number;
  page: number;
  per_page: number;
};

const DEFAULT_PER_PAGE = 30;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [queryInput, setQueryInput] = useState(searchParams.get("q") ?? "");
  const [restaurants, setRestaurants] = useState<Restaurante[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const perPageRaw = Number(searchParams.get("per_page") ?? String(DEFAULT_PER_PAGE)) || DEFAULT_PER_PAGE;
  const perPage = Math.min(50, Math.max(1, perPageRaw));
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    setQueryInput(query);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const endpoint = getApiEndpoint(
      `/top/paginado?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    );

    fetch(endpoint, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: PagedResponse) => {
        setRestaurants(Array.isArray(data?.items) ? data.items : []);
        setTotal(Number(data?.total ?? 0));
      })
      .catch((err: Error & { name?: string }) => {
        if (err.name === "AbortError") return;
        setError(err.message || "No se pudo cargar la búsqueda.");
        setRestaurants([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query, page, perPage]);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    const pages: number[] = [];
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const updateParams = (next: { q?: string; page?: number; per_page?: number }) => {
    const qValue = next.q ?? query;
    const pageValue = String(next.page ?? page);
    const perPageValue = String(next.per_page ?? perPage);
    setSearchParams({ q: qValue, page: pageValue, per_page: perPageValue });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: queryInput.trim(), page: 1 });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("tipo_usuario");
    window.location.href = ROUTES.HOME;
  };

  return (
    <main className="min-h-screen bg-background">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
        onLogout={logout}
      />

      <section className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-[1700px] mx-auto">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Explorar restaurantes</h1>
              <p className="text-muted-foreground mt-1">
                {query ? `Resultados para "${query}"` : "Encuentra tu próxima reserva"}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {total} resultados - Pagina {Math.min(page, totalPages)} de {totalPages}
            </div>
          </div>

          <form onSubmit={submitSearch} className="mb-6 rounded-2xl border border-border bg-card/70 p-3 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Busca por nombre, cocina o descripción"
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="min-w-28">Buscar</Button>
                <Button type="button" variant="outline" onClick={() => updateParams({ q: "", page: 1 })}>
                  Limpiar
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {/* <span className="text-sm text-muted-foreground">Por página</span> */}
                {/* <Button
                  type="button"
                  size="sm"
                  variant={perPage === 30 ? "default" : "outline"}
                  onClick={() => updateParams({ per_page: 30, page: 1 })}
                >
                  30
                </Button> */}
                {/* <Button
                  type="button"
                  size="sm"
                  variant={perPage === 50 ? "default" : "outline"}
                  onClick={() => updateParams({ per_page: 50, page: 1 })}
                >
                  50
                </Button> */}
              </div>
            </div>
          </form>

          {loading && (
            <div className="py-16 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="mt-3 text-muted-foreground">Cargando restaurantes...</p>
            </div>
          )}

          {error && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="mt-3 font-medium text-destructive">No fue posible cargar resultados</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && restaurants.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              No hay restaurantes para mostrar con ese criterio.
            </div>
          )}

          {!loading && !error && restaurants.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.restaurante_uid} className="overflow-hidden h-full border border-border/70">
                  <div className="relative">
                    <img
                      src={restaurant.url_image}
                      alt={restaurant.nombre_restaurante}
                      className="w-full h-40 object-cover"
                    />
                    <Badge className="absolute right-3 top-3 bg-background/90 text-foreground">
                      {restaurant.availabletoday ? "Disponible hoy" : "No disponible hoy"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-1">{restaurant.nombre_restaurante}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {restaurant.descripcion_restaurante || "Sin descripción disponible"}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-1 text-foreground">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        {restaurant.rating} ({restaurant.reviews})
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {restaurant.nombre_categoria || "General"}
                      </Badge>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{restaurant.direccion}</span>
                    </div>
                    <Button asChild className="w-full mt-4 rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-accent/90 hover:text-primary-foreground focus-visible:ring-primary/40" size="sm">
                      <Link to={`${ROUTES.RESTAURANT}?uid=${restaurant.restaurante_uid}`}>
                        Ver disponibilidad
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && total > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => updateParams({ page: page - 1 })}
              >
                Anterior
              </Button>
              {pageNumbers.map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => updateParams({ page: p })}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: page + 1 })}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
