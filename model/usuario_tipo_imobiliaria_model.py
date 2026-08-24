from extensions import db


class UsuarioTipoImobiliaria(db.Model):

    __tablename__ = 'usuario_tipo_imobiliaria'

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    id_usuario = db.Column(
        db.Integer,
        db.ForeignKey('usuario.id'),
        nullable=False
    )

    id_tipo_imobiliaria = db.Column(
        db.Integer,
        db.ForeignKey('tipo_imobiliaria.id'),
        nullable=False
    )


    usuario = db.relationship(
        'Usuario',
        backref='tipos_imobiliaria_vinculados'
    )


    tipo_imobiliaria = db.relationship(
        'TipoImobiliaria',
        backref='usuarios_vinculados'
    )