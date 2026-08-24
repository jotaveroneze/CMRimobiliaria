from model.usuario_model import Usuario
from extensions import db


# ==========================================
# LISTAR USUÁRIOS
# ==========================================

def listar_usuarios():

    usuarios = Usuario.query.order_by(
        Usuario.nome.asc()
    ).all()

    return usuarios


# ==========================================
# ALTERAR PERMISSÃO
# ==========================================

def alterar_permissao(usuario_id, nova_permissao):

    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return False, 'Usuário não encontrado.'

    # Garante que a permissão é válida
    if nova_permissao not in [0, 1, 2]:
        return False, 'Permissão inválida.'

    usuario.tipo_usuario = nova_permissao

    db.session.commit()

    return True, None