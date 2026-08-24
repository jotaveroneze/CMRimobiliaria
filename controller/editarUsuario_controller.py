from extensions import db
from model.usuario_model import Usuario


# ==========================================
# LISTAR USUÁRIOS POR PERMISSÃO
# ==========================================

def listar_usuarios_por_permissao(permissao):

    usuarios = Usuario.query.filter_by(
        tipo_usuario=permissao
    ).order_by(
        Usuario.nome.asc()
    ).all()

    return [
        {
            'id': usuario.id,
            'nome': usuario.nome,
            'email': usuario.email,
            'tipo_usuario': usuario.tipo_usuario
        }
        for usuario in usuarios
    ]


# ==========================================
# BUSCAR USUÁRIO POR ID
# ==========================================

def buscar_usuario_por_id(usuario_id):

    usuario = Usuario.query.get(
        usuario_id
    )

    if not usuario:
        return None

    return {
        'id': usuario.id,
        'nome': usuario.nome,
        'email': usuario.email,
        'tipo_usuario': usuario.tipo_usuario
    }


# ==========================================
# EDITAR USUÁRIO
# ==========================================

def editar_usuario(
    usuario_id,
    nome,
    email
):

    usuario = Usuario.query.get(
        usuario_id
    )

    if not usuario:
        return False, 'Usuário não encontrado.'

    nome = nome.strip()
    email = email.strip()

    if not nome:
        return False, 'O nome é obrigatório.'

    if not email:
        return False, 'O e-mail é obrigatório.'

    # Verifica se outro usuário já usa esse e-mail

    usuario_email = Usuario.query.filter(
        Usuario.email == email,
        Usuario.id != usuario_id
    ).first()

    if usuario_email:
        return False, 'Este e-mail já está cadastrado.'

    usuario.nome = nome
    usuario.email = email

    try:

        db.session.commit()

        return True, None

    except Exception as erro:

        db.session.rollback()

        print(
            'Erro ao editar usuário:',
            erro
        )

        return False, 'Erro ao editar usuário.'