from flask import Flask, request, Blueprint
from static.Backend.modules import main
from static.Backend.modules import historry



app = Flask(__name__)
app.register_blueprint(main.main, url_prefix='/static')
app.register_blueprint(historry.getHistory, url_prefix = '/static')

@app.route('/')
def home():
    return "¡Hola, mundo!"



if __name__ == '__main__':
    app.run(debug=True)