"""
Subida de imágenes a Cloudinary usando CLOUDINARY_URL.
"""
import io
import os
from fastapi import HTTPException


def upload_image(content: bytes) -> str:
    """
    Sube los bytes de una imagen a Cloudinary y devuelve la URL segura.
    content: bytes del archivo de imagen (leer con await file.read() en la ruta).
    """
    cloudinary_url = os.getenv("CLOUDINARY_URL")
    if not cloudinary_url:
        raise HTTPException(
            status_code=503,
            detail="CLOUDINARY_URL no configurada. No se pueden subir imágenes.",
        )
    try:
        import cloudinary
        import cloudinary.uploader
        cloudinary.config(cloudinary_url=cloudinary_url)
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Servicio de imágenes no disponible (cloudinary no instalado).",
        )

    try:
        if not content:
            raise HTTPException(status_code=400, detail="El archivo está vacío.")
        result = cloudinary.uploader.upload(
            io.BytesIO(content),
            resource_type="image",
        )
        url = result.get("secure_url") or result.get("url")
        if not url:
            raise HTTPException(status_code=500, detail="Cloudinary no devolvió URL.")
        return url
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al subir la imagen: {str(e)}",
        )
