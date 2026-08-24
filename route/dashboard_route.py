from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from controller.dashboard_controller import (
    dashboard_ceo,
    tipos_disponiveis,
    adicionar_tipo_imobiliaria,
    cadastrar_tipo_imobiliaria
)


dashboard_route = Blueprint(
    'dashboard',
    __name__
)


@dashboard_route.route('/dashboard/ceo')
@login_required
def dashboard_ceo_route():

    return dashboard_ceo()


@dashboard_route.route('/dashboard/ceo/tipos-disponiveis')
@login_required
def tipos_disponiveis_route():

    if current_user.tipo_usuario != 1:
        return {
            'erro': 'Acesso negado'
        }, 403

    tipos = tipos_disponiveis()

    return jsonify([
        {
            'id': tipo.id,
            'nome': tipo.nome,
            'foto': tipo.foto
        }
        for tipo in tipos
    ])


@dashboard_route.route(
    '/dashboard/ceo/adicionar-tipo',
    methods=['POST']
)
@login_required
def adicionar_tipo_route():

    if current_user.tipo_usuario != 1:

        return {
            'sucesso': False,
            'erro': 'Acesso negado.'
        }, 403


    dados = request.get_json()

    print("DADOS RECEBIDOS:", dados)


    if not dados:

        return {
            'sucesso': False,
            'erro': 'Nenhum dado foi recebido.'
        }, 400


    id_tipo = dados.get('id_tipo')

    print("ID TIPO:", id_tipo)


    if not id_tipo:

        return {
            'sucesso': False,
            'erro': 'Tipo de imobiliária não informado.'
        }, 400


    return adicionar_tipo_imobiliaria(id_tipo)


@dashboard_route.route(
    '/dashboard/ceo/cadastrar-tipo',
    methods=['POST']
)
@login_required
def cadastrar_tipo_route():

    if current_user.tipo_usuario != 1:

        return {
            'sucesso': False,
            'erro': 'Acesso negado.'
        }, 403


    nome = request.form.get(
        'nome',
        ''
    ).strip()

    foto = request.files.get(
        'foto'
    )


    if not nome:

        return {
            'sucesso': False,
            'erro': 'O nome é obrigatório.'
        }, 400


    sucesso, erro = cadastrar_tipo_imobiliaria(
        nome,
        foto
    )


    if not sucesso:

        return {
            'sucesso': False,
            'erro': erro
        }, 400


    return {
        'sucesso': True,
        'mensagem': 'Tipo de imobiliária cadastrado com sucesso.'
    }, 200