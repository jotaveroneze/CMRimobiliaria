from model.usuario_model import Usuario
from werkzeug.security import (
    check_password_hash,
    generate_password_hash
)

from extensions import db


SENHA_PADRAO = 'Imobiliaria@2026'


def autenticar_usuario(login, senha):

    usuario = Usuario.query.filter(
        (Usuario.email == login) |
        (Usuario.nome == login)
    ).first()

    if not usuario:
        return False

    senha_correta = check_password_hash(
        usuario.senha,
        senha
    )

    if not senha_correta:
        return False

    return usuario


def senha_eh_padrao(usuario):

    return check_password_hash(
        usuario.senha,
        SENHA_PADRAO
    )


def alterar_senha(usuario, nova_senha):

    if not nova_senha:
        return False, 'Digite uma nova senha.'

    if len(nova_senha) < 8:
        return False, 'A senha deve possuir pelo menos 8 caracteres.'

    if nova_senha == SENHA_PADRAO:
        return False, 'Escolha uma senha diferente da senha padrão.'

    usuario.senha = generate_password_hash(
        nova_senha
    )

    db.session.commit()

    return True, None

def buscar_usuario_por_id(usuario_id):

    return Usuario.query.get(usuario_id)