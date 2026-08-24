from extensions import db
import os
import uuid

from werkzeug.utils import secure_filename
from flask import render_template, redirect, url_for, jsonify, current_app
from flask_login import current_user

from model.tipo_imobiliaria_model import TipoImobiliaria
from model.dashboard_tipo_imobiliaria_model import DashboardTipoImobiliaria


def dashboard_ceo():

    if current_user.tipo_usuario != 1:
        return redirect(
            url_for('dashboard.dashboard_usuario')
        )

    categorias = (
        DashboardTipoImobiliaria.query
        .order_by(DashboardTipoImobiliaria.ordem.asc())
        .all()
    )

    return render_template(
        'dashboard_ceo.html',
        categorias=categorias
    )


def tipos_disponiveis():

    tipos_adicionados = (
        DashboardTipoImobiliaria.query
        .with_entities(
            DashboardTipoImobiliaria.id_tipo_imobiliaria
        )
        .all()
    )

    ids_adicionados = [
        tipo.id_tipo_imobiliaria
        for tipo in tipos_adicionados
    ]

    tipos = (
        TipoImobiliaria.query
        .filter(
            ~TipoImobiliaria.id.in_(ids_adicionados)
        )
        .order_by(TipoImobiliaria.nome.asc())
        .all()
    )

    return tipos


def adicionar_tipo_imobiliaria(id_tipo):

    tipo = TipoImobiliaria.query.get(id_tipo)

    if not tipo:

        return {
            'sucesso': False,
            'erro': 'Tipo de imobiliária não encontrado.'
        }, 404


    existente = DashboardTipoImobiliaria.query.filter_by(
        id_tipo_imobiliaria=id_tipo
    ).first()


    if existente:

        return {
            'sucesso': False,
            'erro': 'Essa categoria já está no dashboard.'
        }, 400


    ultima_categoria = (
        DashboardTipoImobiliaria.query
        .order_by(
            DashboardTipoImobiliaria.ordem.desc()
        )
        .first()
    )


    if ultima_categoria:
        proxima_ordem = ultima_categoria.ordem + 1
    else:
        proxima_ordem = 1


    nova_categoria = DashboardTipoImobiliaria(
        id_tipo_imobiliaria=id_tipo,
        ordem=proxima_ordem
    )


    db.session.add(nova_categoria)
    db.session.commit()


    return {
        'sucesso': True,
        'mensagem': 'Categoria adicionada com sucesso.'
    }


def cadastrar_tipo_imobiliaria(nome, foto=None):

    nome = nome.strip()

    if not nome:
        return False, 'O nome é obrigatório.'

    tipo_existente = TipoImobiliaria.query.filter_by(
        nome=nome
    ).first()

    if tipo_existente:
        return False, 'Esse tipo já existe.'


    # ==============================
    # FOTO PADRÃO
    # ==============================

    nome_arquivo = 'padrao.png'


    # ==============================
    # SE ENVIOU UMA FOTO
    # ==============================

    if foto and foto.filename:

        extensao = os.path.splitext(
            foto.filename
        )[1].lower()

        nome_arquivo = (
            f'{uuid.uuid4().hex}{extensao}'
        )

        caminho = os.path.join(
            current_app.root_path,
            'static',
            'imagens',
            'tipos',
            nome_arquivo
        )

        foto.save(caminho)


    # ==============================
    # CADASTRA
    # ==============================

    novo_tipo = TipoImobiliaria(
        nome=nome,
        foto=nome_arquivo
    )

    db.session.add(novo_tipo)
    db.session.commit()

    return True, None