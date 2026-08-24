from flask import (
    Blueprint,
    render_template
)

from flask_login import (
    login_required,
    current_user
)

from controller.ceo_vendedores_controller import (
    carregar_vendedores_categoria
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