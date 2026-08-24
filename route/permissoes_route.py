from flask import Blueprint, jsonify, request, session

from controller.permissoes_controller import (
    listar_usuarios,
    alterar_permissao
)


permissoes_bp = Blueprint(
    'permissoes',
    __name__,
    url_prefix='/permissoes'
)


# ==========================================
# VERIFICAR SE É CEO
# ==========================================

def usuario_eh_ceo():

    return session.get('tipo_usuario') == 1


# ==========================================
# LISTAR USUÁRIOS
# ==========================================

@permissoes_bp.route(
    '/usuarios',
    methods=['GET']
)
def usuarios():

    if not usuario_eh_ceo():

        return jsonify({
            'erro': 'Acesso não autorizado.'
        }), 403

    usuarios = listar_usuarios()

    lista = []

    for usuario in usuarios:

        lista.append({
            'id': usuario.id,
            'nome': usuario.nome,
            'email': usuario.email,
            'tipo_usuario': usuario.tipo_usuario
        })

    return jsonify(lista)


# ==========================================
# ALTERAR PERMISSÃO
# ==========================================

@permissoes_bp.route(
    '/alterar',
    methods=['POST']
)
def alterar():

    if not usuario_eh_ceo():

        return jsonify({
            'erro': 'Acesso não autorizado.'
        }), 403

    dados = request.get_json()

    usuario_id = dados.get('usuario_id')
    nova_permissao = dados.get('tipo_usuario')

    if usuario_id is None or nova_permissao is None:

        return jsonify({
            'erro': 'Dados incompletos.'
        }), 400

    try:

        usuario_id = int(usuario_id)
        nova_permissao = int(nova_permissao)

    except (TypeError, ValueError):

        return jsonify({
            'erro': 'Dados inválidos.'
        }), 400

    sucesso, erro = alterar_permissao(
        usuario_id,
        nova_permissao
    )

    if not sucesso:

        return jsonify({
            'erro': erro
        }), 400

    return jsonify({
        'sucesso': True
    })