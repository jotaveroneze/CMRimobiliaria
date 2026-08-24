from model.tipo_imobiliaria_model import TipoImobiliaria
from model.usuario_model import Usuario
from model.usuario_tipo_imobiliaria_model import UsuarioTipoImobiliaria


def carregar_vendedores_categoria(
    tipo_id
):

    # ==========================================
    # BUSCAR CATEGORIA
    # ==========================================

    categoria = TipoImobiliaria.query.get(
        tipo_id
    )


    if not categoria:

        return None, []


    # ==========================================
    # BUSCAR VÍNCULOS
    # ==========================================

    vinculos = UsuarioTipoImobiliaria.query.filter_by(
        id_tipo_imobiliaria=tipo_id
    ).all()


    # ==========================================
    # IDS DOS USUÁRIOS
    # ==========================================

    ids_usuarios = [
        vinculo.id_usuario
        for vinculo in vinculos
    ]


    if not ids_usuarios:

        return categoria, []


    # ==========================================
    # SOMENTE VENDEDORES
    # ==========================================

    vendedores = Usuario.query.filter(

        Usuario.id.in_(
            ids_usuarios
        ),

        Usuario.tipo_usuario == 2

    ).order_by(

        Usuario.nome.asc()

    ).all()


    return categoria, vendedores