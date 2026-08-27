import time

from flask import (
    Blueprint,
    request,
    jsonify,
    render_template,
    session,
    redirect,
    url_for
)

from controller.esqueci_senha_controller import (
    solicitar_codigo_redefinicao,
    validar_codigo_redefinicao,
    alterar_senha_redefinicao
)


esqueci_senha_bp = Blueprint(
    'esqueci_senha',
    __name__,
    url_prefix='/esqueci-senha'
)


# ==========================================
# ENVIAR CÓDIGO
# ==========================================

@esqueci_senha_bp.route(
    '/enviar-codigo',
    methods=['POST']
)
def enviar_codigo():

    dados = request.get_json()


    if not dados:

        return jsonify({
            'sucesso': False,
            'erro': 'Nenhum dado recebido.'
        }), 400


    email = dados.get(
        'email',
        ''
    ).strip()


    if not email:

        return jsonify({
            'sucesso': False,
            'erro': 'Digite seu e-mail.'
        }), 400


    sucesso, erro = solicitar_codigo_redefinicao(
        email
    )


    if not sucesso:

        return jsonify({
            'sucesso': False,
            'erro': erro
        }), 404


    return jsonify({
        'sucesso': True,
        'mensagem': 'Código enviado com sucesso.'
    }), 200


# ==========================================
# VERIFICAR CÓDIGO
# ==========================================

@esqueci_senha_bp.route(
    '/verificar-codigo',
    methods=['GET', 'POST']
)
def verificar_codigo():

    # Precisa ter iniciado o processo
    if not session.get(
        'redefinir_email'
    ):

        return redirect(
            url_for(
                'login.login'
            )
        )


    if request.method == 'POST':

        codigo = request.form.get(
            'codigo',
            ''
        ).strip()


        if not codigo:

            return render_template(
                'esqueci_senha_codigo.html',
                erro='Digite o código.'
            )


        valido = validar_codigo_redefinicao(
            codigo
        )


        if not valido:

            return render_template(
                'esqueci_senha_codigo.html',
                erro='Código incorreto.'
            )


        # Código correto
        time.sleep(1.5)


        return redirect(
            url_for(
                'esqueci_senha.redefinir_senha'
            )
        )


    return render_template(
        'esqueci_senha_codigo.html'
    )


# ==========================================
# REDEFINIR SENHA
# ==========================================

@esqueci_senha_bp.route(
    '/redefinir-senha',
    methods=['GET', 'POST']
)
def redefinir_senha():

    # Precisa ter validado o código
    if (
        not session.get(
            'redefinir_email'
        )
        or
        not session.get(
            'redefinir_codigo_validado'
        )
    ):

        return redirect(
            url_for(
                'login.login'
            )
        )


    # ======================================
    # POST - ALTERAR SENHA
    # ======================================

    if request.method == 'POST':

        senha = request.form.get(
            'senha',
            ''
        )

        confirmar_senha = request.form.get(
            'confirmar_senha',
            ''
        )


        sucesso, erro = alterar_senha_redefinicao(
            senha,
            confirmar_senha
        )


        if not sucesso:

            return render_template(
                'redefinir_senha.html',
                erro=erro
            )


        return redirect(
            url_for(
                'login.login'
            )
        )


    # ======================================
    # GET
    # ======================================

    return render_template(
        'redefinir_senha.html'
    )