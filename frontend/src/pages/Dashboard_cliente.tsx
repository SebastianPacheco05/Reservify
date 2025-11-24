"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { EditProfileModal } from "../components/edit_profile_modal";
import { User, Phone, FileText, Globe } from "lucide-react";

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

export default function ClientDashboard() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de datos del usuario actual
  useEffect(() => {
    // Aquí normalmente obtendrías el ID del usuario actual desde el contexto de autenticación
    const currentUserId = 1; // Ejemplo

    fetch("http://10.5.213.111:8001/listar_cliente", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente: currentUserId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const clienteData = data.respuesta;
        if (clienteData) {
          setCliente({
            id_cliente: clienteData.id_cliente,
            nombre1: clienteData.nombre1,
            nombre2: clienteData.nombre2,
            apellido1: clienteData.apellido1,
            apellido2: clienteData.apellido2,
            nacionalidad: clienteData.nacionalidad,
            tipo_documento: clienteData.tipo_documento,
            numero_documento: clienteData.documento,
            telefono: clienteData.telefono,
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleProfileUpdate = (updatedCliente: Cliente) => {
    setCliente(updatedCliente);
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">
              No se pudo cargar la información del perfil
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${cliente.nombre1} ${cliente.nombre2 || ""} ${
    cliente.apellido1
  } ${cliente.apellido2 || ""}`.trim();
  const initials = `${cliente.nombre1[0]}${cliente.apellido1[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Bienvenido, {cliente.nombre1}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Editar perfil
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{fullName}</CardTitle>
                <CardDescription>Cliente #{cliente.id_cliente}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cliente.tipo_documento}
                    </p>
                    <p className="text-sm text-gray-600">
                      {cliente.numero_documento}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Teléfono
                    </p>
                    <p className="text-sm text-gray-600">{cliente.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Nacionalidad
                    </p>
                    <p className="text-sm text-gray-600">
                      {cliente.nacionalidad}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Actividad</CardTitle>
                <CardDescription>
                  Tu actividad reciente en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">
                      Reservas Activas
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-gray-600">
                      Reservas Completadas
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-600">Favoritos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reservas Recientes</CardTitle>
                <CardDescription>
                  Tus últimas reservas realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">Reserva #{item}001</p>
                          <p className="text-sm text-gray-600">Hace 2 días</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Completada
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cliente={cliente}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}
