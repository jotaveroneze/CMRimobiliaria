from extensions import db
from flask_login import UserMixin


class Usuario(db.Model, UserMixin):

    __tablename__ = 'usuario'

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    nome = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(150),
        nullable=False,
        unique=True
    )

    senha = db.Column(
        db.String(255),
        nullable=False
    )

    tipo_usuario = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    foto = db.Column(
        db.String(255),
        nullable=True
    )

    whatsapp = db.Column(
        db.String(20),
        nullable=True
    )

    descricao = db.Column(
        db.Text,
        nullable=True
    )