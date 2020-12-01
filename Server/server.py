from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

app = Flask(__name__)

joystickActivo = 0
sensorDistancia = 3000

@app.route('/')
def index():
	return render_template('main.html')

@app.route('/modo', methods=['POST','GET'])
def modo():
	global joystickActivo

	if request.method == 'POST':
		joystickActivo = request.form['activo']
	elif request.method == 'GET':
		return jsonify(joystickActivo)

@app.route('/distancia', methods=['POST','GET'])
def distancia():
	global sensorDistancia

	if request.method == 'POST':
		sensorDistancia = request.form['distancia']
	elif request.method == 'GET':
		return jsonify(sensorDistancia)


@app.route('/comandos', methods=['POST','GET'])
def comandos():
	if request.method == 'POST':
		x = request.form['ejeX']
		y = request.form['ejeY']
		actualizar(x,y)
		return 'Se reciben las coordenadas ' + x + ' e ' + y
	elif request.method == 'GET':
		conn = mysql.connect()
		cursor = conn.cursor()
		cursor.execute('SELECT * from Comandos')
		return jsonify(cursor.fetchone())

# Metodo eficiente para actualizar el valor con id 1
def actualizar(x,y):
	conn = mysql.connect()
	cursor = conn.cursor()
	cursor.execute('''UPDATE picar.comandos SET ejeX = %s, ejeY= %s WHERE idComando = 1''', ( x , y) )
	conn.commit()


if __name__ == "__main__":
    # Se agrega host='0.0.0.0' para que el server sea visible por toda la red
	# Ver "Externally Visible Server": http://flask.pocoo.org/docs/0.12/quickstart/#a-minimal-application
	# Se agrega Threaded para que pueda manejar post de los comandos y get del auto al mismo tiempo
	app.run( host='0.0.0.0' , threaded = True, debug = True , port = 8000)