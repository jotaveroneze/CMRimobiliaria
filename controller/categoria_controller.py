import os
import uuid

from model.dashboard_tipo_imobiliaria_model import DashboardTipoImobiliaria

from werkzeug.utils import secure_filename

from extensions import db
from model.tipo_imobiliaria_model import TipoImobiliaria


PASTA_TIPOS = os.path.join(
    'static',
    'imagens',
    'tipos'
)


EXTENSOES_PERMITIDAS = {
    'png',
    'jpg',
    'jpeg',
    'webp'
}


def extensao_permitida(nome_arquivo):

    if '.' not in nome_arquivo:
        return False

    extensao = nome_arquivo.rsplit(
        '.',
        1
    )[1].lower()

    return extensao in EXTENSOES_PERMITIDAS


def editar_categoria(
    categoria_id,
    nome,
    foto=None
):

    # ==========================================
    # BUSCAR TIPO
    # ==========================================

    tipo = TipoImobiliaria.query.get(
        categoria_id
    )

    if not tipo:
        return False, 'Categoria não encontrada.'


    # ==========================================
    # VALIDAR NOME
    # ==========================================

    nome = nome.strip()

    if not nome:
        return False, 'O nome é obrigatório.'


    # ==========================================
    # VERIFICAR NOME DUPLICADO
    # ==========================================

    existente = TipoImobiliaria.query.filter(
        TipoImobiliaria.nome == nome,
        TipoImobiliaria.id != categoria_id
    ).first()

    if existente:
        return False, 'Já existe uma categoria com esse nome.'


    # ==========================================
    # ALTERAR NOME
    # ==========================================

    tipo.nome = nome


    # ==========================================
    # ALTERAR FOTO
    # ==========================================

    if foto and foto.filename:

        if not extensao_permitida(
            foto.filename
        ):
            return False, 'Formato de imagem inválido.'

        extensao = foto.filename.rsplit(
            '.',
            1
        )[1].lower()

        nome_arquivo = (
            f'{uuid.uuid4().hex}.{extensao}'
        )

        caminho = os.path.join(
            PASTA_TIPOS,
            nome_arquivo
        )

        os.makedirs(
            PASTA_TIPOS,
            exist_ok=True
        )

        foto.save(
            caminho
        )

        # ======================================
        # APAGA FOTO ANTIGA
        # ======================================

        if tipo.foto:

            foto_antiga = os.path.join(
                PASTA_TIPOS,
                tipo.foto
            )

            if os.path.exists(
                foto_antiga
            ):

                try:
                    os.remove(
                        foto_antiga
                    )

                except OSError:
                    pass

        tipo.foto = nome_arquivo


    # ==========================================
    # SALVAR
    # ==========================================

    try:

        db.session.commit()

        return True, None

    except Exception:

        db.session.rollback()

        return False, 'Erro ao atualizar categoria.'



def deletar_categoria(categoria_id):

    tipo = TipoImobiliaria.query.get(
        categoria_id
    )

    if not tipo:
        return False, 'Categoria não encontrada.'

    foto = tipo.foto

    try:

        # ==========================================
        # REMOVE VÍNCULO DO DASHBOARD
        # ==========================================

        DashboardTipoImobiliaria.query.filter_by(
            id_tipo_imobiliaria=categoria_id
        ).delete(
            synchronize_session=False
        )


        # ==========================================
        # REMOVE A CATEGORIA
        # ==========================================

        db.session.delete(
            tipo
        )


        # ==========================================
        # SALVA NO BANCO
        # ==========================================

        db.session.commit()


        # ==========================================
        # REMOVE A FOTO DO DISCO
        # ==========================================

        if foto:

            caminho_foto = os.path.join(
                PASTA_TIPOS,
                foto
            )

            if os.path.exists(
                caminho_foto
            ):

                try:

                    os.remove(
                        caminho_foto
                    )

                except OSError as erro_foto:

                    print(
                        'Erro ao apagar foto:',
                        erro_foto
                    )


        return True, None


    except Exception as erro:

        db.session.rollback()

        print(
            'Erro ao deletar categoria:',
            erro
        )

        return False, 'Erro ao deletar categoria.'