from extensions import db

class TipoImobiliaria(db.Model):

    __tablename__ = 'tipo_imobiliaria'

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    nome = db.Column(
        db.String(80),
        nullable=False,
        unique=True
    )

    foto = db.Column(
        db.String(255),
        nullable=False,
        default='padrao.png'
    )