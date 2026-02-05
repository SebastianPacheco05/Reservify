import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para leer variables de entorno del archivo .env
function loadEnvFile() {
  try {
    const envPath = path.resolve(__dirname, ".env");
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
    console.warn("No se pudo cargar el archivo .env, usando valores por defecto");
    return {};
  }
}

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno del archivo .env
  const envFile = loadEnvFile();
  const env = loadEnv(mode, __dirname, "");
  
  // Combinar ambas fuentes, priorizando el archivo .env
  const finalEnv = { ...env, ...envFile };
  
  console.log("🔧 Configuración del servidor:", {
    host: finalEnv.VITE_FRONTEND_HOST || "localhost",
    port: finalEnv.VITE_FRONTEND_PORT || "5173"
  });
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: finalEnv.VITE_FRONTEND_HOST || "localhost",
      port: parseInt(finalEnv.VITE_FRONTEND_PORT || "5173"),
      allowedHosts: ["7654d8ac0c1e.ngrok-free.app"], // 🔥 permite todos los subdominios de ngrok
    },
  };
});
