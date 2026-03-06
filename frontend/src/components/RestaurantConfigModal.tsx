import { useState, useEffect, useCallback } from "react";
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
import { Loader2, MapPin, Plus, Pencil, Trash2, UtensilsCrossed, UserCog, Building2, UserMinus } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { showErrorToast } from "../lib/toastHelpers";
import { AddressMapPicker } from "./AddressMapPicker";
import { getApiEndpoint } from "../config/api";
import {
  OwnerRestaurantConfigService,
  type RestauranteConfig,
  type RestauranteUpdateBody,
  type MesaConfig,
  type AdministradorConfig,
  type EmpleadoAsignable,
  type RestauranteDelDueno,
} from "../services/OwnerRestaurantConfigService";
import type { Restaurant } from "../types/dashboard";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

type TabId = "datos" | "mesas" | "admin";

interface RestaurantConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  restaurant: Restaurant | null;
}

export function RestaurantConfigModal({
  isOpen,
  onClose,
  onSuccess,
  restaurant,
}: RestaurantConfigModalProps) {
  const { toast } = useToast();
  const nit = restaurant ? parseInt(restaurant.id, 10) : 0;

  const [tab, setTab] = useState<TabId>("datos");
  const [restaurante, setRestaurante] = useState<RestauranteConfig | null>(null);
  const [mesas, setMesas] = useState<MesaConfig[]>([]);
  const [administrador, setAdministrador] = useState<AdministradorConfig | null>(null);
  const [empleados, setEmpleados] = useState<EmpleadoAsignable[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form edición restaurante
  const [form, setForm] = useState({
    nombre_restaurante: "",
    descripcion_restaurante: "",
    direccion: "",
    horario_apertura: "",
    horario_cierre: "",
    id_categoria: 0,
    documento: 0,
    min_anticipacion_horas: 0,
  });
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  // Nueva mesa (precioInput como string para permitir vacío y decimales al escribir)
  const [newMesa, setNewMesa] = useState({
    estado_de_disponibilidad: true,
    cant_personas: 2,
    precioInput: "",
  });
  const [addingMesa, setAddingMesa] = useState(false);
  const [editingMesaId, setEditingMesaId] = useState<number | null>(null);
  const [editMesaForm, setEditMesaForm] = useState({ cant_personas: 2, precioInput: "", estado_de_disponibilidad: true });

  // Asignar administrador
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [assigningAdmin, setAssigningAdmin] = useState(false);

  // Crear / asignar empleado
  const [empleadoEmail, setEmpleadoEmail] = useState("");
  const [buscandoEmail, setBuscandoEmail] = useState(false);
  const [modalAsignarEmpleado, setModalAsignarEmpleado] = useState<{ id_credencial: number; email: string } | null>(null);
  const [modalCrearUsuarioConfirm, setModalCrearUsuarioConfirm] = useState<{ email: string } | null>(null);
  const [creandoEmpleado, setCreandoEmpleado] = useState(false);
  const [modalCredenciales, setModalCredenciales] = useState<{ email: string; password: string } | null>(null);
  const [asignandoEmpleado, setAsignandoEmpleado] = useState(false);
  const [restaurantesDelDueno, setRestaurantesDelDueno] = useState<RestauranteDelDueno[]>([]);
  const [selectedNitAsignar, setSelectedNitAsignar] = useState<number>(0);
  const [selectedNitCrear, setSelectedNitCrear] = useState<number>(0);
  const [cambiandoRolId, setCambiandoRolId] = useState<number | null>(null);

  const loadAll = useCallback(async () => {
    if (!nit || !isOpen) return;
    setLoading(true);
    try {
      const [catRes, configRes, mesasRes, adminRes, empRes, restList] = await Promise.all([
        fetch(getApiEndpoint("/categorias/listar_categorias"), {
          headers: { "Content-Type": "application/json" },
        }).then((r) => r.json()),
        OwnerRestaurantConfigService.getRestauranteConfig(nit),
        OwnerRestaurantConfigService.getMesas(nit),
        OwnerRestaurantConfigService.getAdministrador(nit),
        OwnerRestaurantConfigService.getEmpleados(),
        OwnerRestaurantConfigService.getRestaurantesDelDueno(),
      ]);

      const catList = Array.isArray(catRes) ? catRes : catRes?.respuesta ?? [];
      setCategorias(catList);
      setRestaurante(configRes ?? null);
      setMesas(Array.isArray(mesasRes) ? mesasRes : []);
      setAdministrador(adminRes ?? null);
      setEmpleados(Array.isArray(empRes) ? empRes : []);
      setRestaurantesDelDueno(Array.isArray(restList) ? restList : []);

      if (configRes) {
        const hA = configRes.horario_apertura?.slice(0, 5) || "";
        const hC = configRes.horario_cierre?.slice(0, 5) || "";
        setForm({
          nombre_restaurante: configRes.nombre_restaurante ?? "",
          descripcion_restaurante: configRes.descripcion_restaurante ?? "",
          direccion: configRes.direccion ?? "",
          horario_apertura: hA,
          horario_cierre: hC,
          id_categoria: configRes.id_categoria ?? 0,
          documento: configRes.documento ?? 0,
          min_anticipacion_horas: configRes.min_anticipacion_horas ?? 0,
        });
      }
      if (adminRes) setSelectedAdminId(String(adminRes.id_credencial));
      else setSelectedAdminId("");
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración del restaurante.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [nit, isOpen, toast]);

  useEffect(() => {
    if (isOpen && nit) loadAll();
  }, [isOpen, nit, loadAll]);

  const handleSaveRestaurante = async () => {
    if (!restaurante || !nit) return;
    setSaving(true);
    try {
      const body: RestauranteUpdateBody = {
        nit,
        direccion: form.direccion.trim(),
        nombre_restaurante: form.nombre_restaurante.trim(),
        descripcion_restaurante: form.descripcion_restaurante.trim(),
        horario_apertura: form.horario_apertura.length === 5 ? form.horario_apertura + ":00" : form.horario_apertura,
        horario_cierre: form.horario_cierre.length === 5 ? form.horario_cierre + ":00" : form.horario_cierre,
        documento: form.documento,
        id_categoria: form.id_categoria,
        min_anticipacion_horas: Math.max(0, Number.isFinite(form.min_anticipacion_horas) ? form.min_anticipacion_horas : 0),
      };
      await OwnerRestaurantConfigService.putRestauranteConfig(nit, body);
      toast({ title: "Guardado", description: "Datos del restaurante actualizados." });
      loadAll();
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMesa = async () => {
    if (!nit) return;
    setAddingMesa(true);
    try {
      const precioNum = parseFloat(newMesa.precioInput.replace(",", ".")) || 0;
      await OwnerRestaurantConfigService.addMesa(nit, {
        estado_de_disponibilidad: true,
        cant_personas: newMesa.cant_personas,
        precio: precioNum,
        nit,
      });
      toast({ title: "Mesa agregada", description: "La mesa se ha añadido correctamente." });
      const list = await OwnerRestaurantConfigService.getMesas(nit);
      setMesas(list);
      setNewMesa({ estado_de_disponibilidad: true, cant_personas: 2, precioInput: "" });
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al agregar mesa.");
    } finally {
      setAddingMesa(false);
    }
  };

  const handleUpdateMesa = async () => {
    if (!nit || editingMesaId == null) return;
    setAddingMesa(true);
    try {
      const precioNum = parseFloat(editMesaForm.precioInput.replace(",", ".")) || 0;
      await OwnerRestaurantConfigService.updateMesa(nit, editingMesaId, {
        id_mesa: editingMesaId,
        nit,
        estado_de_disponibilidad: editMesaForm.estado_de_disponibilidad,
        cant_personas: editMesaForm.cant_personas,
        precio: precioNum,
      });
      toast({ title: "Mesa actualizada", description: "Cambios guardados." });
      const list = await OwnerRestaurantConfigService.getMesas(nit);
      setMesas(list);
      setEditingMesaId(null);
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al editar mesa.");
    } finally {
      setAddingMesa(false);
    }
  };

  const handleDeleteMesa = async (id_mesa: number) => {
    if (!nit) return;
    if (!confirm("¿Eliminar esta mesa?")) return;
    try {
      await OwnerRestaurantConfigService.deleteMesa(nit, id_mesa);
      toast({ title: "Mesa eliminada", description: "La mesa se ha eliminado." });
      const list = await OwnerRestaurantConfigService.getMesas(nit);
      setMesas(list);
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al eliminar mesa.");
    }
  };

  const handleAssignAdmin = async () => {
    if (!nit || !selectedAdminId) return;
    setAssigningAdmin(true);
    try {
      await OwnerRestaurantConfigService.putAdministrador(nit, parseInt(selectedAdminId, 10));
      toast({ title: "Administrador asignado", description: "Un solo administrador por restaurante." });
      const admin = await OwnerRestaurantConfigService.getAdministrador(nit);
      setAdministrador(admin ?? null);
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al asignar administrador.");
    } finally {
      setAssigningAdmin(false);
    }
  };

  const handleBuscarEmailEmpleado = async () => {
    const email = empleadoEmail.trim();
    if (!email) {
      toast({ title: "Correo requerido", description: "Escribe el correo del empleado.", variant: "destructive" });
      return;
    }
    setBuscandoEmail(true);
    try {
      const res = await OwnerRestaurantConfigService.buscarEmail(email);
      if (res.existe && res.id_credencial != null) {
        setSelectedNitAsignar(nit);
        setModalAsignarEmpleado({ id_credencial: res.id_credencial, email });
      } else {
        setSelectedNitCrear(nit);
        setModalCrearUsuarioConfirm({ email });
      }
    } catch (e) {
      showErrorToast(toast, e, "No se pudo buscar el correo.");
    } finally {
      setBuscandoEmail(false);
    }
  };

  const handleConfirmarAsignarEmpleado = async () => {
    if (!selectedNitAsignar || !modalAsignarEmpleado) return;
    setAsignandoEmpleado(true);
    try {
      await OwnerRestaurantConfigService.asignarEmpleado(selectedNitAsignar, modalAsignarEmpleado.id_credencial);
      toast({ title: "Empleado asignado", description: "La persona fue asignada al restaurante." });
      setModalAsignarEmpleado(null);
      setEmpleadoEmail("");
      loadAll();
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al asignar empleado.");
    } finally {
      setAsignandoEmpleado(false);
    }
  };

  const handleCambiarRolCliente = async (id_credencial: number) => {
    setCambiandoRolId(id_credencial);
    try {
      await OwnerRestaurantConfigService.cambiarRolACliente(id_credencial);
      toast({ title: "Rol actualizado", description: "El usuario ahora es cliente." });
      loadAll();
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al cambiar rol.");
    } finally {
      setCambiandoRolId(null);
    }
  };

  const handleConfirmarCrearEmpleado = async () => {
    if (!selectedNitCrear || !modalCrearUsuarioConfirm) return;
    setCreandoEmpleado(true);
    try {
      const { email, password } = await OwnerRestaurantConfigService.crearEmpleado(selectedNitCrear, modalCrearUsuarioConfirm.email);
      setModalCrearUsuarioConfirm(null);
      setModalCredenciales({ email, password });
      setEmpleadoEmail("");
      loadAll();
      onSuccess();
    } catch (e) {
      showErrorToast(toast, e, "Error al crear empleado.");
    } finally {
      setCreandoEmpleado(false);
    }
  };

  if (!restaurant) return null;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "datos", label: "Datos del restaurante", icon: <Building2 className="h-4 w-4" /> },
    { id: "mesas", label: "Mesas", icon: <UtensilsCrossed className="h-4 w-4" /> },
    { id: "admin", label: "Empleados", icon: <UserCog className="h-4 w-4" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Configuración: {restaurant.name}</DialogTitle>
          <DialogDescription>
            Edita los datos del restaurante, gestiona mesas y asigna un único administrador.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 border-b pb-2">
          {tabs.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant={tab === t.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab(t.id)}
              className="gap-1"
            >
              {t.icon}
              {t.label}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {tab === "datos" && restaurante && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Nombre del restaurante</Label>
                    <Input
                      value={form.nombre_restaurante}
                      onChange={(e) => setForm((p) => ({ ...p, nombre_restaurante: e.target.value }))}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={form.descripcion_restaurante}
                      onChange={(e) => setForm((p) => ({ ...p, descripcion_restaurante: e.target.value }))}
                      placeholder="Descripción"
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Dirección</Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.direccion}
                        onChange={(e) => setForm((p) => ({ ...p, direccion: e.target.value }))}
                        placeholder="Dirección"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsMapPickerOpen(true)}
                        title="Elegir en mapa"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <AddressMapPicker
                      isOpen={isMapPickerOpen}
                      onClose={() => setIsMapPickerOpen(false)}
                      onSelect={(address) => setForm((p) => ({ ...p, direccion: address }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Hora apertura</Label>
                      <Input
                        type="time"
                        value={form.horario_apertura}
                        onChange={(e) => setForm((p) => ({ ...p, horario_apertura: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Hora cierre</Label>
                      <Input
                        type="time"
                        value={form.horario_cierre}
                        onChange={(e) => setForm((p) => ({ ...p, horario_cierre: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Antelación mínima para reservar</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={form.min_anticipacion_horas}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            min_anticipacion_horas: Number.parseInt(e.target.value, 10) || 0,
                          }))
                        }
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">
                        horas (ej: 24 = 1 día de antelación)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Establece cuántas horas antes debe hacerse la reserva como mínimo para dar tiempo a organizar las mesas.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Categoría</Label>
                    <Select
                      value={form.id_categoria ? String(form.id_categoria) : ""}
                      onValueChange={(v) => setForm((p) => ({ ...p, id_categoria: parseInt(v, 10) || 0 }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((c) => (
                          <SelectItem key={c.id_categoria} value={String(c.id_categoria)}>
                            {c.nombre_categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSaveRestaurante} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Guardar datos
                  </Button>
                </div>
              )}

              {tab === "mesas" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-end gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="grid gap-1">
                      <Label className="text-xs">Personas</Label>
                      <Input
                        type="number"
                        min={1}
                        value={newMesa.cant_personas}
                        onChange={(e) =>
                          setNewMesa((p) => ({ ...p, cant_personas: parseInt(e.target.value, 10) || 1 }))
                        }
                        className="w-20"
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-xs">Precio</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={newMesa.precioInput}
                        onChange={(e) => {
                          const v = e.target.value.replace(",", ".");
                          if (v === "" || /^\d*\.?\d*$/.test(v)) setNewMesa((p) => ({ ...p, precioInput: v }));
                        }}
                        className="w-24"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Nuevas mesas se crean disponibles por defecto.</p>
                    <Button size="sm" onClick={handleAddMesa} disabled={addingMesa}>
                      {addingMesa ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      Agregar mesa
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {mesas.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">No hay mesas. Agrega una arriba.</p>
                    ) : (
                      mesas.map((m) => (
                        <div
                          key={m.id_mesa}
                          className="flex items-center justify-between gap-2 p-2 border rounded-md bg-card"
                        >
                          {editingMesaId === m.id_mesa ? (
                            <>
                              <Input
                                type="number"
                                min={1}
                                value={editMesaForm.cant_personas}
                                onChange={(e) =>
                                  setEditMesaForm((p) => ({ ...p, cant_personas: parseInt(e.target.value, 10) || 1 }))
                                }
                                className="w-20"
                              />
                              <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                value={editMesaForm.precioInput}
                                onChange={(e) => {
                                  const v = e.target.value.replace(",", ".");
                                  if (v === "" || /^\d*\.?\d*$/.test(v)) setEditMesaForm((p) => ({ ...p, precioInput: v }));
                                }}
                                className="w-24"
                              />
                              <label className="flex items-center gap-1 text-sm">
                                <input
                                  type="checkbox"
                                  checked={editMesaForm.estado_de_disponibilidad}
                                  onChange={(e) =>
                                    setEditMesaForm((p) => ({ ...p, estado_de_disponibilidad: e.target.checked }))
                                  }
                                />
                                Disponible
                              </label>
                              <Button size="sm" onClick={handleUpdateMesa} disabled={addingMesa}>
                                Guardar
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingMesaId(null)}>
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="text-sm">
                                Mesa {m.id_mesa} — {m.cant_personas} personas, ${m.precio}
                                {m.estado_de_disponibilidad ? " · Disponible" : " · No disponible"}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setEditingMesaId(m.id_mesa);
                                    setEditMesaForm({
                                      cant_personas: m.cant_personas,
                                      precioInput: m.precio != null ? String(m.precio) : "",
                                      estado_de_disponibilidad: m.estado_de_disponibilidad,
                                    });
                                  }}
                                  aria-label="Editar mesa"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteMesa(m.id_mesa)}
                                  aria-label="Eliminar mesa"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {tab === "admin" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Solo puedes tener un administrador por restaurante. Asigna a un empleado que ya trabaje en alguno de
                    tus restaurantes.
                  </p>
                  {administrador && (
                    <div className="p-3 rounded-lg border bg-muted/30">
                      <Label className="text-xs text-muted-foreground">Administrador actual</Label>
                      <p className="font-medium">
                        {administrador.nombre} {administrador.apellido}
                      </p>
                      <p className="text-sm text-muted-foreground">{administrador.email}</p>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label>Asignar administrador</Label>
                    <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {empleados.map((emp) => (
                          <SelectItem key={emp.id_credencial} value={String(emp.id_credencial)}>
                            {emp.nombre} {emp.apellido} — {emp.email} ({emp.nombre_rol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAssignAdmin} disabled={!selectedAdminId || assigningAdmin}>
                      {assigningAdmin ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Asignar administrador
                    </Button>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-2">
                    <Label>Empleados y administradores</Label>
                    <p className="text-sm text-muted-foreground">
                      Puedes eliminar a cualquier empleado o administrador de tus restaurantes.
                    </p>
                    {empleados.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">No hay empleados o administradores.</p>
                    ) : (
                      <div className="space-y-2">
                        {empleados.map((emp) => (
                          <div
                            key={emp.id_credencial}
                            className="flex items-center justify-between gap-2 p-2 border rounded-md bg-card"
                          >
                            <span className="text-sm">
                              {emp.nombre} {emp.apellido} — {emp.email}
                              <span className="text-muted-foreground ml-1">({emp.nombre_rol})</span>
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleCambiarRolCliente(emp.id_credencial)}
                              disabled={cambiandoRolId === emp.id_credencial}
                              aria-label="Cambiar a cliente"
                            >
                              {cambiandoRolId === emp.id_credencial ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Eliminar empleado
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-2">
                    <Label>Crear empleado</Label>
                    <p className="text-sm text-muted-foreground">
                      Escribe el correo. Si ya existe, podrás asignarlo como empleado; si no, se creará un usuario con contraseña aleatoria.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={empleadoEmail}
                        onChange={(e) => setEmpleadoEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleBuscarEmailEmpleado()}
                        className="flex-1"
                      />
                      <Button onClick={handleBuscarEmailEmpleado} disabled={buscandoEmail}>
                        {buscandoEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Agregar empleado
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Modal: ¿Asignar a esta persona como empleado? (email ya existe) */}
      <Dialog open={!!modalAsignarEmpleado} onOpenChange={(open) => !open && setModalAsignarEmpleado(null)}>
        <DialogContent className="sm:max-w-[400px]" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Asignar como empleado</DialogTitle>
            <DialogDescription>
              ¿Quieres asignar a esta persona como empleado?
            </DialogDescription>
          </DialogHeader>
          {modalAsignarEmpleado && (
            <>
              <p className="text-sm text-foreground py-1">{modalAsignarEmpleado.email}</p>
              <div className="grid gap-2 py-2">
                <Label>¿A qué restaurante quieres agregarlo?</Label>
                <Select
                  value={selectedNitAsignar ? String(selectedNitAsignar) : ""}
                  onValueChange={(v) => setSelectedNitAsignar(parseInt(v, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un restaurante" />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurantesDelDueno.map((r) => (
                      <SelectItem key={r.nit} value={String(r.nit)}>
                        {r.nombre_restaurante || `Restaurante ${r.nit}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalAsignarEmpleado(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarAsignarEmpleado} disabled={asignandoEmpleado || !selectedNitAsignar}>
              {asignandoEmpleado ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: ¿Crear este usuario para el restaurante? (email no existe) */}
      <Dialog open={!!modalCrearUsuarioConfirm} onOpenChange={(open) => !open && setModalCrearUsuarioConfirm(null)}>
        <DialogContent className="sm:max-w-[400px]" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Crear usuario</DialogTitle>
            <DialogDescription>
              ¿Quieres crear este usuario como empleado? Se generará una contraseña aleatoria que podrás entregar al empleado.
            </DialogDescription>
          </DialogHeader>
          {modalCrearUsuarioConfirm && (
            <>
              <p className="text-sm text-foreground py-1">{modalCrearUsuarioConfirm.email}</p>
              <div className="grid gap-2 py-2">
                <Label>¿A qué restaurante quieres agregarlo?</Label>
                <Select
                  value={selectedNitCrear ? String(selectedNitCrear) : ""}
                  onValueChange={(v) => setSelectedNitCrear(parseInt(v, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un restaurante" />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurantesDelDueno.map((r) => (
                      <SelectItem key={r.nit} value={String(r.nit)}>
                        {r.nombre_restaurante || `Restaurante ${r.nit}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalCrearUsuarioConfirm(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarCrearEmpleado} disabled={creandoEmpleado || !selectedNitCrear}>
              {creandoEmpleado ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sí
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Mostrar correo y contraseña generada */}
      <Dialog open={!!modalCredenciales} onOpenChange={(open) => !open && setModalCredenciales(null)}>
        <DialogContent className="sm:max-w-[420px]" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Credenciales del empleado</DialogTitle>
            <DialogDescription>
              Entrega estos datos al empleado para que pueda acceder a su dashboard. La contraseña no se volverá a mostrar.
            </DialogDescription>
          </DialogHeader>
          {modalCredenciales && (
            <div className="space-y-3 py-2">
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Correo</Label>
                <p className="font-mono text-sm bg-muted px-3 py-2 rounded break-all">{modalCredenciales.email}</p>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Contraseña</Label>
                <p className="font-mono text-sm bg-muted px-3 py-2 rounded break-all select-all">{modalCredenciales.password}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(modalCredenciales!.password);
                  toast({ title: "Copiado", description: "Contraseña copiada al portapapeles." });
                }}
              >
                Copiar contraseña
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setModalCredenciales(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
