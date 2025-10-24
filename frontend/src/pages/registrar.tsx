"use client";


import type React from "react";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Award as IdCard,
  Phone,
  User,
  Flag,
  Home,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTheme } from "../components/theme-provider";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../components/ToastProvider";

export default function Registrar() {
  const { toast } = useToastContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tipo_documento, setTipo_documento] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const { theme, setTheme } = useTheme();

  const [showCard, setShowCard] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const data2send = {
      email,
      password,
      tipo_documento,
      documento,
      telefono,
      nombre,
      apellido,
      nacionalidad,
      id_rol: 4,
    };

    try {
      const res = await fetch("http://localhost:8000/register/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data2send),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail ?? "Error en el registro");
      }

      toast({
        title: "Registro exitoso",
        description: data.message ?? "Tu cuenta ha sido creada correctamente",
        variant: "success"
      });

      navigate("/");
    } catch (err: any) {
      toast({
        title: "Error en el registro",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (email == "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa un correo electrónico.",
        variant: "warning"
      });
      return;
    } else if (password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      });
      return;
    } else if (password == "" && confirmPassword == "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa una contraseña.",
        variant: "warning"
      });
      return;
    }
    setShowCard(false); // 👈 solo avanza si las contraseñas coinciden
  };

  return (
    <div className={`min-h-screen`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-max">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Button>

            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant="outline"
              size="icon"
              className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Bienvenido a Reservify
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
              Registra tu cuenta de Reservify
            </p>
          </div>

          {/* Registro */}
          <div className="flex justify-center items-center space-x-4 h-full grid-cols-2">
            <Card
              className={`${showCard ? "block" : "hidden"
                } shadow-xl w-[23rem] border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300`}
            >
              <CardHeader className="space-y-0.5 pb-3">
                <CardTitle className="text-xl text-center text-gray-900 dark:text-white transition-colors duration-300">
                  Crea tu cuenta
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Ingresa tus datos para crear tu cuenta
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                    >
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                    >
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0.5 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                    >
                      Confirmar contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0.5 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2"></div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <Button
                    type="button"
                    onClick={handleContinue} // 👈 en lugar de setShowCard(false)
                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <Separator className="bg-gray-200 dark:bg-gray-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                      O continúa con
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="h-11 w-full border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                    type="button"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 transform hover:scale-[1.02]">
                      Google
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Datos personales */}
          <div className="justify-center items-center h-full">
            <Card
              className={`${showCard ? "hidden" : "block"
                } shadow-xl w-full border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300`}
            >
              <CardHeader
                className="space-y-1 pb-6 cursor-pointer"
                onClick={() => setShowCard(true)}
              >
                <CardTitle className="text-xl text-center text-gray-900 dark:text-white transition-colors duration-300">
                  Ingresa tus datos personales
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Ingresa tus datos para crear tu cuenta
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form
                  onSubmit={handleSubmit}
                  action="/"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Columna Izquierda */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="tipo_documento"
                        className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        Tipo de documento
                      </Label>
                      <div className=" relative">
                        <Select
                          value={tipo_documento}
                          onValueChange={setTipo_documento}
                          required
                        >
                          <SelectTrigger
                            style={{
                              border: "1px solid",
                              height: "44px",
                              width: "100%",
                              fontSize: "14px",
                              fontWeight: "400",
                              color: "#667085",
                            }}
                            className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          >
                            {/* <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" /> */}

                            <SelectValue placeholder="Selecciona el tipo de documento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="CC"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#667085",
                              }}
                            >
                              Cédula de Ciudadanía
                            </SelectItem>
                            <SelectItem
                              value="CE"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#667085",
                              }}
                            >
                              Cédula de Extranjería
                            </SelectItem>
                            <SelectItem
                              value="PP"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#667085",
                              }}
                            >
                              Pasaporte
                            </SelectItem>
                            <SelectItem
                              value="TI"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#667085",
                              }}
                            >
                              Tarjeta de Identidad
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="numero_documento"
                        className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        Numero de documento
                      </Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          id="numero_documento"
                          type="text"
                          placeholder="tu numero de documento"
                          value={documento}
                          onChange={(e) => setDocumento(e.target.value)}
                          className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="telefono"
                        className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        Numero de telefono
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="tu numero de telefono"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="nombre1"
                        className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        Nombre
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          id="nombre"
                          type="text"
                          placeholder="Tu nombre"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="apellido1"
                        className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        Apellido
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          id="apellidos"
                          type="text"
                          placeholder="Tu apellido"
                          value={apellido}
                          onChange={(e) => setApellido(e.target.value)}
                          className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="nacionalidad"
                        className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        Nacionalidad
                      </Label>
                      <div className="relative">
                        <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          id="nacionalidad"
                          type="text"
                          placeholder="tu nacionalidad"
                          value={nacionalidad}
                          onChange={(e) => setNacionalidad(e.target.value)}
                          className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón y resto del formulario */}
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2"></div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Cargando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Registrate</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <p>Al registrarte, aceptas nuestros</p>
            <div className="space-x-4 mt-1">
              <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded">
                Términos de Servicio
              </button>
              <span>•</span>
              <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded">
                Política de Privacidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
