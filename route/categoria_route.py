from flask import (
    Blueprint,
    request,
    jsonify,
    session
)

from controller.categoria_controller import (
    editar_categoria, deletar_categoria
)


categoria_bp = Blueprint(
    'categoria',
    __name__,
    url_prefix='/categoria'
)


# ==========================================
# EDITAR CATEGORIA
# ==========================================

@categoria_bp.route(
    '/editar',
    methods=['POST']
)
def editar_categoria_route():

    # ==========================================
    # SOMENTE CEO
    # ==========================================

    if session.get(
        'tipo_usuario'
    ) != 1:

        return jsonify({
            'erro':
                'Acesso não autorizado.'
        }), 403


    # ==========================================
    # RECEBER DADOS
    # ==========================================

    categoria_id = request.form.get(
        'categoria_id'
    )

    nome = request.form.get(
        'nome',
        ''
    )

    foto = request.files.get(
        'foto'
    )


    # ==========================================
    # VALIDAR ID
    # ==========================================

    if not categoria_id:

        return jsonify({
            'erro':
                'Categoria inválida.'
        }), 400


    try:

        categoria_id = int(
            categoria_id
        )

    except ValueError:

        return jsonify({
            'erro':
                'Categoria inválida.'
        }), 400


    # ==========================================
    # CONTROLLER
    # ==========================================

    sucesso, erro = editar_categoria(
        categoria_id,
        nome,
        foto
    )


    if not sucesso:

        return jsonify({
            'erro': erro
        }), 400


    return jsonify({
        'sucesso': True
    })

# ==========================================
# DELETAR CATEGORIA
# ==========================================

@categoria_bp.route(
    '/<int:categoria_id>',
    methods=['DELETE']
)
def deletar_categoria_route(
    categoria_id
):

    # ==========================================
    # SOMENTE CEO
    # ==========================================

    if session.get(
        'tipo_usuario'
    ) != 1:

        return jsonify({
            'erro':
                'Acesso não autorizado.'
        }), 403


    # ==========================================
    # CONTROLLER
    # ==========================================

    sucesso, erro = deletar_categoria(
        categoria_id
    )


    if not sucesso:

        return jsonify({
            'erro': erro
        }), 400


    return jsonify({
        'sucesso': True
    })