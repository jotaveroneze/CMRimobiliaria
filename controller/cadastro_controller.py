import random

from flask import session, redirect, url_for
from werkzeug.security import generate_password_hash

from extensions import db
from model.usuario_model import Usuario
from services.email_cadastro import enviar_codigo_email


def processar_cadastro(nome, email):

    # Verifica se o e-mail já está cadastrado
    usuario_existente = Usuario.query.filter_by(email=email).first()

    if usuario_existente:
        return False, 'Usuário já cadastrado.'

    # Gera o código
    codigo = random.randint(100000, 999999)

    # Salva os dados temporariamente na sessão
    session['cadastro_nome'] = nome
    session['cadastro_email'] = email
    session['cadastro_codigo'] = codigo

    from app import mail

    enviar_codigo_email(
        mail,
        nome,
        email,
        codigo
    )

    return True, None


def validar_codigo(codigo):

    codigo_correto = session.get('cadastro_codigo')

    if codigo_correto is not None and codigo == str(codigo_correto):
        return True

    return False


def cadastrar_usuario(senha, confirmar_senha):

    nome = session.get('cadastro_nome')
    email = session.get('cadastro_email')

    if not nome or not email:
        return False, 'Dados do cadastro não encontrados.'

    if senha != confirmar_senha:
        return False, 'As senhas não coincidem.'

    usuario_existente = Usuario.query.filter_by(
        email=email
    ).first()

    if usuario_existente:
        return False, 'E-mail já cadastrado!'

    senha_hash = generate_password_hash(senha)

    usuario = Usuario(
        nome=nome,
        email=email,
        senha=senha_hash
    )

    db.session.add(usuario)
    db.session.commit()

    session.pop('cadastro_nome', None)
    session.pop('cadastro_email', None)
    session.pop('cadastro_codigo', None)

    return True, None

SENHA_PADRAO = 'Imobiliaria@2026'


def cadastrar_usuario_ceo(nome, email):

    usuario_existente = Usuario.query.filter_by(
        email=email
    ).first()

    if usuario_existente:
        return False, 'Usuário já cadastrado.'

    senha_hash = generate_password_hash(
        SENHA_PADRAO
    )

    usuario = Usuario(
        nome=nome,
        email=email,
        senha=senha_hash,
        tipo_usuario=0
    )

    db.session.add(usuario)
    db.session.commit()

    return True, None