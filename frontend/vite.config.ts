import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para leer variables de entorno del archivo .env
function loadEnvFile(envPath: string): Record<string, string> {
  try {
    const envContent = readFileSync(envPath, "utf-8");
    const env: Record<string, string> = {};
    
    envContent.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join("=").trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    return {};
  }
}

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno: primero el .env raíz, luego el de frontend
  const rootEnvPath = path.resolve(__dirname, "..");
  const frontendEnvPath = __dirname;
  
  // loadEnv busca automáticamente variables VITE_ en los .env
  // Primero carga del raíz (mayor prioridad), luego del frontend
  const rootEnv = loadEnv(mode, rootEnvPath, "");
  const frontendEnv = loadEnv(mode, frontendEnvPath, "");
  
  // También leer el .env raíz manualmente para variables sin prefijo VITE_
  const rootEnvFile = loadEnvFile(path.resolve(rootEnvPath, ".env"));
  
  // Mapear variables del .env raíz sin prefijo VITE_ a formato VITE_
  const mappedRootEnv: Record<string, string> = {};
  if (rootEnvFile.FRONTEND_HOST) {
    mappedRootEnv.VITE_FRONTEND_HOST = rootEnvFile.FRONTEND_HOST;
  }
  if (rootEnvFile.FRONTEND_PORT) {
    mappedRootEnv.VITE_FRONTEND_PORT = rootEnvFile.FRONTEND_PORT;
  }
  
  // Combinar: raíz (prioridad) > frontend (menor prioridad)
  // rootEnv ya contiene VITE_API_URL del .env raíz si existe
  const finalEnv = { ...frontendEnv, ...rootEnv, ...mappedRootEnv };
  
  console.log("🔧 Configuración del servidor:", {
    host: finalEnv.VITE_FRONTEND_HOST || "localhost",
    port: finalEnv.VITE_FRONTEND_PORT || "5173",
    apiUrl: finalEnv.VITE_API_URL || "no configurado",
    fuente: rootEnv.VITE_API_URL || rootEnvFile.FRONTEND_HOST ? "raíz (.env)" : frontendEnv.VITE_FRONTEND_HOST ? "frontend (.env)" : "default"
  });
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules/framer-motion")) return "framer-motion";
            if (id.includes("node_modules/react-leaflet") || id.includes("node_modules/leaflet")) return "leaflet";
          },
        },
      },
      cssCodeSplit: true,
    },
    server: {
      host: finalEnv.VITE_FRONTEND_HOST || "localhost",
      port: parseInt(finalEnv.VITE_FRONTEND_PORT || "5173"),
      allowedHosts: ["7654d8ac0c1e.ngrok-free.app"], // 🔥 permite todos los subdominios de ngrok
    },
  };
});
