from pydantic import BaseModel, EmailStr

class CredencialCreate(BaseModel):
    email: EmailStr
    password: str

class CredencialUpdate(CredencialCreate):
    id_credencial: int

class CredencialDelete(BaseModel):
    id_credencial: int
