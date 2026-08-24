from flask import current_app
from flask_mail import Message


def enviar_codigo_email(mail, nome, email, codigo):

    mensagem = Message(
        subject='Código de verificação - Imobiliária',
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[email]
    )

    mensagem.body = f"""
Olá, {nome}!

Seu código de verificação para criar sua conta é:

{codigo}

Digite esse código na tela de cadastro para continuar.

Se você não solicitou este cadastro, ignore este e-mail.

Atenciosamente,
Equipe Imobiliária
"""

    mail.send(mensagem)