"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2, ImagePlus, X, MapPin } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { getApiEndpoint } from "../config/api";
import { authFetch } from "../services/authService";
import { AddressMapPicker } from "./AddressMapPicker";

export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export interface AddRestaurantForm {
  nit: string;
  nombre_restaurante: string;
  descripcion_restaurante: string;
  direccion: string;
  horario_apertura: string;
  horario_cierre: string;
  id_categoria: string;
  url_imagen: string;
  imagenes_referencia: string[];
}

const initialForm: AddRestaurantForm = {
  nit: "",
  nombre_restaurante: "",
  descripcion_restaurante: "",
  direccion: "",
  horario_apertura: "",
  horario_cierre: "",
  id_categoria: "",
  url_imagen: "",
  imagenes_referencia: [],
};

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRestaurantModal({
  isOpen,
  onClose,
  onSuccess,
}: AddRestaurantModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<AddRestaurantForm>(initialForm);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddRestaurantForm, string>>>({});
  const [newCategoriaNombre, setNewCategoriaNombre] = useState("");
  const [isAddingCategoria, setIsAddingCategoria] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingRef, setUploadingRef] = useState<number | null>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const refImageInputRef = useRef<HTMLInputElement>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [showVerImagenesRef, setShowVerImagenesRef] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setErrors({});
      setNewCategoriaNombre("");
      loadCategorias();
    }
  }, [isOpen]);

  const loadCategorias = async (): Promise<Categoria[]> => {
    setIsLoadingCategorias(true);
    try {
      const res = await fetch(getApiEndpoint("/categorias/listar_categorias"), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.respuesta ?? []);
      setCategorias(list);
      return list;
    } catch (e) {
      console.error("Error al cargar categorías:", e);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoadingCategorias(false);
    }
  };

  const handleAddCategoria = async () => {
    const nombre = newCategoriaNombre.trim();
    if (!nombre) {
      toast({ title: "Campo requerido", description: "Escribe el nombre de la categoría.", variant: "destructive" });
      return;
    }
    setIsAddingCategoria(true);
    try {
      const res = await authFetch(getApiEndpoint("/categorias/insertarcategoria"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_categoria: nombre }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Error al crear categoría");
      }
      toast({ title: "Categoría creada", description: "Se agregó correctamente." });
      setNewCategoriaNombre("");
      const list = await loadCategorias();
      const nueva = list.find((c) => c.nombre_categoria.toLowerCase() === nombre.toLowerCase());
      if (nueva) update("id_categoria", String(nueva.id_categoria));
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo crear la categoría.",
        variant: "destructive",
      });
    } finally {
      setIsAddingCategoria(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const makeRequest = async (token: string | null): Promise<Response> => {
      const formData = new FormData();
      formData.append("file", file);
      
      // Para FormData, NO establecer Content-Type manualmente - el navegador lo hace automáticamente
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      return fetch(getApiEndpoint("/restaurante/upload-imagen"), {
        method: "POST",
        headers: headers, // Solo Authorization, sin Content-Type para FormData
        body: formData,
      });
    };
    
    const token = localStorage.getItem("access_token");
    let res = await makeRequest(token);
    
    // Si es 401, intentar refrescar el token y reintentar
    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await fetch(getApiEndpoint("/credenciales/refresh"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData.access_token;
            if (newToken) {
              localStorage.setItem("access_token", newToken);
              // Reintentar con el nuevo token (crear nuevo FormData)
              res = await makeRequest(newToken);
            } else {
              throw new Error("No se recibió nuevo token");
            }
          } else {
            // Si el refresh falla, redirigir a login
            localStorage.clear();
            window.location.href = "/Login";
            throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
          }
        } catch (refreshError) {
          // Si el refresh falla, redirigir a login
          localStorage.clear();
          window.location.href = "/Login";
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
      } else {
        localStorage.clear();
        window.location.href = "/Login";
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }
    }
    
    if (!res.ok) {
      let errorMessage = "Error al subir imagen";
      try {
        const err = await res.json();
        errorMessage = err?.detail || err?.message || `Error ${res.status}: ${res.statusText}`;
      } catch {
        errorMessage = `Error ${res.status}: ${res.statusText}`;
      }
      console.error("Error al subir imagen:", {
        status: res.status,
        statusText: res.statusText,
        errorMessage,
      });
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    const url = data?.url;
    if (!url || typeof url !== "string") {
      console.error("Respuesta del servidor sin URL:", data);
      throw new Error("El servidor no devolvió la URL de la imagen");
    }
    return url;
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No se seleccionó ningún archivo.",
        variant: "destructive",
      });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "El archivo debe ser una imagen.",
        variant: "destructive",
      });
      return;
    }
    setUploadingMain(true);
    try {
      const url = await uploadImage(file);
      update("url_imagen", url);
      toast({ title: "Imagen principal", description: "Subida correctamente." });
    } catch (err) {
      console.error("Error en handleMainImageChange:", err);
      toast({
        title: "Error al subir imagen",
        description: err instanceof Error ? err.message : "Error al subir la imagen. Verifica tu conexión y que Cloudinary esté configurado.",
        variant: "destructive",
      });
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  };

  const handleRefImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No se seleccionó ningún archivo.",
        variant: "destructive",
      });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "El archivo debe ser una imagen.",
        variant: "destructive",
      });
      return;
    }
    if (form.imagenes_referencia.length >= 15) {
      toast({ title: "Límite", description: "Máximo 15 imágenes de referencia.", variant: "destructive" });
      return;
    }
    setUploadingRef(form.imagenes_referencia.length);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        imagenes_referencia: [...prev.imagenes_referencia, url],
      }));
      toast({ title: "Imagen de referencia", description: "Agregada correctamente." });
    } catch (err) {
      console.error("Error en handleRefImageChange:", err);
      toast({
        title: "Error al subir imagen",
        description: err instanceof Error ? err.message : "Error al subir la imagen. Verifica tu conexión y que Cloudinary esté configurado.",
        variant: "destructive",
      });
    } finally {
      setUploadingRef(null);
      e.target.value = "";
    }
  };

  const removeRefImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imagenes_referencia: prev.imagenes_referencia.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof AddRestaurantForm, string>> = {};
    const nitNum = form.nit.trim();
    if (!nitNum) next.nit = "El NIT es obligatorio.";
    else if (!/^\d{1,10}$/.test(nitNum)) next.nit = "El NIT debe ser numérico (máx. 10 dígitos).";
    if (!form.nombre_restaurante.trim()) next.nombre_restaurante = "El nombre es obligatorio.";
    if (!form.descripcion_restaurante.trim()) next.descripcion_restaurante = "La descripción es obligatoria.";
    if (!form.direccion.trim()) next.direccion = "La dirección es obligatoria.";
    if (!form.horario_apertura) next.horario_apertura = "La hora de apertura es obligatoria.";
    if (!form.horario_cierre) next.horario_cierre = "La hora de cierre es obligatoria.";
    if (form.horario_apertura && form.horario_cierre && form.horario_apertura >= form.horario_cierre) {
      next.horario_cierre = "La hora de cierre debe ser posterior a la de apertura.";
    }
    if (!form.id_categoria) next.id_categoria = "La categoría es obligatoria.";
    if (form.id_categoria === "__otro__") next.id_categoria = "Escribe y agrega una nueva categoría abajo o elige una de la lista.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const documento = localStorage.getItem("documento");
    if (!documento) {
      toast({
        title: "Sesión",
        description: "Debes iniciar sesión como dueño para agregar un restaurante.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        nit: parseInt(form.nit.trim(), 10),
        nombre_restaurante: form.nombre_restaurante.trim(),
        descripcion_restaurante: form.descripcion_restaurante.trim(),
        direccion: form.direccion.trim(),
        horario_apertura: form.horario_apertura.length === 5 ? form.horario_apertura + ":00" : form.horario_apertura,
        horario_cierre: form.horario_cierre.length === 5 ? form.horario_cierre + ":00" : form.horario_cierre,
        documento: parseInt(documento, 10),
        id_categoria: parseInt(form.id_categoria, 10),
        url_imagen: form.url_imagen.trim() || "",
        imagenes_referencia: form.imagenes_referencia.filter((u) => u.trim()).slice(0, 15),
      };

      const res = await authFetch(getApiEndpoint("/restaurante/insertarrestaurante"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Error ${res.status}`);
      }

      toast({
        title: "Restaurante creado",
        description: "El restaurante se ha registrado correctamente.",
      });
      onSuccess();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear el restaurante.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (key: keyof AddRestaurantForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={true}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar restaurante</DialogTitle>
            <DialogDescription>
              Completa todos los campos. Todos son obligatorios.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nit">NIT *</Label>
              <Input
                id="nit"
                placeholder="Ej: 900123456"
                value={form.nit}
                onChange={(e) => update("nit", e.target.value)}
                aria-invalid={!!errors.nit}
              />
              {errors.nit && (
                <p className="text-sm text-destructive">{errors.nit}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nombre_restaurante">Nombre del restaurante *</Label>
              <Input
                id="nombre_restaurante"
                placeholder="Ej: La Bella Vista"
                value={form.nombre_restaurante}
                onChange={(e) => update("nombre_restaurante", e.target.value)}
                aria-invalid={!!errors.nombre_restaurante}
              />
              {errors.nombre_restaurante && (
                <p className="text-sm text-destructive">{errors.nombre_restaurante}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion_restaurante">Descripción *</Label>
              <Textarea
                id="descripcion_restaurante"
                placeholder="Breve descripción del restaurante"
                value={form.descripcion_restaurante}
                onChange={(e) => update("descripcion_restaurante", e.target.value)}
                rows={2}
                className="resize-none"
                aria-invalid={!!errors.descripcion_restaurante}
              />
              {errors.descripcion_restaurante && (
                <p className="text-sm text-destructive">{errors.descripcion_restaurante}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <div className="flex gap-2">
                <Input
                  id="direccion"
                  placeholder="Elige en el mapa o escribe"
                  value={form.direccion}
                  onChange={(e) => update("direccion", e.target.value)}
                  aria-invalid={!!errors.direccion}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMapPickerOpen(true)}
                  title="Elegir dirección en el mapa"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Haz clic en el icono del mapa para colocar la dirección.
              </p>
              {errors.direccion && (
                <p className="text-sm text-destructive">{errors.direccion}</p>
              )}
            </div>
            <AddressMapPicker
              isOpen={isMapPickerOpen}
              onClose={() => setIsMapPickerOpen(false)}
              onSelect={(address) => update("direccion", address)}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="horario_apertura">Hora de apertura *</Label>
                <Input
                  id="horario_apertura"
                  type="time"
                  value={form.horario_apertura}
                  onChange={(e) => update("horario_apertura", e.target.value)}
                  aria-invalid={!!errors.horario_apertura}
                />
                {errors.horario_apertura && (
                  <p className="text-sm text-destructive">{errors.horario_apertura}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="horario_cierre">Hora de cierre *</Label>
                <Input
                  id="horario_cierre"
                  type="time"
                  value={form.horario_cierre}
                  onChange={(e) => update("horario_cierre", e.target.value)}
                  aria-invalid={!!errors.horario_cierre}
                />
                {errors.horario_cierre && (
                  <p className="text-sm text-destructive">{errors.horario_cierre}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Categoría *</Label>
              <Select
                value={form.id_categoria}
                onValueChange={(v) => update("id_categoria", v)}
                disabled={isLoadingCategorias}
              >
                <SelectTrigger aria-invalid={!!errors.id_categoria}>
                  <SelectValue placeholder={isLoadingCategorias ? "Cargando..." : "Selecciona una categoría"} />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id_categoria} value={String(c.id_categoria)}>
                      {c.nombre_categoria}
                    </SelectItem>
                  ))}
                  <SelectItem value="__otro__">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.id_categoria && (
                <p className="text-sm text-destructive">{errors.id_categoria}</p>
              )}
              {form.id_categoria === "__otro__" && (
                <div className="flex gap-2 items-end pt-1">
                  <div className="grid gap-1 flex-1">
                    <Label htmlFor="new_categoria">Nueva categoría</Label>
                    <Input
                      id="new_categoria"
                      placeholder="Ej: Comida Rápida"
                      value={newCategoriaNombre}
                      onChange={(e) => setNewCategoriaNombre(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCategoria}
                    disabled={isAddingCategoria}
                  >
                    {isAddingCategoria ? <Loader2 className="h-4 w-4 animate-spin" /> : "Insertar"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Imagen principal (inicio)</Label>
              <div className="flex gap-2 items-center flex-wrap">
                <input
                  ref={mainImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => mainImageInputRef.current?.click()}
                  disabled={uploadingMain}
                >
                  {uploadingMain ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4 mr-1" />}
                  {uploadingMain ? "Subiendo..." : "Subir imagen principal"}
                </Button>
                {form.url_imagen && (
                  <a href={form.url_imagen} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate max-w-[200px]">
                    Ver imagen
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Imágenes de referencia (máx. 15)</Label>
              <p className="text-xs text-muted-foreground">
                Se guardan temporalmente hasta que cierres el modal o crees el restaurante.
              </p>
              <input
                ref={refImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleRefImageChange}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refImageInputRef.current?.click()}
                  disabled={form.imagenes_referencia.length >= 15 || uploadingRef !== null}
                >
                  {uploadingRef !== null ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ImagePlus className="h-4 w-4 mr-1" />}
                  {form.imagenes_referencia.length >= 15
                    ? "Máximo alcanzado (15)"
                    : uploadingRef !== null
                      ? "Subiendo..."
                      : `Agregar imagen (${form.imagenes_referencia.length}/15)`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVerImagenesRef(true)}
                >
                  Ver imágenes ({form.imagenes_referencia.length})
                </Button>
              </div>
            </div>

            <Dialog open={showVerImagenesRef} onOpenChange={(open) => !open && setShowVerImagenesRef(false)}>
              <DialogContent className="sm:max-w-[480px]" showCloseButton={true}>
                <DialogHeader>
                  <DialogTitle>Imágenes de referencia</DialogTitle>
                  <DialogDescription>
                    Imágenes agregadas temporalmente. Puedes descartar las que no quieras usar.
                  </DialogDescription>
                </DialogHeader>
                {form.imagenes_referencia.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No hay imágenes agregadas. Usa &quot;Agregar imagen&quot; en el formulario.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 max-h-[320px] overflow-y-auto py-2">
                    {form.imagenes_referencia.map((url, index) => (
                      <div key={url} className="relative group rounded-lg border overflow-hidden bg-muted aspect-square">
                        <img
                          src={url}
                          alt={`Referencia ${index + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            t.onerror = null;
                            t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' fill='%23999' text-anchor='middle' dy='.3em' font-size='12'%3EError%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-7 w-7 opacity-90 hover:opacity-100"
                          onClick={() => {
                            removeRefImage(index);
                            if (form.imagenes_referencia.length <= 1) setShowVerImagenesRef(false);
                          }}
                          aria-label="Descartar imagen"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowVerImagenesRef(false)}>
                    Cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear restaurante"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
