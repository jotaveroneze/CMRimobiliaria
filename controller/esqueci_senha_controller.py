from werkzeug.security import generate_password_hash

from extensions import db

import random

from flask import session

from model.usuario_model import Usuario
from services.email_cadastro import enviar_codigo_email


# ==========================================
# SOLICITAR CÓDIGO DE REDEFINIÇÃO
# ==========================================

def solicitar_codigo_redefinicao(email):

    usuario = Usuario.query.filter_by(
        email=email
    ).first()


    if not usuario:

        return False, 'E-mail não cadastrado.'


    codigo = random.randint(
        100000,
        999999
    )


    session['redefinir_email'] = (
        usuario.email
    )

    session['redefinir_codigo'] = (
        codigo
    )

    session['redefinir_codigo_validado'] = (
        False
    )


    from app import mail


    enviar_codigo_email(
        mail,
        usuario.nome,
        usuario.email,
        codigo
    )


    return True, None


# ==========================================
# VALIDAR CÓDIGO
# ==========================================

def validar_codigo_redefinicao(
    codigo_digitado
):

    codigo_salvo = session.get(
        'redefinir_codigo'
    )


    if codigo_salvo is None:

        return False


    if str(codigo_digitado) != str(
        codigo_salvo
    ):

        return False


    session[
        'redefinir_codigo_validado'
    ] = True


    return True

# ==========================================
# REDEFINIR SENHA
# ==========================================

def alterar_senha_redefinicao(
    senha,
    confirmar_senha
):

    # ======================================
    # VERIFICAR SESSÃO
    # ======================================

    email = session.get(
        'redefinir_email'
    )

    codigo_validado = session.get(
        'redefinir_codigo_validado'
    )


    if not email or not codigo_validado:

        return False, (
            'Solicitação de redefinição inválida.'
        )


    # ======================================
    # VALIDAR CAMPOS
    # ======================================

    if not senha or not confirmar_senha:

        return False, (
            'Preencha os dois campos de senha.'
        )


    # ======================================
    # VERIFICAR SE SÃO IGUAIS
    # ======================================

    if senha != confirmar_senha:

        return False, (
            'As senhas não coincidem.'
        )


    # ======================================
    # TAMANHO MÍNIMO
    # ======================================

    if len(senha) < 8:

        return False, (
            'A senha deve possuir pelo menos 8 caracteres.'
        )


    # ======================================
    # BUSCAR USUÁRIO PELO EMAIL VALIDADO
    # ======================================

    usuario = Usuario.query.filter_by(
        email=email
    ).first()


    if not usuario:

        return False, (
            'Usuário não encontrado.'
        )


    # ======================================
    # GERAR HASH DA NOVA SENHA
    # ======================================

    usuario.senha = generate_password_hash(
        senha
    )


    # ======================================
    # SALVAR NO BANCO
    # ======================================

    try:

        db.session.commit()

    except Exception as erro:

        db.session.rollback()

        print(
            'Erro ao redefinir senha:',
            erro
        )

        return False, (
            'Erro ao redefinir a senha.'
        )


    # ======================================
    # LIMPAR DADOS DA REDEFINIÇÃO
    # ======================================

    session.pop(
        'redefinir_email',
        None
    )

    session.pop(
        'redefinir_codigo',
        None
    )

    session.pop(
        'redefinir_codigo_validado',
        None
    )


    return True, None