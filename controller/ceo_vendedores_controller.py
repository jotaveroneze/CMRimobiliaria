import os, uuid
from flask import current_app

from extensions import db

from model.tipo_imobiliaria_model import TipoImobiliaria
from model.usuario_model import Usuario
from model.usuario_tipo_imobiliaria_model import UsuarioTipoImobiliaria


def carregar_vendedores_categoria(tipo_id):

    categoria = TipoImobiliaria.query.get(
        tipo_id
    )

    if not categoria:

        return None, []


    vendedores = (
        db.session.query(
            Usuario,
            UsuarioTipoImobiliaria
        )
        .join(
            UsuarioTipoImobiliaria,
            Usuario.id ==
            UsuarioTipoImobiliaria.id_usuario
        )
        .filter(
            UsuarioTipoImobiliaria.id_tipo_imobiliaria ==
            tipo_id
        )
        .order_by(
            UsuarioTipoImobiliaria.estrelas.desc()
        )
        .all()
    )


    return categoria, vendedores

# ==========================================
# LISTAR VENDEDORES DISPONÍVEIS
# ==========================================

def listar_vendedores_disponiveis(
    tipo_id
):

    # ======================================
    # BUSCA QUEM JÁ ESTÁ VINCULADO
    # ======================================

    vinculos = UsuarioTipoImobiliaria.query.filter_by(
        id_tipo_imobiliaria=tipo_id
    ).all()


    ids_vinculados = [
        vinculo.id_usuario
        for vinculo in vinculos
    ]


    # ======================================
    # BUSCA SOMENTE VENDEDORES
    # ======================================

    query = Usuario.query.filter(
        Usuario.tipo_usuario == 2
    )


    # ======================================
    # REMOVE OS JÁ VINCULADOS
    # ======================================

    if ids_vinculados:

        query = query.filter(
            ~Usuario.id.in_(
                ids_vinculados
            )
        )


    vendedores = query.order_by(
        Usuario.nome.asc()
    ).all()


    return vendedores

def adicionar_vendedor_categoria(
    usuario_id,
    tipo_id,
    estrelas,
    tempo_area,
    quantidade_vendas,
    whatsapp,
    descricao,
    foto=None
):

    # ==========================================
    # BUSCAR USUÁRIO
    # ==========================================

    usuario = Usuario.query.get(
        usuario_id
    )

    if not usuario:
        return False, 'Usuário não encontrado.'


    # ==========================================
    # VALIDAR SE É VENDEDOR
    # ==========================================

    if usuario.tipo_usuario != 2:

        return False, 'O usuário selecionado não é vendedor.'


    # ==========================================
    # VERIFICAR VÍNCULO EXISTENTE
    # ==========================================

    existente = UsuarioTipoImobiliaria.query.filter_by(
        id_usuario=usuario_id,
        id_tipo_imobiliaria=tipo_id
    ).first()

    if existente:

        return False, 'Esse vendedor já está cadastrado nesta categoria.'


    # ==========================================
    # VALIDAR estrelas
    # ==========================================

    try:

        estrelas = float(estrelas)

    except (TypeError, ValueError):

        return False, 'Quantidade de estrelas inválida.'

    if estrelas < 0 or estrelas > 5:
        return False, 'As estrelas devem estar entre 0 e 5.'

    if estrelas * 2 != int(estrelas * 2):
        return False, 'As estrelas devem variar de 0,5 em 0,5.'


    if estrelas < 0 or estrelas > 5:

        return False, 'A estrelas deve estar entre 0 e 5.'


    # ==========================================
    # VALIDAR TEMPO NA ÁREA
    # ==========================================

    try:
        tempo_area = int(tempo_area)

    except (TypeError, ValueError):

        return False, 'Tempo na área inválido.'


    if tempo_area < 0:

        return False, 'Tempo na área inválido.'


    # ==========================================
    # VALIDAR QUANTIDADE DE VENDAS
    # ==========================================

    try:
        quantidade_vendas = int(
            quantidade_vendas
        )

    except (TypeError, ValueError):

        return False, 'Quantidade de vendas inválida.'


    if quantidade_vendas < 0:

        return False, 'Quantidade de vendas inválida.'


    try:

        # ==========================================
        # FOTO DO USUÁRIO
        # ==========================================

        if foto and foto.filename:

            extensao = os.path.splitext(
                foto.filename
            )[1].lower()


            permitidas = [
                '.png',
                '.jpg',
                '.jpeg',
                '.webp'
            ]


            if extensao not in permitidas:

                return False, 'Formato de foto inválido.'


            nome_arquivo = (
                f'{uuid.uuid4().hex}{extensao}'
            )


            pasta = os.path.join(
                current_app.root_path,
                'static',
                'imagens',
                'usuarios'
            )


            os.makedirs(
                pasta,
                exist_ok=True
            )


            caminho = os.path.join(
                pasta,
                nome_arquivo
            )


            foto.save(
                caminho
            )


            usuario.foto = nome_arquivo


        # ==========================================
        # DADOS GERAIS DO USUÁRIO
        # ==========================================

        usuario.whatsapp = whatsapp.strip() if whatsapp else None


        usuario.descricao = descricao.strip() if descricao else None


        # ==========================================
        # CRIAR VÍNCULO
        # ==========================================

        vinculo = UsuarioTipoImobiliaria(

            id_usuario=
                usuario_id,

            id_tipo_imobiliaria=
                tipo_id,

            estrelas=
                estrelas,

            tempo_area=
                tempo_area,

            quantidade_vendas=
                quantidade_vendas

        )


        db.session.add(
            vinculo
        )


        db.session.commit()


        return True, None


    except Exception as erro:

        db.session.rollback()

        print(
            'Erro ao adicionar vendedor:',
            erro
        )

        return False, 'Erro ao adicionar vendedor.'