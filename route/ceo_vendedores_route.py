from flask import (
    Blueprint,
    render_template,
    jsonify,
    request
)

from flask_login import (
    login_required,
    current_user
)

from controller.ceo_vendedores_controller import (
    carregar_vendedores_categoria, listar_vendedores_disponiveis, adicionar_vendedor_categoria
)


ceo_vendedores_bp = Blueprint(
    'ceo_vendedores',
    __name__,
    url_prefix='/ceo/vendedores'
)


@ceo_vendedores_bp.route(
    '/<int:tipo_id>'
)
@login_required
def vendedores(tipo_id):

    if current_user.tipo_usuario != 1:

        return 'Acesso negado.', 403


    categoria, vendedores = (
        carregar_vendedores_categoria(
            tipo_id
        )
    )


    if not categoria:

        return 'Categoria não encontrada.', 404


    return render_template(
        'ceo_vendedores.html',
        categoria=categoria,
        vendedores=vendedores
    )


@ceo_vendedores_bp.route(
    '/<int:tipo_id>/disponiveis',
    methods=['GET']
)
@login_required
def vendedores_disponiveis_route(
    tipo_id
):

    if current_user.tipo_usuario != 1:

        return jsonify({
            'erro': 'Acesso negado.'
        }), 403


    vendedores = listar_vendedores_disponiveis(
        tipo_id
    )


    return jsonify([
        {
            'id': vendedor.id,
            'nome': vendedor.nome,
            'foto': vendedor.foto,
            'email': vendedor.email,
            'whatsapp': vendedor.whatsapp,
            'descricao': vendedor.descricao
        }

        for vendedor in vendedores
    ])

@ceo_vendedores_bp.route(
    '/<int:tipo_id>/adicionar',
    methods=['POST']
)
@login_required
def adicionar_vendedor_route(
    tipo_id
):

    if current_user.tipo_usuario != 1:

        return jsonify({
            'erro': 'Acesso negado.'
        }), 403


    usuario_id = request.form.get(
        'usuario_id'
    )

    estrelas = request.form.get(
        'estrelas'
    )

    tempo_area = request.form.get(
        'tempo_area'
    )

    quantidade_vendas = request.form.get(
        'quantidade_vendas'
    )

    whatsapp = request.form.get(
        'whatsapp',
        ''
    )

    descricao = request.form.get(
        'descricao',
        ''
    )

    foto = request.files.get(
        'foto'
    )


    if not usuario_id:

        return jsonify({
            'erro': 'Vendedor não informado.'
        }), 400


    try:

        usuario_id = int(
            usuario_id
        )

    except ValueError:

        return jsonify({
            'erro': 'Vendedor inválido.'
        }), 400


    sucesso, erro = adicionar_vendedor_categoria(
        usuario_id,
        tipo_id,
        estrelas,
        tempo_area,
        quantidade_vendas,
        whatsapp,
        descricao,
        foto
    )


    if not sucesso:

        return jsonify({
            'erro': erro
        }), 400


    return jsonify({
        'sucesso': True
    })