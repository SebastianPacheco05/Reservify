import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"

interface ThemeToggleProps {
  isDarkMode: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-orange-200/20 hover:bg-orange-100/20 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-110 group"
      title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <div className="relative w-5 h-5">
        {/* Sol - visible en modo oscuro */}
        <Sun 
          className={`w-5 h-5 text-orange-500 transition-all duration-500 ${
            isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
        
        {/* Luna - visible en modo claro */}
        <Moon 
          className={`w-5 h-5 text-gray-700 absolute top-0 left-0 transition-all duration-500 ${
            !isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`}
        />
      </div>
      
      {/* Efecto de brillo al hacer hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Button>
  )
}
