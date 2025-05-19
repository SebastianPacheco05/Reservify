from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Configuración de la base de datos
    DATABASE_URL: str
    
    # Configuración de la aplicación
    APP_NAME: str = "Reservify"
    DEBUG: bool = True
    
    # Configuración de seguridad
    SECRET_KEY: str = "e11b7ef093416f53d0b00d9517568b4788fae66714320108fe8ae7480a64e259"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Configuración de la API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Reservify API"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Instancia global de configuración
settings = Settings()