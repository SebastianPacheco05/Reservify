from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_calculo_mensual(
    db: Session,
    nit: int,
    mes: int,
    anio: int,
    total_reservas: int,
    revenue: float,
    total_clientes: int,
):
    try:
        db.execute(
            text(
                "SELECT insersat_calculo_mensual(:nit, :mes, :anio, :total_reservas, :revenue, :total_clientes)"
            ),
            {
                "nit": nit,
                "mes": mes,
                "anio": anio,
                "total_reservas": total_reservas,
                "revenue": revenue,
                "total_clientes": total_clientes,
            },
        )
        db.commit()
        raise HTTPException(
            status_code=201, detail="Calculo mensual Insertado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el Calculo mensual: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el Calculo mensual: {str(e)}",
        )


def editar_calculo_mensual(
    db: Session,
    id_calculo: int,
    nit: int,
    mes: int,
    anio: int,
    total_reservas: int,
    revenue: float,
    total_clientes: int,
):
    try:
        db.execute(
            text(
                "SELECT editar_calculo_mensual(:id_calculo, :nit, :mes, :anio, :total_reservas, :revenue, :total_clientes)"
            ),
            {
                "id_calculo": id_calculo,
                "nit": nit,
                "mes": mes,
                "anio": anio,
                "total_reservas": total_reservas,
                "revenue": revenue,
                "total_clientes": total_clientes,
            },
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Cálculo mensual editado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el cálculo mensual: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el cálculo mensual: {str(e)}",
        )


def borrar_roles(db: Session, id_rol: int):
    try:
        db.execute(text("SELECT borrar_roles(:id_rol)"), {"id_rol": id_rol})
        db.commit()
        raise HTTPException(status_code=200, detail="Rol eliminado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el rol: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el rol: {str(e)}",
        )


def borrar_calculo_mensual(db: Session, id_calculo: int):
    try:
        db.execute(
            text("SELECT borrar_calculo_mensual(:id_calculo)"),
            {"id_calculo": id_calculo},
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Cálculo mensual eliminado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el cálculo mensual: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el cálculo mensual: {str(e)}",
        )
