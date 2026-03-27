# -*- coding: utf-8 -*-
"""Una sola ejecución: alinea REQ. No funcionales frontend.md al código actual (frontend/src)."""
from __future__ import annotations

import re
from pathlib import Path

MD = Path(__file__).resolve().parent / "REQ. No funcionales frontend.md"


def implementation_note(title: str) -> str:
    t = title.lower()
    # Home / hero / layout
    if "nff-000" in t or "color de fondo de la pagina" in t:
        return (
            "El fondo global usa variables en `index.css` (`--background` #F9F7F2, `--primary` #FF6A00, `--secondary` #FF2D55). "
            "El hero (`HeroSection.tsx`) aplica `bg-gradient-to-b from-primary/10 via-background to-accent/20`, no el degradado RGB del texto legacy."
        )
    if "reserva en tu restaurante favorito" in t:
        return (
            "El titular visible en el hero es «Reserva tu mesa sin complicaciones» con gradiente primary→accent (`HeroSection.tsx`), no el texto citado en el requisito legacy."
        )
    if "80px" in t and "header" in t:
        return "El header fijo usa `h-14 sm:h-16` (56–64px), no 80px (`Header.tsx`)."
    if "restaurantes" in t and "header" in t and "enlace" in t:
        return "En escritorio: ancla a `/#restaurantes` con texto «Restaurantes». La barra de búsqueda en header solo aparece si el usuario es cliente autenticado (`canSearch`)."
    if ("página principal" in t or "bienvenida" in t) and "modo oscuro" in t and "luna" in t:
        return (
            "Cabecera pública: `Brand`, enlace Restaurantes, `AnimatedThemeToggler`, botones Iniciar sesión / Registrarse con tokens (`Header.tsx`); "
            "no coinciden los colores «azul/verde» del texto legacy."
        )
    if "iniciar sesión" in t and "azul" in t and ("página principal" in t or "bienvenida" in t):
        return "Botón «Iniciar Sesión»: `bg-foreground` con hover a primary (`Header.tsx`), no azul/gris azulado fijo del Excel."
    if "verde" in t and "registrarse" in t:
        return "Botón «Registrarse» usa el token `secondary` (#FF2D55) con hover a primary, no verde (`Header.tsx`)."
    if ("inter" in t or "poppins" in t) and ("página principal" in t or "bienvenida" in t) and "fuente" in t:
        return (
            "Tipografía global **Google Sans** (`index.css`, `--font-sans`); títulos/subtítulos con escalas responsive (`HeroSection.tsx`), no Inter/Poppins obligatorios."
        )
    if "fondo general" in t and ("página principal" in t or "bienvenida" in t):
        return (
            "Fondo de página: gradientes `from-muted/60 via-background` y hero con `from-primary/10` (`Home.tsx`, `HeroSection.tsx`), no el degradado beige fijo del texto legacy."
        )
    if "footer" in t and ("azul oscuro" in t or "4 columnas" in t):
        return (
            "Footer en `Footer.tsx`: grid 4 columnas en md+, enlaces a Buscar, Restaurantes, Acerca de, Contacto, Ayuda, Términos, Privacidad. "
            "Fondo `bg-background` (no azul oscuro uniforme). Nota: un bloque aún muestra el texto «Reservify» junto a la marca."
        )
    if "listo para tu próxima" in t or "experiencia culinaria" in t:
        return (
            "CTA en `CTASection.tsx`: titular «Tu próxima mesa está a un toque», fondo oscuro con halos primary/accent, "
            "no el texto ni el degradado naranja→verde del Excel."
        )
    if "reserva instantánea" in t and "para todos" in t:
        return (
            "Sección de beneficios en `FeaturesSection.tsx`: grid responsive con **6** tarjetas (3 columnas desde `md`), "
            "titulares distintos a «Reserva Instantánea / Para Todos / Los Mejores»."
        )
    if "chips" in t and ("italiana" in t or "categorías" in t or "categorias" in t):
        return "Categorías de cocina: carrusel en `CuisineCarousel.tsx` y lista amplia en `Home.tsx`; estilos con tokens Tailwind, no «fondo azul claro» fijo del Excel."
    if "barra de búsqueda" in t and "60%" in t:
        return "Búsqueda principal en `SearchBar.tsx` dentro del hero; layout responsive con Tailwind, no ancho 60% fijo obligatorio."
    if "disponible hoy" in t:
        return "Tarjetas de destacados en `RestaurantGrid.tsx` con datos de `/top`; comprobar si existe badge «Disponible hoy» según datos reales."
    if "lazy loading" in t or "webp" in t:
        return "`Home.tsx` usa `lazy`/`Suspense` para secciones; build Vite minifica JS/CSS. Cumplimiento de <3s depende de red y hosting."
    if "https" in t or "sql injection" in t or "xss" in t or "csrf" in t:
        return "HTTPS y protecciones de capa servidor/despliegue; el cliente usa `fetch` al backend y JWT en `localStorage` (`authService`, `Login.tsx`)."
    if "accesibilidad" in t or "4.5:1" in t:
        return "Componentes shadcn/Radix aportan patrones accesibles; no hay auditoría WCAG formal en el repo."

    # Login / registro
    if "google" in t:
        return "**No implementado:** no hay OAuth con Google en `Login.tsx` ni en `registrar.tsx` (solo email/contraseña y recuperación de contraseña en login)."
    if "olvido" in t or "olvidaste" in t:
        return "Flujo «¿Olvidaste tu contraseña?» con vistas email/código/reset en `Login.tsx` (no solo enlace estático)."
    if "inicio sesión" in t or "login" in t:
        if "validación" in t and ("vacío" in t or "obligatorio" in t):
            return "Validación de envío y errores vía estado/React y toasts (`Login.tsx`, `ToastProvider`)."
        if "modo oscuro" in t and "inicio sesión" in t:
            return "Tema claro/oscuro: clase `.dark` en `documentElement` (`theme-provider` / toggler); estilos en `AuthPageShell` y tokens CSS."
        return "Pantalla de acceso envuelta en `AuthPageShell` + `Header`; formulario en `Login.tsx` con tokens (`Input`, `Button`)."

    if "registro" in t:
        return "Registro en `registrar.tsx` con el mismo shell de autenticación que login."

    # Genérico por sección
    if "página principal" in t or "bienvenida" in t:
        return "Home compone `Header`, `HeroSection`, mapa opcional, `CuisineCarousel`, `RestaurantGrid`, `AboutSection`, `FeaturesSection`, `Footer` (`Home.tsx`)."

    if "descargar app" in t:
        return "**No implementado:** no hay CTA de descarga de aplicación móvil en el frontend actual."

    if "administrador" in t or "dueño" in t or "empleado" in t:
        return (
            "Vista en dashboards (`AdminDashboard.tsx`, `Dashboard.tsx`, `employee-dashboard.tsx`) con sidebar (`app-sidebar.tsx` / `Sidebar_2.tsx`) y componentes de métricas/tablas; "
            "colores y copy pueden no coincidir con los valores hex del Excel; tema claro/oscuro vía tokens."
        )

    if "cliente (home" in t:
        return (
            "Misma home pública `Home.tsx` para todos los visitantes; el modo oscuro altera tokens (`dark`). "
            "Textos del hero y CTAs son los de `HeroSection`/`CTASection`, no siempre los del Excel."
        )

    return (
        "Revisado frente a `frontend/src` (marzo 2026). Los valores pixel-perfect del Excel pueden diferir; "
        "la implementación usa **Google Sans**, variables `--primary` / `--secondary` / `--background` en `index.css` y utilidades Tailwind."
    )


def build_estado(title: str, note: str) -> str:
    if "No implementado" in note:
        return "  - **Estado:** No implementado / no aplica en el frontend actual."
    if "puede no coincidir" in note or "comprobar" in note.lower():
        return "  - **Estado:** Parcial — ver nota."
    if "no hay auditoría" in note.lower() or "depende de red" in note.lower():
        return "  - **Estado:** Parcial — ver nota."
    if "distintos a" in note.lower() or "no el texto" in note.lower():
        return "  - **Estado:** Parcial — ver nota."
    if "no coinciden" in note.lower():
        return "  - **Estado:** Parcial — ver nota."
    return "  - **Estado:** Cubierto en la medida del diseño actual (ver implementación)."


def parse_items(lines: list[str]) -> tuple[list[str], list[tuple[str, str, int]]]:
    """Devuelve (líneas_previas_al_primer_item, lista de (bloque_título, línea_estado, índice_fin))."""
    first = None
    for i, line in enumerate(lines):
        if line.startswith("- **NFF-"):
            first = i
            break
    if first is None:
        return lines, []

    preamble = lines[:first]
    items: list[tuple[str, str, int]] = []
    i = first
    while i < len(lines):
        if not lines[i].startswith("- **NFF-"):
            i += 1
            continue
        start = i
        body_lines = [lines[i]]
        i += 1
        while i < len(lines) and not lines[i].strip().startswith("- **Estado:**"):
            body_lines.append(lines[i])
            i += 1
        if i >= len(lines):
            break
        estado = lines[i]
        items.append(("\n".join(body_lines), estado, i))
        i += 1
    return preamble, items


def main() -> None:
    text = MD.read_text(encoding="utf-8")
    lines = text.splitlines()

    # Quitar bloques "Implementación actual" previos si se re-ejecuta el script
    lines = [ln for ln in lines if not ln.strip().startswith("- **Implementación actual:**")]

    preamble, items = parse_items(lines)
    if not items:
        raise SystemExit("No se encontraron ítems NFF")

    out: list[str] = []
    new_header = """### Requerimientos funcionales de interfaz (Frontend) — vista de usuario

> **Aclaración:** La hoja Excel se llama *REQ. no funcionales Frontend*, pero el contenido describe **lo que el usuario ve e interactúa** (pantallas, flujos, estilos). En documentación se tratan como **requisitos funcionales de UI/UX**.

> **Revisión:** Cada ítem conserva el ID histórico **NFF-xxx** y se añade **Implementación actual** según el código en `frontend/src` (marzo 2026).

> Fuente original: `md/docs/files/reservifyreq.v.1.3.xls.xlsx` → hoja **REQ. no funcionales Frontend**.
"""
    # Reemplazar preámbulo hasta el primer NFF
    out.append(new_header.rstrip("\n"))

    for body, estado_line_old, _ in items:
        m = re.search(r"NFF-(\d+)", body)
        nff = m.group(0) if m else "NFF"
        note = implementation_note(body)
        out.append("")
        out.append(body)
        out.append(build_estado(body, note))
        out.append(f"  - **Implementación actual:** {note}")

    MD.write_text("\n".join(out) + "\n", encoding="utf-8")
    print("OK:", MD, "items:", len(items))


if __name__ == "__main__":
    main()
