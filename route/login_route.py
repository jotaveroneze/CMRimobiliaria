from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    session
)

from flask_login import login_user

from controller.login_controller import (
    autenticar_usuario,
    senha_eh_padrao,
    alterar_senha,
    buscar_usuario_por_id
)

from model.usuario_model import Usuario


login_route = Blueprint('login', __name__)


# ==========================================
# LOGIN
# ==========================================

@login_route.route('/', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':

        login_digitado = request.form['login']
        senha = request.form['senha']

        usuario = autenticar_usuario(
            login_digitado,
            senha
        )

        if not usuario:

            return render_template(
                'login.html',
                erro='Nome, e-mail ou senha incorretos.'
            )

        # ==========================================
        # VERIFICA SENHA PADRÃO
        # ==========================================

        if senha_eh_padrao(usuario):

            session['usuario_id'] = usuario.id

            return redirect(
                url_for('login.criar_senha')
            )

        # ==========================================
        # LOGIN NORMAL
        # ==========================================

        login_user(usuario)

        session['usuario_id'] = usuario.id
        session['usuario_nome'] = usuario.nome
        session['usuario_email'] = usuario.email
        session['tipo_usuario'] = usuario.tipo_usuario

        # ==========================================
        # CEO
        # ==========================================

        if usuario.tipo_usuario == 1:

            return redirect(
                url_for('dashboard.dashboard_ceo_route')
            )

        # ==========================================
        # USUÁRIO COMUM
        # ==========================================

        return redirect(
            url_for('dashboard.dashboard_usuario')
        )

    return render_template('login.html')


# ==========================================
# CRIAR SENHA
# ==========================================

@login_route.route('/criar-senha', methods=['GET', 'POST'])
def primeiro_acesso():

    usuario_id = session.get('usuario_id')

    if not usuario_id:
        return redirect(
            url_for('login.login')
        )

    usuario = buscar_usuario_por_id(usuario_id)

    if not usuario:
        session.clear()

        return redirect(
            url_for('login.login')
        )

    if request.method == 'POST':

        senha = request.form.get(
            'senha',
            ''
        ).strip()

        confirmar_senha = request.form.get(
            'confirmar_senha',
            ''
        ).strip()

        if senha != confirmar_senha:

            return render_template(
                'criar_senha.html',
                erro='As senhas não coincidem.'
            )

        sucesso, erro = alterar_senha(
            usuario,
            senha
        )

        if not sucesso:

            return render_template(
                'criar_senha.html',
                erro=erro
            )

        login_user(usuario)

        session['usuario_id'] = usuario.id
        session['usuario_nome'] = usuario.nome
        session['usuario_email'] = usuario.email
        session['tipo_usuario'] = usuario.tipo_usuario

        if usuario.tipo_usuario == 1:

            return redirect(
                url_for('dashboard.dashboard_ceo_route')
            )

        return redirect(
            url_for('dashboard.dashboard_usuario')
        )

    return render_template(
        'alterar_senha_primeiro_acesso.html'
    )