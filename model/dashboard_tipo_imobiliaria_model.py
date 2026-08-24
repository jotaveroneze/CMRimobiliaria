from extensions import db

class DashboardTipoImobiliaria(db.Model):

    __tablename__ = 'dashboard_tipo_imobiliaria'

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    id_tipo_imobiliaria = db.Column(
        db.Integer,
        db.ForeignKey('tipo_imobiliaria.id'),
        nullable=False,
        unique=True
    )

    ordem = db.Column(
        db.Integer,
        nullable=False,
        unique=True
    )

    tipo_imobiliaria = db.relationship(
        'TipoImobiliaria',
        backref='dashboard'
    )