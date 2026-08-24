from flask import (
    Blueprint,
    jsonify,
    request,
    session
)

from controller.editarUsuario_controller import (
    listar_usuarios_por_permissao,
    buscar_usuario_por_id,
    editar_usuario
)


editar_usuario_bp = Blueprint(
    'editar_usuario',
    __name__,
    url_prefix='/editar-usuario'
)


# ==========================================
# VERIFICAR CEO
# ==========================================

def usuario_eh_ceo():

    return session.get(
        'tipo_usuario'
    ) == 1


# ==========================================
# LISTAR POR PERMISSÃO
# ==========================================

@editar_usuario_bp.route(
    '/listar/<int:permissao>',
    methods=['GET']
)
def listar(permissao):

    if not usuario_eh_ceo():

        return jsonify({
            'erro': 'Acesso não autorizado.'
        }), 403

    if permissao not in [0, 1, 2]:

        return jsonify({
            'erro': 'Permissão inválida.'
        }), 400

    usuarios = listar_usuarios_por_permissao(
        permissao
    )

    return jsonify(
        usuarios
    )


# ==========================================
# BUSCAR USUÁRIO
# ==========================================

@editar_usuario_bp.route(
    '/<int:usuario_id>',
    methods=['GET']
)
def buscar(usuario_id):

    if not usuario_eh_ceo():

        return jsonify({
            'erro': 'Acesso não autorizado.'
        }), 403

    usuario = buscar_usuario_por_id(
        usuario_id
    )

    if not usuario:

        return jsonify({
            'erro': 'Usuário não encontrado.'
        }), 404

    return jsonify(
        usuario
    )


# ==========================================
# EDITAR USUÁRIO
# ==========================================

@editar_usuario_bp.route(
    '/<int:usuario_id>',
    methods=['POST']
)
def editar(usuario_id):

    if not usuario_eh_ceo():

        return jsonify({
            'erro': 'Acesso não autorizado.'
        }), 403

    dados = request.get_json()

    if not dados:

        return jsonify({
            'erro': 'Dados não enviados.'
        }), 400

    nome = dados.get(
        'nome',
        ''
    )

    email = dados.get(
        'email',
        ''
    )

    sucesso, erro = editar_usuario(
        usuario_id,
        nome,
        email
    )

    if not sucesso:

        return jsonify({
            'erro': erro
        }), 400

    return jsonify({
        'sucesso': True
    })