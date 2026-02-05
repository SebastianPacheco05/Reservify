"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "../hooks/useToast";

interface Cliente {
  id_cliente: number;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  nacionalidad: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
  onUpdate: (updatedCliente: Cliente) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  cliente,
  onUpdate,
}: EditProfileModalProps) {
  const { toast } = useToast();

  // Estados del formulario (adaptados de tu código original)
  const [idCliente, setIdCliente] = useState("");
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [tipo_documento, setTipo_documento] = useState("");
  const [numero_documento, setNumero_documento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [idCredencial, setIdCredencial] = useState("");
  const [idRol, setIdRol] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (isOpen && cliente) {
      setIdCliente(cliente.id_cliente.toString());
      setNombre1(cliente.nombre1);
      setNombre2(cliente.nombre2);
      setApellido1(cliente.apellido1);
      setApellido2(cliente.apellido2);
      setNacionalidad(cliente.nacionalidad);
      setTipo_documento(cliente.tipo_documento);
      setNumero_documento(cliente.numero_documento);
      setTelefono(cliente.telefono);

      // Cargar datos adicionales del cliente
      fetch(`${import.meta.env.VITE_API_URL || "http://10.5.213.111:1106"}/listar_cliente`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente: cliente.id_cliente }),
      })
        .then((res) => res.json())
        .then((data) => {
          const clienteData = data.respuesta;
          if (clienteData) {
            setIdCredencial(clienteData.id_credencial);
            setIdRol(clienteData.id_rol);
          }
        })
        .catch((error) => {
          console.error("Error loading client data:", error);
        });
    }
  }, [isOpen, cliente]);

  // Función de envío adaptada de tu código original
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://10.5.213.111:1106"}/editarcliente`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente: Number(idCliente),
          id_credencial: Number(idCredencial),
          nombre1,
          nombre2,
          apellido1,
          apellido2,
          tipo_documento,
          documento: Number(numero_documento),
          nacionalidad,
          telefono,
          id_rol: Number(idRol),
        }),
      });

      if (response.ok) {
        // Actualizar el cliente en el componente padre
        const updatedCliente: Cliente = {
          id_cliente: Number(idCliente),
          nombre1,
          nombre2,
          apellido1,
          apellido2,
          nacionalidad,
          tipo_documento,
          numero_documento,
          telefono,
        };

        onUpdate(updatedCliente);

        toast({
          title: "Perfil actualizado",
          description: "Tu información ha sido actualizada correctamente.",
        });
      } else {
        throw new Error("Error al actualizar el perfil");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal. Los campos marcados con * son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre1">Primer Nombre *</Label>
              <Input
                id="nombre1"
                value={nombre1}
                onChange={(e) => setNombre1(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre2">Segundo Nombre</Label>
              <Input
                id="nombre2"
                value={nombre2}
                onChange={(e) => setNombre2(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido1">Primer Apellido *</Label>
              <Input
                id="apellido1"
                value={apellido1}
                onChange={(e) => setApellido1(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido2">Segundo Apellido</Label>
              <Input
                id="apellido2"
                value={apellido2}
                onChange={(e) => setApellido2(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
              <Select
                value={tipo_documento}
                onValueChange={setTipo_documento}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="PP">Pasaporte</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_documento">Número de Documento *</Label>
              <Input
                id="numero_documento"
                value={numero_documento}
                onChange={(e) => setNumero_documento(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nacionalidad">Nacionalidad *</Label>
              <Select
                value={nacionalidad}
                onValueChange={setNacionalidad}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu nacionalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Colombiana">Colombiana</SelectItem>
                  <SelectItem value="Venezolana">Venezolana</SelectItem>
                  <SelectItem value="Ecuatoriana">Ecuatoriana</SelectItem>
                  <SelectItem value="Peruana">Peruana</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Brasileña">Brasileña</SelectItem>
                  <SelectItem value="Otra">Otra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                disabled={isLoading}
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
