from flask import Flask, render_template
from flask_login import LoginManager
from dotenv import load_dotenv
import os

from extensions import db, mail
from model.usuario_model import Usuario
from model.tipo_imobiliaria_model import TipoImobiliaria

from route.cadastro_route import cadastro_route
from route.dashboard_route import dashboard_route
from route.login_route import login_route
from route.suporte_route import suporte_bp
from route.permissoes_route import permissoes_bp
from route.categoria_route import categoria_bp
from route.editarUsuario_route import editar_usuario_bp
from route.ceo_vendedores_route import ceo_vendedores_bp

load_dotenv()
app = Flask(__name__)


# ==============================
# LOGIN
# ==============================

login_manager = LoginManager()
login_manager.init_app(app)

login_manager.login_view = 'login.login'


@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))


# ==============================
# CONFIGURAÇÕES
# ==============================

app.config['SECRET_KEY'] = '34692b781c4c7cfa89c6e09601dca96f41de9a8dec769aad8d1f74cb34b9a2f7'


# ==============================
# BANCO DE DADOS
# ==============================

app.config['SQLALCHEMY_DATABASE_URI'] = (
    'mysql+pymysql://root:@127.0.0.1:3306/banco_imobiliaria'
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


# ==============================
# E-MAIL
# ==============================

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True

app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail.init_app(app)


# ==============================
# ROTAS
# ==============================

app.register_blueprint(cadastro_route)
app.register_blueprint(login_route)
app.register_blueprint(dashboard_route)
app.register_blueprint(suporte_bp)
app.register_blueprint(permissoes_bp)
app.register_blueprint(categoria_bp)
app.register_blueprint(editar_usuario_bp)
app.register_blueprint(ceo_vendedores_bp)


@app.route('/')
def login():
    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=True)