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

    quantidade_vendas = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    estrelas = db.Column(
        db.Numeric(2, 1),
        nullable=True
    )

    tempo_area = db.Column(
        db.Integer,
        nullable=True
    )

    usuario = db.relationship(
        'Usuario',
        backref='tipos_imobiliaria_vinculados'
    )

    tipo_imobiliaria = db.relationship(
        'TipoImobiliaria',
        backref='vendedores_vinculados'
    )

    __table_args__ = (
        db.UniqueConstraint(
            'id_usuario',
            'id_tipo_imobiliaria',
            name='uq_usuario_tipo_imobiliaria'
        ),
    )